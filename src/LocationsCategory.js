import React, { Component, Fragment } from 'react';
// import CheckCircle from 'material-ui-icons/CheckCircle';
// import { bindActionCreators } from 'redux'
// import {connect} from "react-redux";

class LocationsCategory extends Component {

  toggleCollapse(ev){
    let open = this.state.open;
    this.setState({ open: !open });
  }
  selectLocation(location){
    this.props.selectLocation(location);
  }

  render() {
    return (
      <Fragment>
        <li>{this.props.data.name}</li>
        <ul>
          {this.props.children}
        </ul>
        {
          this.props.locations.map((location) => {
            return <li>{location.title} </li>
          }
        )}
      </Fragment>
    );
  }

}

export default LocationsCategory;
