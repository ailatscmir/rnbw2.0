import React, { Component,Fragment } from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Hammer from 'react-hammerjs';

const options = {
  touchAction: 'compute',
  recognizers: {
    tap: {
      time: 600,
      threshold: 100
    },
    pinch: {
      enable: true
    }
  }
};

const getRatio = ({mapSize, componentSize}) =>{
  let pAsp = mapSize.height/mapSize.width;
  let cAsp = componentSize.height/componentSize.width;
  let x,y,divisionX,divisionY;

  if (pAsp<=0) {
    console.log(pAsp,'wide');
    ([x,y] = [1,pAsp / cAsp]);
  } else {
    ([x,y] = [pAsp / cAsp,1]);
  };

  ([divisionX,divisionY] = [componentSize.width/x,componentSize.height/y]);
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
    console.log(props);
    let {transformation,componentSize,mapSize} = this.props;
    this.state = {
      currentTransformation:transformation,
      destination:transformation,
      componentSize: componentSize,
      mapSize: mapSize,
      ratio: getRatio({mapSize:mapSize,componentSize:componentSize}),
      pan:false,
      pinch:false,
      showAnimation: false
    };
  }

  handlePanStart = (ev) => {
    this.setState({pan:true});
  }

  handlePan = (ev) => {
    let {ratio,transformation} = this.props;
    let currentTransformation = {
      x : transformation.x-ev.deltaX/ratio.divisionX/transformation.scale*100,
      y : transformation.y-ev.deltaY/ratio.divisionY/transformation.scale*100,
      scale: transformation.scale
    };
    this.setState({currentTransformation: currentTransformation});
  }

  handlePanEnd = (ev) => {
    let {currentTransformation} = this.state;
    this.props.setTransform(currentTransformation);
    this.setState({pan:false});
  }

  handleWheel = (ev) => {
    let {transformation} = this.props
    let wheelScaledTransformation = {
      x:transformation.x,
      y:transformation.y,
      scale:transformation.scale+ev.deltaY/1800
    };

    this.props.setTransform(wheelScaledTransformation);
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

  }

  render() {
    let transformation = ((this.state.pan)||(this.state.pinch))?this.state.currentTransformation:this.props.transformation;
    return (
      <Hammer options={options} onWheel={this.handleWheel} onPanStart={this.handlePanStart} onPan={this.handlePan} onPanEnd={this.handlePanEnd} onPanCancel={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handleEnd} onPinchCancel={this.handleEnd}>
        <div style={{height: '100%',width: '100%'}}>
        {/* <Motion defaultStyle={{x: transform.x,y:transform.y,scale:transform.scale}} style={{x:spring(animateTransform.x,{...presets.noWobble, precision: 0.01}),y:spring(animateTransform.y,{...presets.noWobble, precision: 0.1}),scale:spring(animateTransform.scale)}} onRest={this.endAnimation}> */}
          <div className='interactive' style={{
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
          {/* </Motion> */}
        </div>
      </Hammer>
    );
  }

}

export default connect(null,mapDispatchToProps)(TransformContainer);
