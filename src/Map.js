import React, {Component, Fragment} from 'react';
import Level from './Level';
import {connect} from "react-redux";
import {Button} from 'material-ui/';
const overlays = {
  floor1: [
    {
      x: 10,
      y: 10,
      content: <Button>123123</Button>
    }
  ]
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }
  render() {
    return (<Fragment>
      {
        Object.keys(this.props.levels).map((levelId, index) => {
          return <Level key={index}
            data={this.props.levels[levelId]}
            transform={this.props.transform}
            levelId={levelId}
            overlay={overlays[levelId]} className={(
              this.props.currentLevel !== levelId)
              ? 'hideFloor'
              : 'showFloor'}/>
        })
      }
    </Fragment>);
  }

}

export default connect(null, null)(Map);
