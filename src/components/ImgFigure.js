'use strict';

import React from 'react';

require('styles/ImgFigure.scss');

export default class ImgFigure extends React.Component {
  render() {
    let styleObject = {};
    if(this.props.arrange.pos){
      styleObject = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObject}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

ImgFigure.displayName = 'ImgFigure';

// Uncomment properties you need
// ImgFigure.propTypes = {};
// ImgFigure.defaultProps = {};
