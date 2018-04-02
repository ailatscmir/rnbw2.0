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

const mapStateToProps = state => {
  return {data: state.data, dataStatus: state.dataStatus}
};

const mapDispatchToProps = dispatch => {
  return {
    saveItems: bindActionCreators(saveItems, dispatch)
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels:null
    };
  }
  fetchApi(apiUrl) {
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data) {return {levels:nextProps.data.levels}} else {return {}};
  }

  render() {
    return (
      <Fragment>
        <CssBaseline />
      <div className='App'>
      {
        (this.state.levels)
          ? <Fragment>
              <div className='fullwindow'>
                <InteractiveMap levels={this.state.levels}/>
              </div>
              <TopMenuBar data={Object.keys(this.state.levels).map(level => this.state.levels[level].locations).reduce((acc,item) => {
                acc = {...acc,...item};
                return acc;
              },[])}/>
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
