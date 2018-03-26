import React, { Component,Fragment} from 'react';
import Level from './Level';
import {connect} from "react-redux";
const mapStateToProps = (state) => {
  return {currentFloor:state.currentFloor}
}

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current:0
    };
  }
  render() {

    return (<Fragment>
      {this.props.levels.map((level,index) => {
        // console.log(index.toString()this.props.currentFloor);
        return <Level key={index} index={index} data={level} className={(this.props.currentFloor!==index?'hideFloor':null)}/>
      })}
    </Fragment>);
  }

}

export default connect(mapStateToProps,null)(Map);
