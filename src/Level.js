import React, {Component} from 'react';
import {connect} from "react-redux";
import Layer from './Layer';
import OverlayElement from './OverlayElement';
import {Typography,Paper} from 'material-ui/';
const mapStateToProps = (state) => {
  return {
    target:state.target,
    dataStore:state.data
  }
}

class Level extends Component {
  constructor(props) {
    super(props);
    let svg = this.props.data.svg;
    let locations = Object.keys(this.props.dataStore.levels).map(level => this.props.dataStore.levels[level].locations).reduce((acc,item) => {
      acc = {...acc,...item};
      return acc;
    },[]);
    this.state = {
      level: svg.g.g,
      viewBox: svg['@attributes'].viewBox,
      locations:locations
    };
  }

  render() {
    let targetOverlay = null;
    if (this.props.target) {

      let target = this.state.locations[this.props.target.id];
      targetOverlay = (target&&(target.level===this.props.levelId))?{title:target.title,x:target.position.x*100,y:target.position.y*100}:null;
    }
    console.log(targetOverlay);
    return (<div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} className={this.props.className}>
      <div className='overlayLayer' style={{
          pointerEvents: 'none',
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0
        }}>
        {(targetOverlay)?
          <OverlayElement x={targetOverlay.x} y={targetOverlay.y} unscalable={true}>
            <Paper style={{padding:20}}>
              <Typography variant='headline'>{targetOverlay.title}</Typography>
            </Paper>
          </OverlayElement>
          :null}
        {
          (this.props.overlays)
            ? this.props.overlays.map((overlay, index) => {
              console.log(overlay.content);
              return (<OverlayElement key={index} x={overlay.x} y={overlay.y} unscalable={overlay.unscalable} anchor={overlay.anchor}>
                {overlay.content}
              </OverlayElement>);
              // return <p>overlaytest</p>
            })
            : null
        }
      </div>
      <svg viewBox={this.state.viewBox}>
        {
          this.state.level.map((layer) => {
            return <Layer key={layer['@attributes'].id} levelId={this.props.levelId} data={layer}/>
          })
        }
      </svg>
    </div>);
  }

}

export default connect(mapStateToProps, null)(Level);
