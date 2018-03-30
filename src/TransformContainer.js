import React, { Component } from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Hammer from 'react-hammerjs';
import {Motion,spring,presets} from 'react-motion';
const options = {
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
const clamp = ({value,min,max}) => {
  return Math.min(Math.max(value,min),max);
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

const saveTransformation = transformation => {
  return ({type:'SAVE_TRANSFORMATION', payload:transformation})
}

const mapDispatchToProps = dispatch => {
  return {
    saveTransformation:bindActionCreators(saveTransformation, dispatch)
  };
}

class TransformContainer extends Component {
  constructor(props) {
    super(props);
    let {transformation,componentSize,mapSize} = this.props;
    this.state = {
      currentTransformation:{...transformation},
      transformTo:{...transformation},
      componentSize: componentSize,
      mapSize: mapSize,
      ratio: getRatio({mapSize:mapSize,componentSize:componentSize}),
      pan:false,
      pinch:false,
      showAnimation: false
    };
  }

  componentDidMount() {
    this.moveTo();
  }

  moveTo = () => {
    this.setState({
      showAnimation: true,
      transformTo: {
        x:35.27,
        y:46.46,
        scale:3
      }
    });
  }

  handlePanStart = (ev) => {
    this.setState({pan:true});
  }

  handlePan = (ev) => {
    let {transformation} = this.props;
    let currentTransformation = {
      x : clamp({value: transformation.x-ev.deltaX/this.state.ratio.divisionX/transformation.scale*100,min: 100/transformation.scale/2,max: 100-100/transformation.scale/2}),
      y : (transformation.scale>1/this.state.ratio.y)?clamp({value: transformation.y-ev.deltaY/this.state.ratio.divisionY/transformation.scale*100,min: 100/transformation.scale/2/this.state.ratio.y,max: 100-100/transformation.scale/2/this.state.ratio.y}):50,
      scale: transformation.scale
    };
    this.setState({currentTransformation: currentTransformation});
  }

  handlePanEnd = (ev) => {
    let {currentTransformation} = this.state;
    this.props.saveTransformation(currentTransformation);
    this.setState({pan:false});
  }

  handleWheel = (ev) => {
    let {transformation} = this.props
    let wheelScaledTransformation = {
      x:clamp({value: transformation.x, min: (0.5-(transformation.scale-1)/2)*100,max:(0.5+(transformation.scale-1)/2)*100}),
      y:clamp({value: transformation.y, min: (0.5-(transformation.scale-1)/2)*100,max:(0.5+(transformation.scale-1)/2)*100}),
      scale:clamp({value:transformation.scale+ev.deltaY/1800,min:1,max:4})
    };
    this.props.saveTransformation(wheelScaledTransformation);
  }

  handlePinch = (ev) => {
    // ev.preventDefault();
    // let {transform} = this.state;
    // transform.scale = transform.scale*((ev.scale-1)/3+1);
    // this.setState({currentTransform:transform});
  }

  handlePinchStart = (ev) => {
    this.setState({pan:true});
    // console.log(ev.type);
  }

  handlePinchEnd = (ev) => {
    this.setState({pan:false});
    // let {x,y,scale} = this.state.currentTransform;
    // this.setState({pinch:false,transform:{x:x,y:y,scale:scale}});
  }

  endAnimation = () => {
    this.setState({showAnimation:false});
    this.props.saveTransformation(this.state.transformTo);
  }

  render() {
    let transformTo = {...this.state.transformTo};
    let transformation = ((this.state.pan)||(this.state.pinch))?this.state.currentTransformation:this.props.transformation;
    return (
      <Hammer options={options} onWheel={this.handleWheel} onPanStart={this.handlePanStart} onPan={this.handlePan} onPanEnd={this.handlePanEnd} onPanCancel={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handleEnd} onPinchCancel={this.handleEnd}>
        <div style={{height: '100%',width: '100%'}}>
        <Motion
          defaultStyle={{x: transformation.x,y:transformation.y,scale:transformation.scale}}
          style={{x:spring(transformTo.x,{...presets.noWobble, precision: 0.01}),y:spring(transformTo.y,{...presets.noWobble, precision: 0.1}),scale:spring(transformTo.scale)}} onRest={this.endAnimation}>
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
