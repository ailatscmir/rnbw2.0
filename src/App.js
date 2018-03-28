import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {CircularProgress} from 'material-ui/Progress';
import {
  AppBar,
  Toolbar,
  Button
} from 'material-ui/';
import SuggestedSearch  from './SuggestedSearch';
import ListIcon from 'material-ui-icons/List';
import {withStyles} from 'material-ui/styles';

import * as constants from './constants';
import {setFetchFlag, saveItems} from './actions/fetch';
import InteractiveSvg from './InteractiveSvg'

const setWayNumber = (wayNum) => {
  return {type: 'SET_WAY_NUMBER', payload: wayNum}
}

const mapStateToProps = state => {
  return {data: state.data, fetchStatus: state.fetchStatus}
};

const mapDispatchToProps = dispatch => {
  return {
    setWayNumber: bindActionCreators(setWayNumber, dispatch),
    setFetchFlag: bindActionCreators(setFetchFlag, dispatch),
    saveItems: bindActionCreators(saveItems, dispatch)
  }
};

const styles = theme => ({

  customBar: {
    maxWidth: '80%',
    left: '0',
    right: '0',
    margin: '2% auto 0'
  },
  // menuButton: {
  //   marginLeft: -12,
  //   marginRight: 28,
  //   borderRight: '1px solid #777'
  // },
  // search: {
  //   flexGrow: 0.5
  // }
});

class App extends Component {

  fetchApi(apiUrl) {
    this.props.setFetchFlag('fetching');
    fetch(apiUrl).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }).then((response) => response.json()).then((items) => {
      this.props.saveItems(items);
    })
  }

  componentDidMount() {
    this.fetchApi(constants.API_MAP);
    this.props.setWayNumber('way' + window.location.hash.replace('#', ''));
  }

  render() {
    const {classes} = this.props;
    // console.log(this.props.fetchStatus,this.props.data.map);
    return (<div className='App'>
      <div className='fullwindow'>
        {
          (this.props.fetchStatus)
            ? <InteractiveSvg levels={this.props.data.map}/>
            : <CircularProgress style={{
                  position: 'relative',
                  top: '45%',
                  left: '45%'
                }} size={120}/>
        }
      </div>
      {(this.props.fetchStatus)?
      <AppBar className={classes.customBar} position="absolute" color="default" style={{
          zIndex: 'auto'
        }}>
        <Toolbar>
          <Button className={classes.menuButton} color="inherit" aria-label="List">
            <ListIcon/>
          </Button>
          <SuggestedSearch className={classes.search} isDraggable={false} isFirstLetterUppercase={false} defaultKeyboard={'ru'} secondaryKeyboard={'us'} data={this.props.data.locations}/>
        </Toolbar>
      </AppBar>:null}
    </div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
