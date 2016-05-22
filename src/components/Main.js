'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from './ImgFigure';

require('normalize.css/normalize.css');
require('styles/Main.scss');

//获取图片数据
let imageDatas = require('../data/imageDatas.json');
//利用自执行函数，将图片名信息转成图片URL信息
imageDatas = (function genImageDatas(imageDataArr) {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    let singleImageData = imageDataArr[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

//获取区间随机数
function getArrangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

export default class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      constant: {
        centerPos: {
          left: 0,
          top: 0
        },
        hPosRange: {//水平方向的取值范围
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: {//垂直方向的取值范围
          x: [0, 0],
          topY: [0, 0]
        }
      },
      imgArrangeArr: []
    };
  }

  render() {
    let imgFigures = [],
      controllerUnits = [];

    for (let index = 0; index < imageDatas.length; index++) {
      let value = imageDatas[index];

      if (!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos: {
            top: getArrangeRandom(0, 450),
            left: getArrangeRandom(0, 900)
          }
        };
      }

      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index}
                                 arrange={this.state.imgArrangeArr[index]}/>);
    }

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">{imgFigures}</section>
        <nav className="controller-nav">{controllerUnits}</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};
