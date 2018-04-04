import React, {Component,Fragment} from 'react'
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import LocationsCategory from './LocationsCategory';

const setTarget = locationId => {
  return ({type:'SET_TARGETMENU', payload:{target:{type:'tenant',id:locationId},listMode:false}})
}

const mapDispatchToProps = dispatch => {
  return {
    setTarget: bindActionCreators(setTarget, dispatch)
  }
}

const getCategories = (locations) =>{
  let categories = {};
  console.log(Object.keys(locations).length);
  Object.keys(locations).map(id => locations[id]).forEach((location) => {
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
    let categories = getCategories(locations);
    let orderedCategories = Object.keys(categories).sort().reduce(function(result, item, index, array) {
      result[item] = categories[item]; //a, b, c
      return result;
    }, {});
    this.state = {
      categories: orderedCategories,
    };
  }
  setTarget(location){
      this.props.setTarget(location)
  }

  render() {
  //   const { classes } = this.props;
    let categories = this.state.categories;
    let locations = this.props.locations;
    return (
      <ul style={{columns:4}}>
        {Object.keys(categories).map((key) => {
          return <li>
            {categories[key].name}
            {(categories[key].hasOwnProperty('subcat'))
            ? <ul>{Object.keys(categories[key].subcat).map((subkey) => {
              return <Fragment>
                <li>{categories[key].subcat[subkey].name}</li>
                <ul>
                  {Object.keys(locations).map(id => locations[id]).filter(location => (subkey===(location.category.term_order+'.'+location.category.slug))).map(location => <li onClick={() => this.setTarget(location.name)}>{location.title}</li>)}
                </ul>
              </Fragment>
            })}</ul>
            : null}
            <ul>
              {Object.keys(locations).map(id => locations[id]).filter(location => (key===(location.category.term_order+'.'+location.category.slug))).map(location => <li onClick={() => this.setTarget(location.name)}>{location.title}</li>)}
            </ul>
          </li>
        })}
      {/*
        // console.log(orderedCategories[catKey]);
        return <LocationsCategory key={key} data={categories[key]} locations={locations.filter(location => (key===(location.category.term_order+'.'+location.category.slug)))}>
        {(categories[key].hasOwnProperty('subcat'))
          ? Object.keys(categories[key].subcat).map((subkey) => {return <LocationsCategory key={subkey} data={categories[key].subcat[subkey]} locations={locations.filter( location => (subkey===(location.category.term_order+'.'+location.category.slug)))} />})
          :null
        }
        </LocationsCategory>
      })} */}
    </ul>
  )
  }
}

export default connect(null,mapDispatchToProps)(LocationsList);
