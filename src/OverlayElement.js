import React, { Component } from 'react';
import PropTypes from 'prop-types';
class OverlayElement extends Component {

  render() {
    let {x,y,anchor='0,0',unscalable} = this.props;
    let scale = (unscalable)?`scale(${1/this.context.scale})`:'scale(1)';
    // let content = React.Children.only(children).props.style;
    // console.log(React.Children.map(content,child => console.log(child.props)));
    return (
      <div className='overlayElement' style={{zIndex:'1000', position:'absolute',
        left:`${x}%`,top:`${y}%`,
        transformOrigin: 'top left',
        transform:`${scale}`,
        height:'100%',
        width:'100%'
      }}>
      <div style={{transform:`translate(${anchor})`}}>
        {this.props.children}
      </div>
      </div>
    );
  }

}

OverlayElement.contextTypes = {
  scale: PropTypes.number.isRequired
};

export default OverlayElement;