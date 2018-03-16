import React, {Component} from 'react'
import LocationPath from './LocationPath';
// import Pathfinder from './Pathfinder';
class Layer extends Component {

  componentDidMount() {}

  render() {
    let data = this.props.data;
    let type = data['@attributes']['id'];
    if (type==='wall'){
    }
    return (<g className={type}>
      {
        (type.includes('landmarks'))
          ? (data.path.length)
            ? data.path.map((location) => {return <LocationPath key={location['@attributes']['id']} data={location}/>})
            : <LocationPath key={data.path['@attributes']['id']} data={data.path} floor={this.props.floor}/>
          : null
      }
      {
        (type==='wall')?<path d={data.g.path['@attributes'].d} />:null
      }
      {/* {
        (type==='routes')?<Pathfinder data={data} />:null
      } */}
    </g>);
  }
}

export default Layer;
