import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import sizeMe from 'react-sizeme';
import {TextField,Paper,Button} from 'material-ui/';
import AddIcon from 'material-ui-icons/Add';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import Map from './Map';
import OverlayElement from './OverlayElement';

// import Hammer from 'react-hammerjs';

class InteractiveSvg extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;
    this.state = {
      levels: levels,
      moveX:0,
      moveY:0,
      scaleTo:1,
      position: {
        x: 50,
        y: 50
      },
      scale: 1,
      range:{
        x:0,
        y:0
      }
    };
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps);
  }

  handleSliderChange = value => {
    this.setState({scale:value});
  }
  handleChange = name => event => {
   this.setState({
     [name]: Number(event.target.value),
   });
  };

  moveTo = () => {
    let {moveX,moveY,scaleTo,position} = this.state;
    position.x = moveX;
    position.y = moveY;

    this.setState({position:position,scale:scaleTo});
  }
  getChildContext() {
    return {scale: this.state.scale};
  }

  render() {
    let {overlayPosition, position, scale} = this.state;
    return (<div style={{
        height: '100vh',
        width: '100vw',
        background: '#25324D'
      }}>
      <div style={{position:'absolute',top:'50%',left:'50%',height:6,width:6,marginTop:-3,marginLeft:-3,background:'#fff'}}></div>
      <Paper elevation={20} style={{position:'fixed',bottom:0,left:0,margin:20,padding:20,height:200,width:400,zIndex:30000}} >
        <div className='slider'>
          <Slider
             min={1}
             max={4}
             step={0.01}
             value={scale}
             onChange={this.handleSliderChange}
         />
         <TextField
          id="x"
          label="x"
          value={this.state.moveX}
          onChange={this.handleChange('moveX')}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />   <TextField
            id="y"
            label="y"
            value={this.state.moveY}
            onChange={this.handleChange('moveY')}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />   <TextField
              id="scale"
              label="scale"
              value={this.state.scaleTo}
              onChange={this.handleChange('scaleTo')}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <Button color={'primary'} onClick={this.moveTo}>Set</Button>
     </div>
      </Paper>
      <div className='interactive' style={{
          zIndex:2,
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: `translate(${0-position.x}%,${0-position.y}%) scale(${scale})`,
          transformOrigin: `${position.x}% ${position.y}%`
        }}>
        <div className='overlayLayer' style={{position:'absolute',height:'100%',width:'100%',top:0,left:0}}>
          <OverlayElement x={30} y={50} unscalable>
            <Button variant="fab" color="primary" aria-label="add">
              <AddIcon />
            </Button>
          </OverlayElement>
          <OverlayElement x={70} y={20} unscalable>
            <Button variant="fab" color="primary" aria-label="add">
              <AddIcon />
            </Button>
          </OverlayElement>
          {/* <OverlayElement x={70} y={50} scale={scale} unscalable>
            {card}
          </OverlayElement> */}
        </div>
        <div className='mapImage' style={{zIndex: 0}}>
          <Map levels={this.state.levels.reverse()}/>
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

export default connect(null, null)(sizeMeHOC(InteractiveSvg));
