import React, {Component, Fragment} from 'react';
import Level from './Level';
import {connect} from "react-redux";
import {Button} from 'material-ui/';
import {Place} from 'material-ui-icons/';

const mapStateToProps = state => {
  return {overlays:state.overlays}
}
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
            overlays={this.props.overlays.filter(overlay => overlay.levelId===levelId)} className={(
              this.props.currentLevel !== levelId)
              ? 'hideFloor ' + this.props.direction
              : 'showFloor ' + this.props.direction}/>
        })
      }
    </Fragment>);
  }

}

export default connect(mapStateToProps, null)(Map);
