import React, { Component,Fragment } from 'react';

class Path extends Component {

  render() {
    let data = this.props.data;
    return (
      <Fragment>
        {(data.length)
        ? data.map((path,index) => {
          return <Path key={index} data={path} />
        })
        : <path
            id={(data['@attributes'].id)?data['@attributes'].id:null}
            d={(data['@attributes'].d)?data['@attributes'].d:null}
            fill={(data['@attributes'].fill)?data['@attributes'].fill:null}
          />
        }
      </Fragment>
    );
  }

}

export default Path;
