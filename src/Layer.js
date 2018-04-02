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
    if (type==='way') {
      
    };

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

export default connect(mapStateToProps,null)(Layer);
