import React, { Component,Fragment} from 'react';
import Level from './Level';
import {connect} from "react-redux";
import {Paper,Button} from 'material-ui/';
const overlays = {floor1:[
  {
    x:20,
    y:50,
    unscalable:true,
    anchor: '50%,50%',
    content: <Button variant="fab" color="primary" aria-label="add">Я</Button>
  },
  {
    x:30,
    y:40,
    unscalable:true,
    anchor: '-50%,-50%',
    content: <Button variant="fab" color="primary" aria-label="add">Ё</Button>
  }
]};

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
        return <Level key={index} index={index} data={level} transform={this.props.transform} overlay={overlays[level.title]}
           className={(currentLevel!==level.title)?'hideFloor':'showFloor'}
         />
      })}
    </Fragment>);
  }

}

export default connect(null,null)(Map);
