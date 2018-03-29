import React, { Component } from 'react';
import {connect} from "react-redux";
import Layer from './Layer';
import OverlayElement from './OverlayElement';
import PropTypes from 'prop-types';
const mapStateToProps = (state) => {
  return {selectedCenter:state.selectedCenter,
    selectedLocation:state.selectedLocation}
}

class Level extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: this.props.data.g.g,
      viewBox:this.props.data['@attributes'].viewBox
    };
  }

  getChildContext() {
    return {scale: this.props.transform.scale};
  }

  render() {
    return (
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0}} className={this.props.className}>
        <div className='overlayLayer' style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0
          }}>
          {(this.props.overlay)?this.props.overlay.map((overlay,index) =>{
              return (
                <OverlayElement key={index} x={overlay.x} y={overlay.y} unscalable={overlay.unscalable} anchor={overlay.anchor}>
                  {overlay.content}
                </OverlayElement>
              );
          }):
          null
        }

        </div>
      <svg viewBox={this.state.viewBox}>
        {this.state.level.map((layer) =>{
          return <Layer key={layer['@attributes'].id} index={this.props.index} data={layer}/>
        })}
      </svg>
    </div>
    );
  }

}

Level.childContextTypes = {
  scale: PropTypes.number.isRequired
};

export default connect(mapStateToProps,null)(Level);
