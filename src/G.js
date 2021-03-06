import React, {Component} from 'react';
import Path from './Path';
class G extends Component {

  render() {
    let data = this.props.data;
    return (<g style={{
      pointerEvents: 'none'
    }}>
      {
        (data.length)
          ? data.map((element) => {
            let outputEl = Object.keys(element).map((key, index) => {
              switch (key) {
                case 'path':
                  return <Path key={index} data={element[key]}/>;
                case 'g':
                  return <G key={index} data={element[key]}/>;
                default:
                  // console.log('G array default',element[key]);
                  return key;
              }
            })
            return outputEl;
          })
          : Object.keys(data).map((key, index) => {
            switch (key) {
              case 'path':
                return <Path key={index} data={data[key]}/>;
              case 'g':
                return <G key={index} data={data[key]}/>;
              default:
                // console.log('G object default',data[key]);
                return null;
            }
          })
      }
    </g>);
  }

}

export default G;
