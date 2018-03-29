import React, { Component,Fragment } from 'react';
import {connect} from "react-redux";
import LocationsList from './LocationsList'

const mapStateToProps = (state) => {
  return {locations: state.locations}
}

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFieldValue: ''
    };
    this.handleSearchFieldChangle = this.handleSearchFieldChangle.bind(this);
  }

  handleSearchFieldChangle(ev){
    console.log(ev);
    this.setState({searchFieldValue:ev});
  }

  render() {
    console.log(this.props.locations);
    return (
      <Fragment>
        {(this.props.locations.length!==0)
          ?<LocationsList/>
          :null
        }
      </Fragment>
    );
  }

}

export default connect(mapStateToProps, null)(Sidebar);
