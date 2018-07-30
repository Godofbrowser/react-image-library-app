// Lazy load images
// ================
// - This is a custom, improved version of react-graceful-image
// - so as to support server-side rendering
// - I'll send a pull request in my spare time
// - Improvements
// - - CrossBrowser compatibility css fade animation (done)
// - - Server side rendering support (done)
// - - (Performance issue) Replace scroll even listener with IntersectionObserver
// - - Fix old inView method to also check from bottom (done)
// Original library: https://github.com/linasmnew/react-graceful-image

import React, { Component } from "react";
import PropTypes from "prop-types";
import throttle from "lodash.throttle";

let isServer = typeof window === "undefined" || typeof document === "undefined";

function registerListener(event, fn) {
  if (window.addEventListener) {
    window.addEventListener(event, fn);
  } else {
    window.attachEvent("on" + event, fn);
  }
}

function isInViewport(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const fadeIn = `
@-webkit-keyframes gracefulimage {
  0% {
    opacity: 0.25; }
  50% {
    opacity: 0.5; }
  100% {
    opacity: 1; } }

@keyframes gracefulimage {
  0% {
    opacity: 0.25; }
  50% {
    opacity: 0.5; }
  100% {
    opacity: 1; } }
`;

const IS_SVG_SUPPORTED =
  !isServer &&
  document.implementation.hasFeature(
    "http://www.w3.org/TR/SVG11/feature#Image",
    "1.1"
  );

class GracefulImage extends Component {
  constructor(props) {
    super(props);
    let placeholder = null;
    this.placeholderImage = null;
    this.observer = null;

    if (IS_SVG_SUPPORTED) {
      const width =
        this.props.style && this.props.style.width
          ? this.props.style.width
          : this.props.width
            ? this.props.width
            : "200";
      const height =
        this.props.style && this.props.style.height
          ? this.props.style.height
          : this.props.height
            ? this.props.height
            : "150";
      placeholder =
        "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width%3D'{{w}}' height%3D'{{h}}' viewBox%3D'0 0 {{w}} {{h}}'%2F%3E";
      placeholder = placeholder
        .replace(/{{w}}/g, width)
        .replace(/{{h}}/g, height);
    }

    // store a reference to the throttled function
    this.throttledFunction = throttle(this.lazyLoad, 150);

    this.state = {
      loaded: false,
      retryDelay: this.props.retry.delay,
      retryCount: 1,
      placeholder: placeholder
    };
  }

  /*
    Creating a stylesheet to hold the fading animation
  */
  addAnimationStyles() {
    const exists = document.head.querySelectorAll("[data-gracefulimage]");

    if (!exists.length) {
      const style = document.createElement("style");
      style.setAttribute("data-gracefulimage", "exists");

      style.type = "text/css";
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = fadeIn;
      } else {
        style.appendChild(document.createTextNode(fadeIn));
      }

      document.head.appendChild(style);
    }
  }

  /*
    Attempts to download an image, and tracks its success / failure
  */
  loadImage() {
    if (this.state.loaded) return;

    const image = new Image();
    image.onload = () => {
      this.setState({ loaded: true });
    };
    image.onerror = () => {
      this.handleImageRetries(image);
    };
    image.src = this.props.src;
  }

  /*
    If placeholder is currently within the viewport then load the actual image
    and remove all event listeners associated with it
  */
  lazyLoad = () => {
    if (isInViewport(this.placeholderImage)) {
      this.clearEventListeners();
      this.loadImage();
    }
  };

  /*
    Attempts to load an image src passed via props
    and utilises image events to track sccess / failure of the loading
  */
  componentDidMount() {
    if (isServer) {
      this.setState({ loaded: true }, this.initializeForServer);
    } else {
      this.setState({ loaded: false }, this.initializeForClient);
    }
  }

  initializeForServer() {}

  initializeForClient() {
    this.addAnimationStyles();

    // if user wants to lazy load
    if (!this.props.noLazyLoad && IS_SVG_SUPPORTED) {
      // check if already within viewport to avoid attaching listeners
      if (isInViewport(this.placeholderImage)) {
        this.loadImage();
      } else {
        this.observer = new IntersectionObserver(
          entries => {
            let image = entries[0];
            if (image.isIntersecting) {
              this.throttledFunction();
              this.observer.disconnect();
            }
          },
          { rootMargin: "120px 0px", threshold: 0 }
        );
        this.observer.observe(this.placeholderImage);

        registerListener("load", this.throttledFunction);
        registerListener("scroll", this.throttledFunction);
        registerListener("resize", this.throttledFunction);
        registerListener("gestureend", this.throttledFunction); // to detect pinch on mobile devices
      }
    } else {
      this.loadImage();
    }
  }

  clearEventListeners() {
    this.observer && this.observer.disconnect();
    window.removeEventListener("load", this.throttledFunction);
    window.removeEventListener("scroll", this.throttledFunction);
    window.removeEventListener("resize", this.throttledFunction);
    window.removeEventListener("gestureend", this.throttledFunction);
  }

  /*
    Clear timeout incase retry is still running
    And clear any existing event listeners
  */
  componentWillUnmount() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.clearEventListeners();
  }

  /*
    Handles the actual re-attempts of loading the image
    following the default / provided retry algorithm
  */
  handleImageRetries(image) {
    this.setState({ loaded: false }, () => {
      if (this.state.retryCount <= this.props.retry.count) {
        this.timeout = setTimeout(() => {
          // re-attempt fetching the image
          image.src = this.props.src;

          // update count and delay
          this.setState(prevState => {
            let updateDelay;
            if (this.props.retry.accumulate === "multiply") {
              updateDelay = prevState.retryDelay * this.props.retry.delay;
            } else if (this.props.retry.accumulate === "add") {
              updateDelay = prevState.retryDelay + this.props.retry.delay;
            } else if (this.props.retry.accumulate === "noop") {
              updateDelay = this.props.retry.delay;
            } else {
              updateDelay = "multiply";
            }

            return {
              retryDelay: updateDelay,
              retryCount: prevState.retryCount + 1
            };
          });
        }, this.state.retryDelay * 1000);
      }
    });
  }

  renderForServer() {
    return (
      <img
        src={this.props.src}
        className={this.props.className}
        width={this.props.width}
        height={this.props.height}
        style={{ ...this.props.style }}
        alt={this.props.alt}
        ref={this.state.loaded ? null : ref => (this.placeholderImage = ref)}
      />
    );
  }

  /*
    - If image hasn't yet loaded AND user didn't want a placeholder OR SVG not supported then don't render anything
    - Else if image has loaded then render the image
    - Else render the placeholder
  */
  render() {
    if (isServer) return this.renderForServer();

    if (!this.state.loaded && (this.props.noPlaceholder || !IS_SVG_SUPPORTED))
      return null;

    const src = this.state.loaded ? this.props.src : this.state.placeholder;
    const style = this.state.loaded
      ? {
          animationName: "gracefulimage",
          animationDuration: "250ms",
          animationIterationCount: 1,
          animationTimingFunction: "ease-in"
        }
      : { background: this.props.placeholderColor };

    return (
      <img
        src={src}
        className={this.props.className}
        width={this.props.width}
        height={this.props.height}
        style={{
          ...style,
          ...this.props.style
        }}
        alt={this.props.alt}
        ref={this.state.loaded ? null : ref => (this.placeholderImage = ref)}
      />
    );
  }
}

GracefulImage.defaultProps = {
  src: null,
  className: null,
  width: null,
  height: null,
  alt: "Broken image placeholder",
  style: {},
  placeholderColor: "#eee",
  retry: {
    count: 8,
    delay: 2,
    accumulate: "multiply"
  },
  noRetry: false,
  noPlaceholder: false,
  noLazyLoad: false
};

GracefulImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  alt: PropTypes.string,
  style: PropTypes.object,
  placeholderColor: PropTypes.string,
  retry: PropTypes.shape({
    count: PropTypes.number,
    delay: PropTypes.number,
    accumulate: PropTypes.string
  }),
  noRetry: PropTypes.bool,
  noPlaceholder: PropTypes.bool,
  noLazyLoad: PropTypes.bool
};

export default GracefulImage;
