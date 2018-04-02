import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import sizeMe from 'react-sizeme';
import Map from './Map';
import TransformContainer from './TransformContainer';

const setCurrentLevel = levelId => {
  return {type:'SET_CURRENTLEVEL',payload:levelId};
}

const mapStateToProps = state => {
  return { transformation: state.transformation }
}

const mapDispatchToProps = dispatch => {
   return { setCurrentLevel: bindActionCreators(setCurrentLevel, dispatch) }
}

class InteractiveMap extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;
    let defaultLevel = Object.keys(levels).map(id => {return {...{id:id},...levels[id]}}).find(level => level.hasOwnProperty('default')).id;
    let [, , width, height] = levels[defaultLevel].svg['@attributes'].viewBox.split(' ');

    // this.props.setCurrentLevel(currentLevel);
    this.state = {
      defaultLevel: defaultLevel,
      mapSize: {height:height,width:width},
      levels: levels
    };
  }

  render() {
    return (<div style={{height: '100vh',width: '100vw',background: '#25324D'}}>
      <div style={{height:2,width:2,position:'relative',top:'50%',left:'50%',background:'#ffffff'}}></div>
      <TransformContainer transformation={this.props.transformation} componentSize={this.props.size} mapSize={this.state.mapSize}>
        <Map currentLevel={(this.props.currentLevel)?this.props.currentLevel:this.state.defaultLevel} levels={this.state.levels}/>
      </TransformContainer>
    </div>);
  }
}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default connect(mapStateToProps, mapDispatchToProps)(sizeMeHOC(InteractiveMap));
