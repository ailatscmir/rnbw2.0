import React, {Component} from 'react';
import Layer from './Layer';

import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

const mapStateToProps = (state) => {
  return {
    currentFloor: state.currentFloor,
    selectedLocation: state.selectedLocation
  }
}

const selectFloor = (floor) => {
  return {
    type: 'GOTO_FLOOR',
    payload: floor
  }
}


const mapDispatchToProps = (dispatch) => {
  return {selectFloor: bindActionCreators(selectFloor, dispatch)}
}


class Floor extends Component {


  componentWillReceiveProps(nextprops){
    let id = this.props.data['@attributes']['id'];
    let raw = JSON.stringify(this.props.data.g);
    if (raw.indexOf(nextprops.selectedLocation)>0) {this.props.selectFloor(id.slice(-1));console.log(id.slice(-1));};
  }

  render() {

    let data = this.props.data.g;
    let id = this.props.data['@attributes']['id'];

    return (<g id={id} key={id} className={(id.slice(-1)!==this.props.currentFloor)?'hideFloor':'showFloor'}>
      {data.map((layer,index) => {
        return <Layer key={layer['@attributes']['id']} data={layer} floor={id.slice(-1)}/>;
      })}
    </g>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Floor);
