import React, {Component,Fragment} from 'react'
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import getBounds from 'svg-path-bounds';

const setSelectedCenter = ({x,y}) => {
  return {
    type: 'SET_SELECTED_CENTER',
    payload: {x,y}
  }
}

const setSelectedLevel = (selectedLevel) => {
  return {
    type: 'SET_SELECTED_LEVEL',
    payload: selectedLevel
  }
}


const mapStateToProps = (state) => {
    return {selectedLocation:state.selectedLocation}
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedCenter: bindActionCreators(setSelectedCenter, dispatch),
    setSelectedLevel: bindActionCreators(setSelectedLevel, dispatch)
  }
}

class LocationPath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusPoint: {x:0,y:0}
    };
  }
  checkForSelection(selectedLocation,thisLocation){
    if (selectedLocation===thisLocation.data['@attributes'].id) {
      let [left,top,right,bottom] = getBounds(thisLocation.data['@attributes'].d);
      this.setState({focusPoint:{x:left+(right-left)/2,y:top+(bottom-top)/2}})
      this.props.setSelectedCenter({x:left+(right-left)/2,y:top+(bottom-top)/2})
      this.props.setSelectedLevel(thisLocation.index);
    }
  }

  componentDidMount() {
    this.checkForSelection(this.props.selectedLocation,this.props);
  }


  componentWillReceiveProps(nextProps) {

    this.checkForSelection(nextProps.selectedLocation,this.props);
  }

  render() {
    let location = this.props.data;
    let selected = (this.props.selectedLocation===location['@attributes']['id']);
    return (<Fragment>
      <path key={location['@attributes']['id']} id={location['@attributes']['id']} data-location={location['@attributes']['id']} d={location['@attributes']['d']} stroke={location['@attributes']['fill']} fill={(!selected)?'rgba(255,255,255,0.2)':'rgba(250,80,80,0.7)'}/>
    </Fragment>
    )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(LocationPath);
