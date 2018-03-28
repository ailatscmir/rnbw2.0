import React, { Component } from 'react';
import {connect} from "react-redux";
import Layer from './Layer';

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
  render() {
    return (
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0}}>
      <svg viewBox={this.state.viewBox} className={this.props.className}>
        {this.state.level.map((layer) =>{
          return <Layer key={layer['@attributes'].id} index={this.props.index} data={layer}/>
        })}
      </svg>
    </div>
    );
  }

}

export default connect(mapStateToProps,null)(Level);
