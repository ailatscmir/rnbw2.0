import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Hammer from 'react-hammerjs';
import sizeMe from 'react-sizeme';
// import {Button} from 'material-ui/';
// import ZoomInIcon from 'material-ui-icons/ZoomIn';
// import ZoomOutIcon from 'material-ui-icons/ZoomOut';

import Map from './Map'

const MIN_SCALE = 1;
const MAX_SCALE = 4;

const setMovementComplete = () => {
  return {type:'SET_MOVEMENT_COMPLETE',payload:true}
}

const mapStateToProps = state => {
  return {
    selectedLocation:state.selectedLocation,
    selectedCenter:state.selectedCenter
  }
};

const mapDispatchToProps = dispatch => {
  return {setMovementComplete: bindActionCreators(setMovementComplete, dispatch)}
}

const hammerOptions = {
  touchAction: 'compute',
  recognizers: {
    tap: {
      time: 200,
      threshold: 2
    },
    pinch: {
      enable: true,
      pointers: 2,
      threshold: 0.001
    },
    pan: {
      threshold: 1,
      pointers: 1
    }
  }
};

const getTransform = ({
  pan,
  pinch,
  x,
  y,
  currentX,
  currentY,
  scale,
  currentScale,
  center
}) => {
  let left,
    top,
    divScale;
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
  return {top, left, divScale}
}

const getRatio = (planDimension, componentDimension) => {
  let pAsp = planDimension.height / planDimension.width;
  let cAsp = componentDimension.height / componentDimension.width;
  let divisionX = 1;
  let divisionY = pAsp / cAsp;
  return {pAsp, cAsp, divisionX, divisionY};
}

const clamp = ({x, y, scale,ratio}) => {
  let rangeX = Math.max((ratio.divisionX*scale-1)/2,0);
  let rangeY = Math.max((ratio.divisionY*scale-1)/2,0);
  x = Math.max(Math.min(x,0.5+rangeX),0.5-rangeX);
  y = Math.max(Math.min(y,0.5+rangeY),0.5-rangeY);

  scale = Math.max(Math.min(scale, MAX_SCALE), MIN_SCALE);
  return {x, y, scale};
}

class InteractiveSvg extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;

    let [,, width, height] = levels[0]['@attributes'].viewBox.split(' ');
    let planDimension = {
      width,
      height
    };
    let ratio = getRatio(planDimension, this.props.size);
    this.state = {
      movedTo:null,
      levels: levels,
      planDimension: planDimension,
      ratio: ratio,
      center: {
        x: ratio.divisionX / 2,
        y: ratio.divisionY / 2
      },
      focusPoint:{
        x: ratio.divisionX / 2,
        y: ratio.divisionY / 2
      },
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
  setTransform({
    x = this.state.x,
    y = this.state.y,
    scale = this.state.scale,
    current = false
  }) {
    let {ratio} = this.state;
    ({x, y, scale} = clamp({x, y, scale,ratio}));
    if (!current) {
      this.setState({x: x, y: y, scale: scale});
    } else {
      this.setState({currentX: x, currentY: y, currentScale: scale});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCenter){
      if (!nextProps.selectedCenter.moved) {
        let planDimension = this.state.planDimension;
        let selectedCenter = nextProps.selectedCenter
        // console.log('moveTo',{x:selectedCenter.x/planDimension.width,y:selectedCenter.y/planDimension.height});
        this.setState({focusPoint:{x:selectedCenter.x/planDimension.width,y:selectedCenter.y/planDimension.height}});
        // this.setTransform({x:selectedCenter.x/planDimension.width*this.state.scale,y:selectedCenter.y/planDimension.height*this.state.scale});
        this.props.setMovementComplete();
      }
    }
    let ratio = getRatio(this.state.planDimension, nextProps.size);
    this.setState({
      ratio: ratio,
      center: {
        x: ratio.divisionX / 2,
        y: ratio.divisionY / 2
      }
    });
  }



  // ZOOM_EVENTS
  handleWheel(ev) {
    console.log(ev);
    ev.preventDefault();
    let newScale = this.state.scale + 0.005 * ev.deltaY;
    this.setTransform({
      scale: (newScale > 1)
        ? newScale
        : 1
    });
  }

  handlePinchStart(ev) {
    console.log(ev);
    console.log('start');
    this.setState({pinch: true});
  }

  handlePinchEnd(ev) {
    console.log(ev);
    console.log('end');
    let {currentScale} = this.state;
    this.setState({pinch: false});
    this.setTransform({scale: currentScale});
  }

  handlePinch(ev) {
    console.log(ev);
    console.log('pinch');
    ev.preventDefault();
    let {scale} = this.state;
    this.setTransform({
      scale: scale * ev.scale,
      current: true
    });
  }

  // PAN_EVENTS
  handlePan(ev) {
    console.log(ev);
    ev.preventDefault();
    let {x, y} = this.state;
    let newx = x + ev.deltaX / this.props.size.width;
    let newy = y + ev.deltaY / this.props.size.height;
    this.setTransform({x: newx, y: newy, current: true});
  }

  handlePanStart(ev) {
    console.log(ev);
    ev.preventDefault();
    this.setState({pan: true});
  }

  handlePanEnd(ev) {
    console.log(ev);
    ev.preventDefault();
    let {currentX, currentY} = this.state;
    this.setState({pan: false, x: currentX, y: currentY});
  }
  handleZoomButton(par){
    let {scale} = this.state;
    let factor = 0.3;
    this.setTransform({scale:scale*(1+factor*par)});
  }
  render() {
    const {ratio} = this.state;

    return (<Hammer options={hammerOptions}
              // onWheel={this.handleWheel} onPan={this.handlePan} onPanStart={this.handlePanStart} onPanEnd={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handlePinchEnd} onPinchCancel={this.handlePinchEnd}
            >
      <div style={{height: '100vh',width: '100vw',background:'#25324D'}}>
        <div className='svgWrap' style={{
          transform: 'scale(1)'
          }}>
            <Map levels={this.state.levels.reverse()}/>
        </div>
      </div>
    </Hammer>);
  }

}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default connect(mapStateToProps,mapDispatchToProps)(sizeMeHOC(InteractiveSvg));
