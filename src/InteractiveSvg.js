import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import sizeMe from 'react-sizeme';
import Map from './Map';
import OverlayElement from './OverlayElement';
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

const mapStateToProps = state => {
  return {selectedLocation: state.selectedLocation, locations: state.data.locations}
}

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
        x: 50,
        y: 50,
        scale: 1
      },
      currentTransform:{
        x:50,
        y:50,
        scale:1
      },
      animateTransform: {
        x: 50,
        y: 50,
        scale: 1
      },
      range: {
        x: 0,
        y: 0
      }
    };
  }

  moveTo = location => {
    let l = this.props.locations[location];
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

  getChildContext() {
    return {scale: this.state.transform.scale};
  }

  handlePanStart = (ev) => {
    this.setState({pan:true});
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
  render() {
    let {transform,currentTransform,animateTransform} = this.state;
    return (<div style={{
        height: '100vh',
        width: '100vw',
        background: '#25324D'
      }}>
      <Hammer options={options} onPanStart={this.handlePanStart} onPan={this.handlePan} onPanEnd={this.handlePanEnd} onPanCancel={this.handlePanEnd}>
        <div style={{
            height: '100vh',
            width: '100vw',
            // background: '#25324D'
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
            console.log({x,y,scale});
            return <div className='interactive' style={{
            height: `${this.state.ratio.divisionY*100}%`,
            zIndex: 2,
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: `translate(${ 0 - x}%,${ 0 - y}%) scale(${scale})`,
            transformOrigin:`${x}% ${y}%`
          }}>
            <div className='overlayLayer' style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0
              }}>
            </div>
            <div className='mapImage' style={{zIndex: 0}}>
              <Map currentLevel={this.state.currentLevel} levels={this.state.levels}/>
            </div>
          </div>}}
        </Motion>
      </div>
      </Hammer>
    </div>);
  }
}

InteractiveSvg.childContextTypes = {
  scale: PropTypes.number.isRequired
}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default connect(mapStateToProps, null)(sizeMeHOC(InteractiveSvg));
