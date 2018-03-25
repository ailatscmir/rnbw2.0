import React, {Component} from 'react';
import XMLParser from 'react-xml-parser';
import Hammer from 'react-hammerjs';
import sizeMe from 'react-sizeme';

const hammerOptions = {
  touchAction: 'compute',
  recognizers: {
    tap: {
      time: 200,
      threshold: 2
    },
    pinch: {
      enable: true
    },
    pan:{

    }
  }
};

const getTransform = ({pan,pinch,x,y,currentX,currentY,scale,currentScale,center}) => {

  let left,top,divScale;
  if (pinch) {
    left = (x - center.x * currentScale) * 100;
    top = (y - center.y * currentScale) * 100;
    divScale = 100 * currentScale;
  } else {
    divScale = 100 * scale;
    if (pan) {
      left = (currentX - center.x * scale) * 100;
      top = (currentY - center.y * scale) * 100;
    } else {
      left = (x - center.x * scale) * 100;
      top = (y - center.y * scale) * 100;
    };
  }

  return {top,left,divScale}
}

const getRatio = (planDimension, componentDimension) =>{
  let pAsp = planDimension.height/planDimension.width;
  let cAsp = componentDimension.height/componentDimension.width;
  let divisionX = 1;
  let divisionY = pAsp / cAsp;
  return {pAsp,cAsp,divisionX,divisionY};
}

const fitScaleCalculate = (planDimension, componentDimension) => {
  let fitWidth = componentDimension.width / planDimension.width;
  let fitHeight = componentDimension.height / planDimension.height;
  return {fitHeight,fitWidth};
}

// const rangecheck = (x,y,center,scale,fitScale) => {
//
//   let range = (scale-1)/2;
//   console.log(y,scale,fitScale.fitHeight);
//   return {newx: x,newy:y};
//   // if ((1-scale>x - center.x * scale)||(x - center.x * scale>0)) return false;Math.max(Math.min(x,center.x+range)
//   // return true;
// }

class InteractiveSVG extends Component {
  constructor(props) {
    super(props);
    let XMLP = new XMLParser();
    let levels = this.props.levels.map(level => XMLP.parseFromString(level.raw));
    let [top, left, width, height] = levels[0].attributes.viewBox.split(' ');
    let planDimension = {
      width,
      height
    };

    let fitScale = fitScaleCalculate(planDimension, this.props.size);
    let center = {
      y: height * fitScale.fitWidth / 2 / this.props.size.height,
      x: width * fitScale.fitWidth / 2 / this.props.size.width
    };

    let ratio = getRatio(planDimension, this.props.size);

    this.state = {
      planDimension: planDimension,
      ratio:ratio,
      center: center,
      fitScale: fitScale,
      x: 0.5,
      y: 0.5,
      currentX: 0.5,
      currentY: 0.5,
      scale: 1,
      currentScale: 1,
      pan: false,
      pinch: false
    };

    this.handleWheel = this.handleWheel.bind(this);
    this.handlePan = this.handlePan.bind(this);
    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handlePinch = this.handlePinch.bind(this);
    this.handlePinchStart = this.handlePinchStart.bind(this);
    this.handlePinchEnd = this.handlePinchEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log({newProps:nextProps});
    let ratio = getRatio(this.state.planDimension, nextProps.size);
    this.setState({
      fitScale: fitScaleCalculate(this.state.planDimension, nextProps.size),
      ratio: ratio,
      center: {x:ratio.divisionX/2,y:ratio.divisionY/2}
    });
  }

  // ZOOM_EVENTS
  handleWheel(ev) {
    ev.preventDefault();
    let newScale = this.state.scale + 0.005 * ev.deltaY;
    if (newScale > 1) {
      this.setState({scale: newScale})
    } else {
      this.setState({scale: 1})
    }
  }
  handlePinchStart(ev) {
    this.setState({pinch: true});
  }
  handlePinchEnd(ev) {
    let {currentScale} = this.state;
    this.setState({pinch: false, scale: currentScale});
  }
  handlePinch(ev) {
    ev.preventDefault();
    let {scale} = this.state;
    this.setState({
      currentScale: scale * ev.scale
    });
  }

  // PAN_EVENTS
  handlePan(ev) {
    ev.preventDefault();
    let {x, y, scale,center,fitScale} = this.state;
    let newx = x + ev.deltaX / this.props.size.width;
    let newy = y + ev.deltaY / this.props.size.height
    this.setState({
      currentX: newx,
      currentY: newy
    })
  }
  handlePanStart(ev) {
    ev.preventDefault();
    this.setState({pan: true});
  }
  handlePanEnd(ev) {
    ev.preventDefault();
    let {currentX, currentY} = this.state;
    this.setState({pan: false, x: currentX, y: currentY});
  }

  render() {
    const {pan,pinch,x,y,currentX,currentY,scale,currentScale,center} = this.state;
    let {top,left,divScale} = getTransform({pan,pinch,x,y,currentX,currentY,scale,currentScale,center});

    return (<Hammer options={hammerOptions} onWheel={this.handleWheel} onPan={this.handlePan} onPanStart={this.handlePanStart} onPanEnd={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handlePinchEnd}>
      <div style={{
          height: '100vh',
          width: '100vw',
          background: '#333'
        }}>
        <div className='svgWrap' style={{
            position: 'relative',
            height: `${divScale}%`,
            width: `${divScale}%`,
            left: `${left}%`,
            top: `${top}%`
          }} dangerouslySetInnerHTML={{
            __html: this.props.levels[0].raw
          }}/>
      </div>
    </Hammer>);
  }

}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default sizeMeHOC(InteractiveSVG);
