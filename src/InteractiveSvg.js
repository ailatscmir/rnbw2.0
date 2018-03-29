import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import sizeMe from 'react-sizeme';
import Map from './Map';
import {Motion, spring,presets} from 'react-motion';
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

const setLevel = (level) => {
  return {type:'SET_LEVEL',payload:level}
}

const setTransform = (transform) => {
  return ({type: 'SET_TRANSFORM',payload:transform});
}

const mapStateToProps = state => {
  return {selectedLocation: state.selectedLocation, locations: state.data.locations, currentLevel:state.currentFloor}
}

const mapDispatchToProps = dispatch => {
  return {
    setTransform: bindActionCreators(setTransform, dispatch),
    setLevel: bindActionCreators(setLevel, dispatch)
  }
};

const getRatio = (planDimension, componentDimension) =>{
  let pAsp = planDimension.height/planDimension.width;
  let cAsp = componentDimension.height/componentDimension.width;
  let divisionX = 1;
  let divisionY = pAsp / cAsp;
  return {pAsp,cAsp,divisionX,divisionY};
}

class InteractiveSvg extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;
    let [, , width, height] = levels[0]['@attributes'].viewBox.split(' ');
    let planDimension = {
      width,
      height
    };
    console.log();
    this.state = {
      ratio: getRatio(planDimension, this.props.size),
      animate:false,
      pan:false,
      pinch:false,
      motion:1,
      currentLevel: '',
      levels: levels,
      transform: {
        x: 77,
        y: 60,
        scale: 2
      },
      currentTransform:{
        x:50,
        y:50,
        scale:2
      },
      animateTransform: {
        x: 77,
        y: 60,
        scale: 2
      },
      range: {
        x: 0,
        y: 0
      }
    };
  }

  moveTo = location => {
    let l = this.props.locations[location];
    this.props.setLevel(l.level);
    this.setState({
      animate:true,
      currentLevel: l.level,
      animateTransform:{
        x: l.position.x * 100,
        y: l.position.y * 100,
        scale: 3
      }
    });
  }
  endAnimation = () => {
    let {animateTransform} = this.state;
      this.setState({
        transform: {
          x: animateTransform.x,
          y: animateTransform.y,
          scale: animateTransform.scale,
        },
        animate:false
      })
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLocation)
      this.moveTo(nextProps.selectedLocation);
    };

  handlePanStart = (ev) => {
    this.setState({pan:true});
  }
  updateTransform(transform){
    this.props.setTransform(transform);
  }
  handlePan = (ev) => {
    let {x,y,scale} = this.state.transform;
    let {ratio} = this.state;
    x = x-ev.deltaX/this.props.size.width/ratio.divisionX/scale*100;
    y = y-ev.deltaY/this.props.size.height/ratio.divisionY/scale*100;
    this.setState({currentTransform: {x:x,y:y,scale:scale}});
  }
  handlePanEnd = (ev) => {
    let {x,y,scale} = this.state.currentTransform;
    this.setState({pan:false,transform:{x:x,y:y,scale:scale}});
  }

  handleWheel = (ev) => {
    let {transform} = this.state;
    transform.scale += ev.deltaY/1500;
    this.setState({transform:transform});
  }

  handlePinch = (ev) => {
    ev.preventDefault();
    let {transform} = this.state;
    transform.scale = transform.scale*((ev.scale-1)/3+1);
    this.setState({currentTransform:transform});
  }

  handlePinchStart = (ev) => {
    this.setState({pan:true});
    console.log(ev.type);
  }

  handlePinchEnd = (ev) => {
    let {x,y,scale} = this.state.currentTransform;
    this.setState({pinch:false,transform:{x:x,y:y,scale:scale}});
  }
  render() {
    let {transform,currentTransform,animateTransform} = this.state;
    return (<div style={{
        height: '100vh',
        width: '100vw',
        background: '#25324D'
      }}>
      <Hammer options={options} onWheel={this.handleWheel} onPanStart={this.handlePanStart} onPan={this.handlePan} onPanEnd={this.handlePanEnd} onPanCancel={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handleEnd} onPinchCancel={this.handleEnd}>
        <div style={{
            height: '100vh',
            width: '100vw'
          }}>
        <Motion defaultStyle={{x: transform.x,y:transform.y ,scale:transform.scale}} style={{x:spring(animateTransform.x,{...presets.noWobble, precision: 0.01}),y:spring(animateTransform.y,{...presets.noWobble, precision: 0.1}),scale:spring(animateTransform.scale)}} onRest={this.endAnimation}>
          {(animated) => {
            let x,y,scale;
            if (this.state.animate){
              ({x,y,scale} = animated);
            } else {
              if ((this.state.pan)||(this.state.pinch)){
                ({x,y,scale} = currentTransform);
              } else ({x,y,scale} = transform);
            }
            return <div className='interactive' style={{
            height: `${this.state.ratio.divisionY*100}%`,
            zIndex: 2,
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: `translate(${ 0 - x}%,${ 0 - y}%) scale(${scale})`,
            transformOrigin:`${x}% ${y}%`
          }}>
            <div className='mapImage' style={{zIndex: 0}}>
              <Map transform={{x:x,y:y,scale:scale}} currentLevel={this.props.currentLevel} levels={this.state.levels}/>
            </div>
          </div>}}
        </Motion>
      </div>
      </Hammer>
    </div>);
  }
}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default connect(mapStateToProps, mapDispatchToProps)(sizeMeHOC(InteractiveSvg));
