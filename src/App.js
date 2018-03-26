import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

import {
  AppBar,
  Toolbar,
  Button
} from 'material-ui/';

import ListIcon from 'material-ui-icons/List';

import {withStyles} from 'material-ui/styles';

import * as constants from './constants';
import {setFetchFlag, saveItems} from './actions/fetch';

import InteractiveSvg from './InteractiveSvg'
// import Sidebar from './Sidebar';

import KeyboardedInput  from './KeyboardedInput';


const setWayNumber = (wayNum) => {
  return {type:'SET_WAY_NUMBER',payload:wayNum}
}

const mapStateToProps = state => {
  return {
    locations:state.locations,map:state.map,raw:state.mapRaw
  }
};
const mapDispatchToProps = dispatch => {
  return {
    setFetchFlag: bindActionCreators(setFetchFlag, dispatch),
    setWayNumber:bindActionCreators(setWayNumber, dispatch),
    saveItems: bindActionCreators(saveItems, dispatch)
  }
};

const styles = theme => ({
  customBar:{
    maxWidth: '80%',
    left: '0',
    right: '0',
    margin: '2% auto 0'
  },
  root: {
    flexGrow: 1

  },
  flex: {
    flex: 0.5,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 28,
    borderRight: '1px solid #777'
  },
  search: {
    flexGrow: 1
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
    this.props.setWayNumber('way'+window.location.hash.replace('#',''));
  }

  render() {
    const {classes} = this.props;
    return (<div className='App'>
        <div className='fullwindow'>
          {(this.props.map.length>0)?<InteractiveSvg levels={this.props.map}/>:null }
        </div>
        <AppBar className={classes.customBar} position="absolute" color="default" style={{zIndex:'auto'}}>
           <Toolbar>
             <Button className={classes.menuButton} color="inherit" aria-label="Menu">
               <ListIcon />
             </Button>
             {/* <SuggestedSearch className={classes.search} data={this.props.locations}/> */}
             <KeyboardedInput fullWidth={true} value='' isDraggable={false} isFirstLetterUppercase={false} defaultKeyboard={'ru'} secondaryKeyboard={'us'} data={this.props.locations} />
           </Toolbar>
         </AppBar>
    </div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
