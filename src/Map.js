import React, { Component,Fragment} from 'react';
import Level from './Level';
import {connect} from "react-redux";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current:0
    };
  }
  render() {
    let currentLevel = (this.props.currentLevel)?this.props.currentLevel:'floor1';
    return (<Fragment>
      {this.props.levels.map((level,index) => {
        // console.log({currentLevel,title:level.title,cond:(currentLevel!==level.title)?'hideFloor':null});
        return <Level key={index} index={index} data={level} className={(currentLevel!==level.title)?'hideFloor':null}/>
      })}
    </Fragment>);
  }

}

export default connect(null,null)(Map);
