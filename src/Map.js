import React, { Component,Fragment} from 'react';
import Level from './Level';
import {connect} from "react-redux";
import {Paper,Button} from 'material-ui/';
const overlays = {floor1:[
  {
    x:0,
    y:0,
    unscalable:true,
    anchor: '-50%,-50%',
    content: <Button variant="fab" color="primary" aria-label="add">TL</Button>
  },
  {
    x:100,
    y:0,
    unscalable:true,
    anchor: '-50%,-50%',
    content: <Button variant="fab" color="primary" aria-label="add">TR</Button>
  },
  {
    x:0,
    y:100,
    unscalable:true,
    anchor: '-50%,-50%',
    content: <Button variant="fab" color="primary" aria-label="add">DL</Button>
  },
  {
    x:100,
    y:100,
    unscalable:true,
    anchor: '-50%,-50%',
    content: <Button variant="fab" color="primary" aria-label="add">DR</Button>
  },
  {
    x:50,
    y:50,
    unscalable:true,
    anchor: '-50%,-50%',
    content: <Button variant="fab" color="primary" aria-label="add">CC</Button>
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
