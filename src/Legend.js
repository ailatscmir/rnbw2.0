import React, { Component } from 'react';
import Path from './Path';
import G from './G';
class Legend extends Component {

  render() {
    let data = this.props.data;

    return (
      <g>
        {Object.keys(data).map((key,index) => {
            switch (key){
              case 'path': return <Path key={index} data={data[key]}/>;
              case 'g': return <G key={index} data={data[key]}/>
              default: return <path key={index}></path>;
            }
        })}
      </g>
    );
  }

}

export default Legend;
