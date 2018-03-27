import React, { Component } from 'react';
import {connect} from "react-redux";
import Layer from './Layer';

const mapStateToProps = (state) => {
  return {selectedCenter:state.selectedCenter,
    selectedLocation:state.selectedLocation}
}

class Level extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: this.props.data.g.g,
      viewBox:this.props.data['@attributes'].viewBox
    };
  }
  render() {
    // console.log(this.props.selectedCenter);
    return (
      <svg viewBox={this.state.viewBox} className={this.props.className}>
        {this.state.level.map((layer) =>{
          return <Layer key={layer['@attributes'].id} index={this.props.index} data={layer}/>
        })}
        {(this.props.selectedLocation!=='')
          ?<g transform={'translate('+(this.props.selectedCenter.x-102)+','+(this.props.selectedCenter.y-190)+') scale(0.1)'}>
            <path fill='#fff' d="M1803 960q0 53-37 90l-651 652q-39 37-91 37-53 0-90-37l-651-652q-38-36-38-90 0-53 38-91l74-75q39-37 91-37 53 0 90 37l294 294v-704q0-52 38-90t90-38h128q52 0 90 38t38 90v704l294-294q37-37 90-37 52 0 91 37l75 75q37 39 37 91z"/>
            </g>
        :null}
      </svg>

    );
  }

}

export default connect(mapStateToProps,null)(Level);
