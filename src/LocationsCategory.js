import React, { Component, Fragment } from 'react';
import List, { ListItem, ListItemText,ListItemIcon } from 'material-ui/List';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Collapse from 'material-ui/transitions/Collapse';
import CheckCircle from 'material-ui-icons/CheckCircle';

import { bindActionCreators } from 'redux'
import {connect} from "react-redux";


const selectLocation = (location) => {
  return {
    type: 'SELECT_LOCATION',
    payload: location
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLocation: state.selectedLocation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {selectLocation: bindActionCreators(selectLocation, dispatch)}
}

class LocationsCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

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
        <ListItem button onClick={this.toggleCollapse}>
          <ListItemText primary={this.props.data.name} />
          {(this.state.open)?<ExpandLess />:<ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout={300} unmountOnExit>

          <List component="div" disablePadding>
               {this.props.locations.map((location) => {

                 return <ListItem button key={location.name} onClick={() => {this.selectLocation(location.name)}}>
                   {(this.props.selectedLocation===location.name)
                     ? <ListItemIcon>
                       <CheckCircle />
                        </ListItemIcon>
                     :null}
                   <ListItemText inset primary={location.title} />
                 </ListItem>
               })}
          </List>
        </Collapse>

      </Fragment>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(LocationsCategory);
