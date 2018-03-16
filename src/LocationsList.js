import React, {Component} from 'react'
import {connect} from "react-redux";

import List from 'material-ui/List';
import LocationsCategory from './LocationsCategory';
const mapDispatchToProps = (dispatch) => {
  return {}
}

const mapStateToProps = (state) => {
  return {fetchLocations: state.fetchLocations, locations: state.locations}
}

const getCategories = (locations) =>{
  let categories = {};
  locations.forEach((location) => {
    let c = location.category;
    let name = c.term_order+'.'+c.slug;
    if (c.parent !== 0) {
      let parent = c.parent;
      let parentname = parent.term_order+'.'+parent.slug;
      if (!categories.hasOwnProperty(parentname)) {
        categories[parentname] = parent;
      };
      if (!categories[parentname].hasOwnProperty('subcat')) {
        categories[parentname]['subcat'] = {}
      };
      if (!categories[parentname]['subcat'].hasOwnProperty(name)){
        categories[parentname]['subcat'][name] = c;
        delete categories[parentname]['subcat'][name].parent;
      }
    } else {
      if (!categories.hasOwnProperty(name)) {
        categories[name] = c;
      }
    };
  });
  return categories;
}

class LocationsList extends Component {
  constructor(props) {
    super(props);
    let locations = this.props.locations;
    let categories = getCategories(locations)
    let orderedCategories = Object.keys(categories).sort().reduce(function(result, item, index, array) {
      result[item] = categories[item]; //a, b, c
      return result;
    }, {});
    this.state = {
      categories: orderedCategories,
    };
  }

  componentDidMount() {}

  render() {
    return (<List>
      {Object.keys(this.state.categories).map((catKey) =>{
        // console.log(orderedCategories[catKey]);
        return <LocationsCategory key={catKey} data={this.state.categories[catKey]} locations={this.props.locations.filter(location => (catKey===(location.category.term_order+'.'+location.category.slug)))} />
      })}
    </List>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationsList);
