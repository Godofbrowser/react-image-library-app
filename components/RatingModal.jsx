/**
 * Created by Emmy on 5/18/2018.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toggleRatingDialog, submitRating } from "../store";
import RatingStars from "./RatingStars";
import Image from "./ImageLazyLoad";

const starText = [
  "",
  "I hate it",
  "I dislike it",
  "I like it",
  "I love it",
  "I think it's amazing"
];

const PROP_TYPES = {
};
const DEFAULT_PROPS = {
  // image: {}
};

class RatingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.onSelectStar = this.onSelectStar.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.body.classList.add('no-scroll')
  }

  componentWillUnmount() {
    document.body.classList.remove('no-scroll')
  }

  handleSubmit(e) {
    e.preventDefault();
    return this.props.submitRating(this.props.image, this.state.value);
  }

  onSelectStar(v) {
    this.setState({
      value: v
    });
  }

  render() {
    return (
      <div className="app-modal">
        <div className="app-modal-dialog p-3">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center">
                How many stars is this image worth?
              </h5>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="col-12 py-4 text-center">
                <div className="form-group text-center">
                  <RatingStars
                    value={this.state.value}
                    className="lg d-block"
                    rateInline
                    onClick={v => this.onSelectStar(v)}
                  />
                  <small>{starText[Math.ceil(this.state.value)]}</small>
                </div>
                <div>
                  <Image
                    className="img-thumbnail"
                    src={this.props.image.url}
                    style={{ maxWidth: "250px" }}
                  />
                </div>
              </div>
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={e => this.props.toggleRatingDialog(false, null)}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary float-right">
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

RatingModal.propTypes = PROP_TYPES;
RatingModal.defaultProps = DEFAULT_PROPS;

const mapStateToProps = state => {
  return { user: state.user, image: state.ratingDialog.image };
};

const mapDispatchToProps = dispatch => ({
  toggleRatingDialog(status, image) {
    dispatch(toggleRatingDialog(status, image));
  },
  submitRating(image, value) {
    dispatch(submitRating(dispatch, image, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RatingModal);
