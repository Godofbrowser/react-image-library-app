import React from "react";
import {connect} from 'react-redux'
import PropTypes from 'prop-types';

import CardImage from "./CardImage";
import RatingModal from "./RatingModal";

const PROP_TYPES = {
  showProperties: PropTypes.bool
}

const DEFAULT_PROPS = {
  showProperties: false
}

class ImageGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images } = this.props;
    return (
      <div style={{ maxWidth: "1700px", margin: "55px auto" }}>
        <div className="image-grid card-columns">
          {images.map((image, idx) => (
            <CardImage key={image.id}
              image={image}
              showProperties={this.props.showProperties}
            />
          ))}
        </div>

        {this.props.showRatingDialog ? (<RatingModal image={this.props.ratingDialogImage} />) : ('')}
      </div>
    );
  }
}

ImageGrid.propTypes = PROP_TYPES
ImageGrid.defaultProps = DEFAULT_PROPS

const mapStateToProps = state => {
  return { 
    showRatingDialog: state.ratingDialog.isOpen,
    ratingDialogImage: state.ratingDialog.image
   }
}

export default connect(mapStateToProps)(ImageGrid);
