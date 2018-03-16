import React, {Component} from 'react'
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import getBounds from 'svg-path-bounds';


const mapStateToProps = (state) => {
  return {
    selectedLocation: state.selectedLocation
  }
}

const selectLocation = (location) => {
  return {
    type: 'SELECT_LOCATION',
    payload: location
  }
}

const setSelectedCenter = (d) => {

  return {
    type: 'SELECT_LOCATION',
    payload: getBounds(d)
  }
}


const mapDispatchToProps = (dispatch) => {
  return {selectLocation: bindActionCreators(selectLocation, dispatch)}
}



class LocationPath extends Component {


  constructor(props) {
   super(props);
   this.handleSelectLocation = this.handleSelectLocation.bind(this);
 }
  componentDidMount() {}

  handleSelectLocation(e){
    this.props.selectLocation(e.target.id);

  }

  render() {
    let location = this.props.data;
    return (
      <path key={location['@attributes']['id']} id={location['@attributes']['id']} d={location['@attributes']['d']} fillOpacity={((this.props.selectedLocation===location['@attributes']['id'])||(this.props.selectedLocation===''))?1:0.5}
        fill={(this.props.selectedLocation===location['@attributes']['id'])?'#000':location['@attributes']['fill']}/>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationPath);
