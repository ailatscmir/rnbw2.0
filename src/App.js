import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import CssBaseline from 'material-ui/CssBaseline';
import {CircularProgress} from 'material-ui/Progress';
import * as constants from './constants';
import {setFetchFlag, saveItems} from './actions/fetch';
import InteractiveMap from './InteractiveMap';
import TopMenuBar from './TopMenuBar';
// import Idle from 'react-idle';

const setWayNumber = (wayNum) => {
  return {type: 'SET_WAY_NUMBER', payload: wayNum}
}

const mapStateToProps = state => {
  return {data: state.data, dataStatus: state.dataStatus}
};

const mapDispatchToProps = dispatch => {
  return {
    setWayNumber: bindActionCreators(setWayNumber, dispatch),
    setFetchFlag: bindActionCreators(setFetchFlag, dispatch),
    saveItems: bindActionCreators(saveItems, dispatch)
  }
};

class App extends Component {

  fetchApi(apiUrl) {
    this.props.setFetchFlag('fetching');
    fetch(apiUrl).then((response) => {
      if (!response.ok) {
        // console.log(response.statusText);
        throw Error(response.statusText);
      }
      return response;
    }).then((response) => response.json()).then((items) => {
      this.props.saveItems(items);
    })
  }

  componentDidMount() {
    this.fetchApi(constants.API_MAP);
  }

  render() {
    return (
      <Fragment>
        <CssBaseline />
      <div className='App'>
      {
        (this.props.dataStatus)
          ? <Fragment>
              {/* <Idle timeout={5000} onChange={({idle}) => console.log({idle})}/> */}
              <div className='fullwindow'>
                <InteractiveMap levels={this.props.data.map}/>
              </div>
              <TopMenuBar data={this.props.data.locations}/>
            </Fragment>
          : <CircularProgress style={{
                position: 'absolute',
                top: '45%',
                left: '45%'
              }} size={120}/>
      }
    </div>
  </Fragment>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
