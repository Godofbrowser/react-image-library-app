import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const PROP_TYPES = {
  value: PropTypes.number,
  rateInline: PropTypes.bool,
  onClick: PropTypes.func
};

const DEFAULT_PROPS = {
  value: 0,
  rateInline: false,
  onClick: () => {}
};

class RatingStars extends React.Component {
  constructor(props) {
    super(props);

    this.onClickStar = this.onClickStar.bind(this);
  }
  onClickStar(e, idx) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onClick(idx / 2);
  }
  getRating() {
    if (this.props.value <= 0) return 0;

    let value = this.props.value;
    let full = Math.floor(value);
    let half = value - full > 0 ? 0.5 : 0;
    let rating = full + half;

    return rating;
  }

  generateUId() {
    return Math.random()
      .toString(36)
      .substr(7);
  }

  render() {
    const uid = this.generateUId();
    const rating = this.getRating() * 2;

    return (
      <div className={classnames(["rating-stars", this.props.className])}>
        <div className="rating-group">
          {new Array(11).fill(0).map((v, i) => {
            let key = `${i}-${Date.now()}`;
            let r = i / 2;

            return i === 0 ? (
              <label
                key={key}
                aria-label="0 stars"
                className={classnames("rating__label", {
                  selectable: this.props.rateInline,
                  active: i === rating
                })}
                onClick={e => this.onClickStar(e, i)}
              >
                <input
                  className="rating__input rating__input--none"
                  onChange={() => {}}
                  name={`rating-${uid}`}
                  value="0"
                  type="radio"
                />
              </label>
            ) : (
              <label
                key={key}
                aria-label={`${r} stars`}
                className={classnames(
                  "rating__label",
                  { "rating__label--half": i % 2 !== 0 },
                  { selectable: this.props.rateInline },
                  { active: i === rating }
                )}
                onClick={e => this.onClickStar(e, i)}
              >
                <i
                  className={classnames([
                    "rating__icon",
                    "rating__icon--star",
                    "fa",
                    { "fa-star-half": i % 2 !== 0 },
                    { "fa-star": i % 2 === 0 }
                  ])}
                />
                <input
                  className={classnames("rating__input", {
                    active: i === rating
                  })}
                  name={`rating-${uid}`}
                  value={r}
                  type="radio"
                />
              </label>
            );
          })}
        </div>
      </div>
    );
  }
}

RatingStars.propTypes = PROP_TYPES;
RatingStars.defaultProps = DEFAULT_PROPS;

export default RatingStars;
