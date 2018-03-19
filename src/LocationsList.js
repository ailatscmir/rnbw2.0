import React, {Component} from 'react'
import {connect} from "react-redux";

import List from 'material-ui/List';
import LocationsCategory from './LocationsCategory';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
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

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  }
});

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
    const { classes } = this.props;
    let categories = this.state.categories;
    let locations = this.props.locations;
    return (
      <List>
      {Object.keys(categories).map((key) =>{
        // console.log(orderedCategories[catKey]);
        return <LocationsCategory key={key} data={categories[key]} locations={locations.filter(location => (key===(location.category.term_order+'.'+location.category.slug)))}>
        {(categories[key].hasOwnProperty('subcat'))
          ? Object.keys(categories[key].subcat).map((subkey) => {return <LocationsCategory key={subkey} data={categories[key].subcat[subkey]} locations={locations.filter( location => (subkey===(location.category.term_order+'.'+location.category.slug)))} />})
            // Object.keys(this.state.categories[catKey].subcat).map( (subcatKey) => {
            //   return {subcatKey}
            // })

          :null
        }
        <Divider />
        </LocationsCategory>
      })}
    </List>
  )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LocationsList));
