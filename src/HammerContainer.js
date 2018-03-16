import React, {Component} from 'react';
import Hammer from 'react-hammerjs';
import sizeMe from 'react-sizeme';

import {connect} from "react-redux";
import {bindActionCreators} from 'redux';


function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

function setContainerSize(data) {
  return {type: 'SET_CONTAINER', payload: data}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setContainerSize: bindActionCreators(setContainerSize, dispatch)
  }
}

function updateDisplayElement(x, y, scale) {
  // const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
  // updateHud();
}

class HammerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minScale: 1,
      maxScale: 4,

      displayElementX: 0,
      displayElementY: 0,
      displayElementScale: 1,

      rangeX: 0,
      rangeMinX: 0,
      rangeMaxX: 0,
      rangeY: 0,
      rangeMinY: 0,
      rangeMaxY: 0,

      displayImageRangeY: 0,

      displayElementCurrentX: 0,
      displayElementCurrentY: 0,
      displayElementCurrentScale: 1,

      dimensions: {
      width: -1,
      height: -1
      },
      ev: ''
    };
    this.handlePan = this.handlePan.bind(this);
    this.handlePinch = this.handlePinch.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
  }

  updateRange() {
    let {height,width} = this.props.size;
    let rangeX = Math.max(0, Math.round((this.state.displayElementCurrentScale-1)*width));
    let rangeY = Math.max(0, Math.round((this.state.displayElementCurrentScale-1)*height));
    // console.log(rangeX,rangeY);
  };

  componentDidMount() {
    this.updateRange()
    let {height,width} = this.props.size;
    // this.props.setContainerSize({height,width});
  }

  handlePinch(ev){
    let displayElementCurrentScale = clamp(this.state.displayElementScale*ev.scale,this.state.minScale,this.state.maxScale);
    this.setState({displayElementScale: displayElementCurrentScale});
  }
  handleWheel(ev){
    let displayElementCurrentScale = clamp(this.state.displayElementScale+ev.deltaY/200,this.state.minScale,this.state.maxScale);
    this.setState({displayElementScale: displayElementCurrentScale});
  }
  handlePan(ev) {
    let {
      displayElementX,
      displayElementY,
      rangeMinX,
      rangeMaxX,
      rangeMinY,
      rangeMaxY
    } = this.state;
    let displayElementCurrentX = clamp(displayElementX + ev.deltaX, rangeMinX, rangeMaxX);
    let displayElementCurrentY = clamp(displayElementY + ev.deltaY, rangeMinY, rangeMaxY);
    // console.log(displayElementCurrentX, displayElementCurrentY);
    this.setState({displayElementCurrentX: displayElementCurrentX, displayElementCurrentY: displayElementCurrentY});
  }

  componentWillReceiveProps(nextProps){
    let {height,width} = nextProps.size;
    // this.props.setContainerSize({height,width});
    // console.log(nextProps.size,this.props.size);

  }

  render() {
    let options = {
      touchAction: 'compute',
      recognizers: {
        pinch: {
          enable: true
        }
      }
    };
    return (<Hammer onTap={this.handleTap} onPan={this.handlePan} onPinch={this.handlePinch} onWheel={this.handleWheel} options={options}>
      <div className="hammerContainerdiv" style={{height:'100%',overflow: 'hidden'}}>
        <p>{JSON.stringify(this.state.displayElementScale)}</p>
        {/* {React.cloneElement(this.props.children, { scale: this.state.displayElementScale })} */}
        {this.props.children}
      </div>
    </Hammer>);
  }

}
const config = { monitorHeight: true,monitorWidth:true};
const sizeMeHOC = sizeMe(config);

export default connect(null,mapDispatchToProps)(sizeMeHOC(HammerContainer));
