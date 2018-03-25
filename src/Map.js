import React, { Component,Fragment} from 'react';
import Level from './Level';

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
        return <Level key={index} data={level} className={(this.state.current!==index?'hideFloor':null)}/>
      })}
    </Fragment>);
  }

}

export default Map;
