require('normalize.css/normalize.css');
require('styles/Main.scss');

import React from 'react';

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

var Constant = {
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
};

class ImgFigure extends React.Component {
  render() {
    var styleObject = {};
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

function getArrangeRandom(low, high) {
  return Math.ceil(Math.random * (high - low) + low);
}

class AppComponent extends React.Component {

  //重新布局所有图片
  rearrange(centerIndex) {
    var imgArrangeArr = this.state.imgArrangeArr,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgArrangeTopArr = [],
      imgTopNum = Math.ceil(Math.random() * 2),
      topImgSpliceIndex = 0,

      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

    imgArrangeCenterArr[0].pos = centerPos;
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - imgTopNum));

    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, imgTopNum);
    imgArrangeTopArr.forEach(function (value, index) {
      imgArrangeTopArr[index].pos = {
        top:getArrangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
        left:getArrangeRandom(vPosRangeX[0],vPosRangeX[1])
      };
    });

    for (let i=0,j=imgArrangeArr.length,k=j/2;i<j;i++){
      let hPosArrangeTempX = null;

      if(i<k){
        hPosArrangeTempX = hPosRangeLeftSecX;
      }else{
        hPosArrangeTempX = hPosRangeRightSecX;
      }

      imgArrangeArr[i].pos = {
        top:getArrangeRandom(hPosRangeY[0],hPosRangeY[1]),
        left:getArrangeRandom(hPosArrangeTempX[0],hPosArrangeTempX[1])
      };

      if(imgArrangeTopArr && imgArrangeTopArr[0]){
        imgArrangeArr.splice(topImgSpliceIndex,0,imgArrangeTopArr[0]);
      }

      imgArrangeArr.splice(centerIndex,0,imgArrangeTopArr[0]);

      this.state = {
        imgArrangeArr:imgArrangeArr
      };
    }
  }

  //组件加载后为每张图片计算位置范围
  componentDidMount() {
    var stageDom = React.findDOMNode(this.refs.stage),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到imgFigure的大小
    var imgFigureDom = React.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    Constant.centerPos.left = halfStageW - halfImgW;
    Constant.centerPos.top = halfStageH - halfImgH;

    Constant.hPosRange.leftSecX[0] = -halfImgW;
    Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    Constant.hPosRange.y[0] = -halfImgH;
    Constant.hPosRange.y[1] = stageH - halfImgH;

    Constant.vPosRange.topY[0] = -halfImgH;
    Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    Constant.vPosRange.x[0] = halfStageW - imgW;
    Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    let controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {
      if (!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }

      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgArrangeArr[index]}/>);
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">{imgFigures}</section>
        <nav className="controller-nav">{controllerUnits}</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
