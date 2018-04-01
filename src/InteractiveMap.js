import React, {Component} from 'react';
import {connect} from "react-redux";
import sizeMe from 'react-sizeme';
import Map from './Map';
import TransformContainer from './TransformContainer';

const mapStateToProps = state => {
  return {transformation:state.transformation}
}

class InteractiveMap extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;
    let [, , width, height] = levels[0]['@attributes'].viewBox.split(' ');
    this.state = {
      currentLevel: '',
      mapSize: {height:height,width:width},
      levels: levels
    };
  }

  render() {
    return (<div style={{height: '100vh',width: '100vw',background: '#25324D'}}>
      <div style={{height:2,width:2,position:'relative',top:'50%',left:'50%',background:'#fff'}}></div>
      <TransformContainer transformation={this.props.transformation} componentSize={this.props.size} mapSize={this.state.mapSize}>
        <Map currentLevel={this.props.currentLevel} levels={this.state.levels}/>
      </TransformContainer>
    </div>);
  }
}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default connect(mapStateToProps, null)(sizeMeHOC(InteractiveMap));
