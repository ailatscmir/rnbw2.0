import React, { Component } from 'react';
import {connect} from "react-redux";

const mapStateToProps = state => {
  return {transformation:state.transformation}
}
class OverlayElement extends Component {

  render() {
    console.log(this.props.children);
    let {x,y,anchor='0,0',unscalable} = this.props;
    let scale = (unscalable)?`scale(${1/this.props.transformation.scale})`:'scale(1)';
    return (
      <div className='overlayElement' style={{
        pointerEvents: 'auto',
        zIndex:'1000', position:'absolute',
        left:`${x}%`,top:`${y}%`,
        transformOrigin: 'top left',
        transform:`${scale}`,
      }}>
      <div style={{height:'fit-content',width:'fit-content',transform:`translate(${anchor})`}}>
        {this.props.children}
      </div>
      </div>
    );
  }

}

export default connect(mapStateToProps,null)(OverlayElement);
