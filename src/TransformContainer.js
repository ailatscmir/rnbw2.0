import React, { Component } from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Hammer from 'react-hammerjs';
import {Motion,spring,presets} from 'react-motion';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const scaleIncrement = 1;
const HAMMER_OPTIONS = {
  touchAction: 'compute',
  recognizers: {
    tap: {
      time: 600,
      threshold: 100
    },
    pan:{
      threshold: 10
    },
    pinch: {
      enable: true
    }
  }
};
const motionPreset = {
  stiffness: 300,
  damping: 35,
  precision: 0.001
}
const clamp = ({value,min,max}) => {
  return Math.min(Math.max(value,min),max);
}

const clampTransformation = ({x,y,scale,ratio}) => {
  scale = clamp({
    value: scale,
    min: MIN_SCALE,
    max: MAX_SCALE
  });

  let range = {
    x:50/scale/ratio.x,
    y:50/scale/ratio.y
  };

  let clampedTranformation = {
    x: (scale>1/ratio.x)?clamp({
      value:  x,
      min:  range.x,
      max:  100-range.x
    }):50,
    y: (scale>1/ratio.y)?clamp({
      value:  y,
      min:  range.y,
      max:  100-range.y
    }):50,
    scale:scale
  }
  return clampedTranformation;
}


const getRatio = ({mapSize, componentSize}) =>{
  let pAsp = mapSize.height/mapSize.width;
  let cAsp = componentSize.height/componentSize.width;
  let x,y,divisionX,divisionY;
  if (pAsp<=1) {
    ([x,y] = [1,pAsp / cAsp]);
  } else {
    ([x,y] = [pAsp / cAsp,1]);
  };
  ([divisionX,divisionY] = [componentSize.width*x,componentSize.height*y]);
  return {x,y,divisionX,divisionY};
}

const setTarget = locationId => {
  return ({type:'SET_TARGET', payload:{type:'tenant',id:locationId}})
}

const saveTransformation = transformation => {
  return ({type:'SAVE_TRANSFORMATION', payload:transformation})
}

const mapDispatchToProps = dispatch => {
  return {
    saveTransformation:bindActionCreators(saveTransformation, dispatch),
    setTarget:bindActionCreators(setTarget,dispatch),
  };
}

class TransformContainer extends Component {
  constructor(props) {
    super(props);
    let {transformation,componentSize,mapSize} = this.props;
    this.state = {
      currentTransformation:{...transformation},
      componentSize: componentSize,
      mapSize: mapSize,
      ratio: getRatio({mapSize:mapSize,componentSize:componentSize}),
      pan:false,
      pinch:false,
      showAnimation: false,
      transformTo:{...transformation},
      target:null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};

    if (JSON.stringify(nextProps.componentSize)!==JSON.stringify(prevState.componentSize))
      newState = {...newState,...{ratio: getRatio({mapSize:nextProps.mapSize,componentSize:nextProps.componentSize})}};

    if ((nextProps.target)&&(nextProps.target.id!==prevState.target)) {
      let target = nextProps.target;
      let scale = (target.transform.scale)
        ? (target.transform.scale==='in')
          ? nextProps.transformation.scale+scaleIncrement
          : (target.transform.scale==='out')
            ? nextProps.transformation.scale-scaleIncrement : target.transform.scale
        : nextProps.transformation.scale;
      let range = {x:100/scale/2/prevState.ratio.x,y:100/scale/2/prevState.ratio.y}
      target.transform = clampTransformation({
        x: (target.transform.x)?target.transform.x:nextProps.transformation.x,
        y: (target.transform.y)?target.transform.y:nextProps.transformation.y,
        scale: (target.transform.scale)?scale:nextProps.transformation.scale,
        ratio: prevState.ratio
      });

      console.log(target.transform);
      newState = { ...newState, ...{
        showAnimation:true,
        target:target.id,
        transformTo: {
          ...prevState.transformTo ,
          ...target.transform }}};
    }
    return newState;
  }

  handleWheel = (ev) => {
    let {transformation} = this.props
    this.props.saveTransformation(clampTransformation({
      x: transformation.x,
      y: transformation.y,
      scale: transformation.scale+ev.deltaY/1800,
      ratio:this.state.ratio
    }));
  }

  handlePanStart = (ev) => {
    this.setState({pan:true});
  }


  handlePanEnd = (ev) => {
    let {currentTransformation} = this.state;
    this.props.saveTransformation(currentTransformation);
    this.setState({pan:false});
  }

  handlePan = (ev) => {
    let {transformation} = this.props;
    let currentTransformation = clampTransformation({
      x: transformation.x-ev.deltaX/this.state.ratio.divisionX/transformation.scale*100,
      y: transformation.y-ev.deltaY/this.state.ratio.divisionY/transformation.scale*100,
      scale: transformation.scale,
      ratio: this.state.ratio
    });
    this.setState({currentTransformation: currentTransformation});
  }

  handlePinchStart = (ev) => {
    console.log(ev.type);
    this.setState({pan:true});
  }

  handlePinchEnd = (ev) => {
    console.log(ev.type);
    this.setState({pinch:false});
    this.props.saveTransformation({...this.state.currentTransformation});
  }

  handlePinch = (ev) => {
    ev.preventDefault();
    let {transformation} = this.props;
    let currentTransformation = clampTransformation({
      x: transformation.x,
      y: transformation.y,
      scale: transformation.scale*((ev.scale-1)+1),
      ratio: this.state.ratio
    });
    console.log(currentTransformation);
    // transformation.scale = transformation.scale*((ev.scale-1)+1);
    this.setState({currentTransformation:currentTransformation});
  }

  handleTap = (ev) => {
    let currentLocation = ev.target.getAttribute('data-location');
    if (currentLocation) this.props.setTarget(currentLocation);
  }

  endAnimation = () => {
    if (this.state.showAnimation){
      this.setState({showAnimation:false});
      this.props.saveTransformation(this.state.transformTo);
    }
  }

  render() {
    let transformation = ((this.state.pan)||(this.state.pinch))?this.state.currentTransformation:this.props.transformation;
    let transformTo = (this.state.showAnimation)?{...this.state.transformTo}:this.props.transformation;
    return (
      <Hammer options={HAMMER_OPTIONS} onWheel={this.handleWheel} onPanStart={this.handlePanStart} onPan={this.handlePan} onPanEnd={this.handlePanEnd}
        onPanCancel={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handlePinchEnd} onPinchCancel={this.handlePinchEnd} onTap={this.handleTap}>
        <div style={{height: '100%',width: '100%'}}>
        <Motion
          defaultStyle={{
            x: transformation.x,
            y:transformation.y,
            scale:transformation.scale
          }}
          style={{
            x: spring(transformTo.x,motionPreset),
            y: spring(transformTo.y,motionPreset),
            scale:spring(transformTo.scale,motionPreset)
          }}
          onRest={this.endAnimation}>
          {(animate) => {
            transformation = (this.state.showAnimation)?animate:transformation;
            return <div className='interactive' style={{
              height: `${this.state.ratio.y*100}%`,
              width:`${this.state.ratio.x*100}%`,
              zIndex: 2,
              position: 'relative',
              top: '50%',
              left: '50%',
              transform: `translate(${ 0 - transformation.x}%,${ 0 - transformation.y}%) scale(${transformation.scale})`,
              transformOrigin:`${transformation.x}% ${transformation.y}%`
            }}>
              {this.props.children}
            </div>
           }}
          </Motion>
        </div>
      </Hammer>
    );
  }

}

export default connect(null,mapDispatchToProps)(TransformContainer);
