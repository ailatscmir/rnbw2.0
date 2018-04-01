import React, { Component } from 'react';
// import PropTypes from 'prop-types';
class OverlayElement extends Component {

  render() {
    let {x,y,anchor='0,0',unscalable} = this.props;
    let scale = (unscalable)?`scale(${1/this.context.scale})`:'scale(1)';
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

// OverlayElement.contextTypes = {
//   scale: PropTypes.number.isRequired
// };

export default OverlayElement;
