import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link as CustomLink } from "../lib/routes";
import { toggleRatingDialog } from "../store";
import Image from "../components/ImageLazyLoad";
import RatingStars from "./RatingStars";

const PROP_TYPES = {
  image: PropTypes.object.isRequired,
  showProperties: PropTypes.bool
};

const DEFAULT_PROPS = {
  showProperties: false
};

class CardImage extends React.Component {
  constructor(props) {
    super(props);
    this.imageCont = null;

    this.onClickRatingStar = this.onClickRatingStar.bind(this);
    this.computeRatio = this.computeRatio.bind(this);
  }

  componentDidMount() {
    this.computeRatio();
    window.addEventListener('resize', this.computeRatio)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.computeRatio)
  }

  onClickRatingStar() {
    this.props.toggleRatingDialog(true, this.props.image);
  }

  computeRatio() {
    let w = this.props.image.dimension.width
    let h = this.props.image.dimension.height

    let r = this.imageCont.offsetWidth / w

    let width = w * r
    let height = h * r

    let img = this.imageCont.querySelector('img')
    img.style.height = (h * r) +'px'
    img.style.display = 'inline-block';

    // console.log(h, w, r, width);

    return { width, height }
  }

  render() {
    const { image } = this.props;

    return (
      <div className="card image-grid-card">
        <div className="image-cont" ref={ref => (this.imageCont = ref)}>
          <Image
            key={image.id}
            className="card-img-top"
            src={image.url}
            alt={image.name + " - Image library"}
            style={{ position: "relative" }}
          />
          {this.props.showProperties ? (
            <ul className="image-properties">
              <li
                className={classnames("visilility", {
                  public: !image.flag_private
                })}
              >
                {image.flag_private ? "Private" : "Public"}
              </li>
              {image.is_owner ? <li className="owner">Owner</li> : ""}
            </ul>
          ) : (
            ""
          )}
        </div>

        <div className="card-body">
          <h5 className="card-title text-capitalize">{image.name}</h5>

          {image.tags.length ? (
            <p className="card-text">
              <i className="fa fa-tags fa-fw mr-2" />
              {image.tags.map(tag => (
                <CustomLink key={tag.slug} route={`/tag/${tag.slug}/images`}>
                  <a href={`/tag/${tag.slug}/images`} className="img-tag">
                    {tag.name}
                  </a>
                </CustomLink>
              ))}
            </p>
          ) : (
            ""
          )}

          <div className="card-text row">
            <div className="col-6">
              {image.rating > 0 ? (
                <RatingStars
                  value={parseFloat(image.rating)}
                  className="sm"
                  onClick={this.onClickRatingStar}
                />
              ) : (
                <a href="javascript:void(0)" onClick={this.onClickRatingStar}>
                  No rating
                </a>
              )}
              {image.rating > 0 ? <span>({image.rating})</span> : ""}
            </div>
            <div className="col-6 text-right text-truncate">
              <small className="text-muted">
                <i className="fa fa-user" /> {image.user.name}
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CardImage.propTypes = PROP_TYPES;
CardImage.defaultProps = DEFAULT_PROPS;

const mapStateToProps = state => {
  return { user: state.user };
};

const mapDispatchToProps = dispatch => ({
  toggleRatingDialog: (status, image) =>
    dispatch(toggleRatingDialog(status, image))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardImage);
