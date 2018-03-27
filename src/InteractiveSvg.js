import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Hammer from 'react-hammerjs';
import sizeMe from 'react-sizeme';
import Card, {CardActions, CardContent} from 'material-ui/Card';
import {Paper,Typography, Button} from 'material-ui/';
import AddIcon from 'material-ui-icons/Add';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import Map from './Map';
import OverlayElement from './OverlayElement';

class InteractiveSvg extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;

    let [,, width, height] = levels[0]['@attributes'].viewBox.split(' ');
    let planDimension = {
      width,
      height
    };
    this.state = {
      levels: levels,
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
  handleChange = value => {
    this.setState({scale:value});
  }

  getChildContext() {
    return {scale: this.state.scale};
  }

  render() {
    let card = <Card raised style={{
        width: 200
      }}>
      <CardContent>
        <Typography color="textSecondary">
          Word of the Day
        </Typography>
        <Typography variant="headline" component="h2">
          be
        </Typography>
        <Typography color="textSecondary">
          adjective
        </Typography>
        <Typography component="p">
          well meaning and kindly.<br/> {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>;
    let {overlayPosition, position, scale} = this.state;
    return (<div style={{
        height: '100vh',
        width: '100vw',
        background: '#25324D'
      }}>
      <Paper elevation={20} style={{position:'fixed',bottom:0,left:0,margin:20,padding:20,height:200,width:400,zIndex:30000}} >
        <div className='slider'>
          <Slider
             min={1}
             max={4}
             step={0.01}
             value={scale}
             onChange={this.handleChange}
         />
     </div>
      </Paper>
      <div className='interactive' style={{
          zIndex:2,
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: `translate(${0-position.x}%,${0-position.y}%) scale(${scale})`
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
          <OverlayElement x={70} y={50} scale={scale} unscalable>
            {card}
          </OverlayElement>
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
