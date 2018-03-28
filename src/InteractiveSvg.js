import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import sizeMe from 'react-sizeme';
import {TextField, Paper, Button} from 'material-ui/';
import AddIcon from 'material-ui-icons/Add';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import Map from './Map';
import OverlayElement from './OverlayElement';

// import Hammer from 'react-hammerjs';

const mapStateToProps = state => {
  return {
    selectedLocation:state.selectedLocation,
    locations:state.data.locations
  }
}

class InteractiveSvg extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;
    this.state = {
      currentLevel: null,
      levels: levels,
      position: {
        x: 50,
        y: 50
      },
      scale: 1,
      range: {
        x: 0,
        y: 0
      }
    };
  }

  moveTo = location => {
    let l = this.props.locations[location];
    console.log(l.position.x);
    this.setState({currentLevel:l.level,scale:3,position:{x:l.position.x*100,y:l.position.y*100}});
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLocation) this.moveTo(nextProps.selectedLocation);
  };

  handleSliderChange = value => {
    this.setState({scale: value});
  }
  handleChange = name => event => {
    this.setState({
      [name]: Number(event.target.value)
    });
  };

  getChildContext() {
    return {scale: this.state.scale};
  }

  render() {
    let {position, scale} = this.state;
    return (<div style={{
        height: '100vh',
        width: '100vw',
        background: '#25324D'
      }}>
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          height: 6,
          width: 6,
          marginTop: -3,
          marginLeft: -3,
          background: '#fff'
        }}></div>
      <div className='interactive' style={{
          zIndex: 2,
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: `translate(${ 0 - position.x}%,${ 0 - position.y}%) scale(${scale})`,
          transformOrigin: `${position.x}% ${position.y}%`
        }}>
        <div className='overlayLayer' style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0
          }}>
          <OverlayElement x={30} y={50} unscalable>
            <Button variant="fab" color="primary" aria-label="add">
              <AddIcon/>
            </Button>
          </OverlayElement>
          <OverlayElement x={70} y={20} unscalable>
            <Button variant="fab" color="primary" aria-label="add">
              <AddIcon/>
            </Button>
          </OverlayElement>
        </div>
        <div className='mapImage' style={{zIndex: 0}}>
          <Map currentLevel={this.state.currentLevel} levels={this.state.levels}/>
        </div>
      </div>
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
