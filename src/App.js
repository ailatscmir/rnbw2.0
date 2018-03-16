import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Grid from 'material-ui/Grid';
import {CircularProgress} from 'material-ui/Progress';
import {LinearProgress} from 'material-ui/Progress';
import TextField from 'material-ui/TextField';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import {setFetchFlag, saveItems} from './actions/fetch';

import KeyboardedInput from 'react-touch-screen-keyboard';
import 'react-touch-screen-keyboard/lib/Keyboard.css';

import LocationsList from './LocationsList';
import InteractiveSvg from './InteractiveSvg';
import * as constants from './constants';
import FuzzySearch from 'fuzzy-search';

const selectLocation = (location) => {
  return {type: 'SELECT_LOCATION', payload: location}
}

const mapStateToProps = (state) => {
  return {map: state.map, locations: state.locations, currentFloor: state.currentFloor}
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectLocation: bindActionCreators(selectLocation, dispatch),
    setFetchFlag: bindActionCreators(setFetchFlag, dispatch),
    saveItems: bindActionCreators(saveItems, dispatch)
  }
}

class App extends Component {
  constructor(props) {
    console.log(window.location.hash.substr(1));
    super(props);
    this.state = {
      searchField: '',
      searchResult: []
    }
    this.handleSearchField = this.handleSearchField.bind(this);
  }

  selectLocation(location) {
    this.props.selectLocation(location);
  }

  fetchApi(apiUrl, fetchFlag) {
    this.props.setFetchFlag(fetchFlag, 'fetching');
    fetch(apiUrl).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }).then((response) => response.json()).then((items) => {
      this.props.setFetchFlag(fetchFlag, 'complete');
      this.props.saveItems(fetchFlag, items);
    })
  }

  componentDidMount() {
    this.fetchApi(constants.API_LOCATIONS, 'LOCATIONS');
    this.fetchApi(constants.API_MAP, 'MAP');
  }

  handleSearchField(ev) {
    let searchField = ev;
    this.setState({searchField: searchField})
    if (this.state.searchResult !== '') {
      const searcher = new FuzzySearch(this.props.locations, ['title'], {caseSensitive: false});
      const result = searcher.search(searchField);
      this.setState({searchResult: result});
    } else
      this.setState({searchResult: []})
  }
  handleCh(ev) {
    console.log(ev);
  }

  render() {
    let searchField = this.state.searchField;
    return (<div className="app">
      <Grid className='fullScreenFlex' container spacing={0}>
        <Grid item xs={6} md={2} className="scrollable">
          <p></p>
          <KeyboardedInput enabled name='name' inputClassName='searchField' value={searchField} isDraggable={false} defaultKeyboard="us" secondaryKeyboard="ru" placeholder={'Поиск'} isFirstLetterUppercase={false} onChange={this.handleSearchField}/> {
            (this.state.searchField !== '')
              ? <Fragment>
                  <List component="div" disablePadding="disablePadding" subheader={<ListSubheader component = "div" > Результаты поиска: </ListSubheader>}>
                    {
                      this.state.searchResult.map((location) => {
                        return <ListItem button="button" key={location.name} onClick={() => {
                            this.selectLocation(location.name)
                          }}>
                          <ListItemText inset primary={location.title}/>
                        </ListItem>
                      })
                    }
                  </List>
                </Fragment>
              : null
          }
          {
            (this.props.locations.length > 0)
              ? <LocationsList/>
              : <LinearProgress color="secondary"/>
          }
        </Grid>
        <Grid item xs={6} md={10}>
          {
            (this.props.map.length > 0)
              ? <InteractiveSvg data={this.props.map}/>
              : <CircularProgress/>
          }
        </Grid>
      </Grid>
    </div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
