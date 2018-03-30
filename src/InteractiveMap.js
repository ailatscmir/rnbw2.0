import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import sizeMe from 'react-sizeme';
import Map from './Map';
import {Motion, spring,presets} from 'react-motion';
import TransformContainer from './TransformContainer';

const mapStateToProps = state => {
  return {transformation:state.transformation}
}


const getRatio = (planDimension, componentDimension) =>{
  let pAsp = planDimension.height/planDimension.width;
  let cAsp = componentDimension.height/componentDimension.width;
  let divisionX = 1;
  let divisionY = pAsp / cAsp;
  return {pAsp,cAsp,divisionX,divisionY};
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
    return (<div style={{
        height: '100vh',
        width: '100vw',
        background: '#25324D'
      }}>
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
