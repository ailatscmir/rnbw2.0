import React, {Component} from 'react'
import LocationPath from './LocationPath';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

import getBounds from 'svg-path-bounds';
import G from './G';
import HereIcon from './HereIcon';
const setWayInfo = (data) => {
  return { type: 'SET_WAYINFO', payload: data}
}

const mapDispatchToProps = dispatch => {
  return {
    setWayInfo: bindActionCreators(setWayInfo, dispatch)
  }
}
const mapStateToProps = state => {
  return { way:state.way }
}
class Layer extends Component {

  componentDidMount() {
    let type = this.props.data['@attributes']['id'];

    if ((type==='way')&&(this.props.way===null)) {
      let wayId = (window.location.hash.replace('#', '')!=='')?window.location.hash.replace('#', ''):'way0';
      let wayIcon = (this.props.data.path.length)
        ? this.props.data.path.find(way => way['@attributes'].id===wayId)
        : (this.props.data.path['@attributes'].id===wayId) ? this.props.data.path: null;
      if (wayIcon) {
        let [left,, right, bottom] = getBounds(wayIcon['@attributes'].d);
        let {x,y} = {x:left+(right-left)/2,y:bottom};
        let levelId = this.props.levelId;
        this.props.setWayInfo([{id:'wayPin',anchor:'-50%,-90%',levelId:levelId,x:x/35,y:y/14,content:<HereIcon />}]);
      }
    };
  }

  render() {
    let data = this.props.data;
    let type = data['@attributes']['id'];

    return (<g className={type}>
      {
        (type.includes('landmarks'))
          ? (data.path.length)
            ? data.path.map((location) => {return <LocationPath index={this.props.index} key={location['@attributes']['id']} data={location}/>})
            : <LocationPath key={data.path['@attributes']['id']} index={this.props.index} data={data.path} floor={this.props.floor}/>
          : null
      }
      {
        ((type==='legend')||(type==='base')||(type==='wall'))
          ? <G data={data}/>
          : null
      }
    </g>);
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Layer);
