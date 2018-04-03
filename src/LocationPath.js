import React, {Component,Fragment} from 'react'
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import getBounds from 'svg-path-bounds';

const mapStateToProps = (state) => {
    return {target:state.target}
};

class LocationPath extends Component {
  render() {
    let location = this.props.data;
    let target = this.props.target;
    let selected = (target&&(target.id===location['@attributes']['id']));
    // let selected = (this.props.selectedLocation===location['@attributes']['id']);
    return (<Fragment>
      <path key={location['@attributes']['id']} id={location['@attributes']['id']} data-location={location['@attributes']['id']} d={location['@attributes']['d']} stroke={location['@attributes']['fill']} fill={(!selected)?'rgba(255,255,255,0.2)':'rgba(250,80,80,0.7)'}/>
    </Fragment>
    )
  }
}

export default connect(mapStateToProps,null)(LocationPath);
