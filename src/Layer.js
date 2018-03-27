import React, {Component} from 'react'
import LocationPath from './LocationPath';
import {connect} from "react-redux";
import G from './G';

const mapStateToProps = state => {
  return {wayNum:state.wayNum}
}
class Layer extends Component {

  componentDidMount() {}

  render() {
    let data = this.props.data;
    let type = data['@attributes']['id'];

    // if (type==='legend') console.log(Object.keys(this.props.data));

    return (<g className={type}>
      {
        (type.includes('landmarks'))
          ? (data.path.length)
            ? data.path.map((location) => {return <LocationPath index={this.props.index} key={location['@attributes']['id']} data={location}/>})
            : <LocationPath key={data.path['@attributes']['id']} index={this.props.index} data={data.path} floor={this.props.floor}/>
          : null
      }
      {
        // (type==='wall')?<path d={data.g.path['@attributes'].d} fill="rgba(255,255,255,0.4)" />:null
      }

      {
        (type==='way')?
          data.path.filter(way => way['@attributes']['id']===this.props.wayNum).map(
            (way) => {return <path key={way['@attributes']['id']} d={way['@attributes']['d']} stroke="#fff" fill={way['@attributes']['fill']}/>})
          :null
      }
      {/* {
        ((type==='base'))?
          data.path.map(
            (way) => {return <path id={way['@attributes']['id']} key={way['@attributes']['id']} d={way['@attributes']['d']} stroke="#fff" fill={way['@attributes']['fill']}/>})
          :null
      } */}
      {
        ((type==='legend')||(type==='base')||(type==='wall'))
          ? <G data={data}/>
          : null
      }
    </g>);
  }
}

export default connect(mapStateToProps,null)(Layer);
