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
    console.log(this.props);
    return (
      <svg viewBox={this.state.viewBox} className={this.props.className}>
        {this.state.level.map((layer) =>{
          return <Layer key={layer['@attributes'].id} index={this.props.index} data={layer}/>
        })}
      </svg>

    );
  }

}

export default connect(mapStateToProps,null)(Level);
