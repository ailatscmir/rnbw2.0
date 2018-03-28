import React, {Component,Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {CircularProgress} from 'material-ui/Progress';
import {withStyles} from 'material-ui/styles';

import * as constants from './constants';
import {setFetchFlag, saveItems} from './actions/fetch';
import InteractiveSvg from './InteractiveSvg';
import TopMenuBar from './TopMenuBar';

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

  }
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
    {(this.props.fetchStatus)
      ? <Fragment>
        <div className='fullwindow'>
          <InteractiveSvg levels={this.props.data.map}/>
        </div>
        <TopMenuBar data = {this.props.data.locations} />
      </Fragment>
      :<CircularProgress style={{
            position: 'absolute',
            top: '45%',
            left: '45%'
          }} size={120}/>
    }
    </div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
