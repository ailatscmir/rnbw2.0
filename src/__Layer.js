import React, { Component,Fragment } from 'react';
import XMLParser from 'react-xml-parser';

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

class Layer extends Component {
  renderLayer(){
    let id = this.props.id.split('-').shift();
    let XMLP = new XMLParser();
    let domParser = new DOMParser();
    switch (id) {
      case 'landmarks': return ((this.props.data.length>0)?this.props.data.map((location) => {
        return <path key={location.attributes.id} d={location.attributes.d} fill={location.attributes.fill}/>
      }):null);
      default: return ((this.props.data.length>0)?this.props.data.map((location) => {

        console.log(location,XMLP.toString(location));
        return createElementFromHTML(XMLP.toString(location),"text/html");
        // domParser.parseFromString(XMLP.toString(location),"text/html");
      }):null);
    }
  }

  render() {
    return (<g>
      {this.renderLayer()}
    </g>
    );
  }
}

export default Layer;
