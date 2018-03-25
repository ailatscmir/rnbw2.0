import React, { Component } from 'react';

class Level extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.data);
    this.state = {
      svg: this.props.data
    };

  }
  render() {
    let attributes = this.state.svg.attributes;
    let layer = this.state.svg.children.filter((child) => child.name==='g').shift().children;
    return (
      <svg viewBox={attributes.viewBox} className={this.props.className}>
        {layers.map((layer) => {
          return <Layer />
        })}
      </svg>
    );
  }

}

export default Level;
