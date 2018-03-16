import React, {Component} from 'react'

import Hammer from 'react-hammerjs';

import sizeMe from 'react-sizeme';
import {scale, translate, transform, toCSS} from 'transformation-matrix';
import Button from 'material-ui/Button';
import One from 'material-ui-icons/LooksOne';
import Two from 'material-ui-icons/LooksTwo';
import Floor from './Floor';

function clampZoom(zoom, min, max) {
  return Math.min(Math.max(min, zoom), max);
}


function clampPan(value, range) {

  let clampedValue = value;
  if (range > 0) {
    clampedValue = Math.min(Math.max(0 - range, value), 0);
  } else {
    clampedValue = Math.abs(range / 2)
  };
  return clampedValue;
}

function getTransformation({x, y, zoom}) {
  return toCSS(transform(translate(x, y), scale(zoom, zoom)));
}

function floorCompare(a, b) {
  if (a['title'] < b['title'])
    return -1;
  if (a['title'] > b['title'])
    return 1;
  return 0;
}

function getMinZoom({
  height: mapHeight,
  width: mapWidth
}, {
  height: containerHeight,
  width: containerWidth
}) {
  return (mapHeight < mapWidth)
    ? containerWidth / mapWidth
    : containerHeight / mapHeight;
}

function fitToContainer(mapSize, containerSize) {
  let {height: mapHeight, width: mapWidth} = mapSize;
  let {height: containerHeight, width: containerWidth} = containerSize;

  let zoom = getMinZoom(mapSize, containerSize);
  let x = (containerWidth - mapWidth * zoom) / 2;
  let y = (containerHeight - mapHeight * zoom) / 2;
  return {x: x, y: y, zoom: zoom};
}

class InteractiveSvg extends Component {

  constructor(props) {
    super(props);

    let dimensions = this.props.data[0]['@attributes']['viewBox'].split(' ');
    let mapSize = {
      height: (Number)(dimensions[3]),
      width: (Number)(dimensions[2])
    };
    let containerSize = this.props.size;
    let {x, y, zoom} = fitToContainer(mapSize, containerSize);
    this.state = {
      resistance: 0.92,
      factor: 20,
      floors: this.props.data,
      mapSize: mapSize,
      containerSize: containerSize,
      zoom: zoom,
      currentZoom: zoom,
      minZoom: zoom,
      maxZoom: 4,
      rangeX: 0,
      rangeY: 0,
      x: x,
      y: y,
      currentX: x,
      currentY: y,
      pan: false,
      pinch: false,
      hammerEvent:''
    };
    this.handlePan = this.handlePan.bind(this);
    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handlePanCancel = this.handlePanCancel.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handlePinchStart = this.handlePinchStart.bind(this);
    this.handlePinchEnd = this.handlePinchEnd.bind(this);
    this.handlePinch = this.handlePinch.bind(this);
  }

  componentDidMount() {
    this.updateRange(this.state.zoom);
  }

  updateRange(zoom) {
    let {height: mapHeight, width: mapWidth} = this.state.mapSize;
    let {height: containerHeight, width: containerWidth} = this.state.containerSize;
    let rangeX = mapWidth * zoom - containerWidth;
    let rangeY = mapHeight * zoom - containerHeight;
    this.setState({rangeX, rangeY});
  }

  transformMap({
    x = this.state.x,
    y = this.state.y,
    zoom = this.state.zoom,
    current = false})
    {
    let {rangeX, rangeY, minZoom,maxZoom} = this.state;
    zoom = clampZoom(zoom,minZoom,maxZoom);
    this.updateRange(zoom);
    if (current) {
      this.setState({
        currentX: clampPan(x, rangeX),
        currentY: clampPan(y, rangeY),
        currentZoom: zoom
      })
    } else {
      this.setState({
        x: clampPan(x, rangeX),
        y: clampPan(y, rangeY),
        currentX: clampPan(x, rangeX),
        currentY: clampPan(y, rangeY),
        zoom: zoom,
        currentZoom:zoom
      })
    }
  }

  // scaleTo({zoom:zoom,current = false}){
  //
  // }

  braking(velocityX, velocityY) {
    let {factor, resistance} = this.state;
    let {x, y} = this.state;
    if (!(this.state.pan)) {
      this.transformMap({
        x: x + velocityX * factor,
        y: y + velocityY * factor
      });
      if ((Math.abs(velocityX * resistance * factor) > 0.5) && (Math.abs(velocityY * resistance * factor) > 0.5)) {
        setTimeout(() => {
          this.braking(velocityX * resistance, velocityY * resistance)
        }, 10);
      }
    }
  }

  handlePan(ev) {
    ev.preventDefault();
    console.log(ev);
    this.setState({hammerEvent:ev.type});
    let {x, y} = this.state;
    this.transformMap({
      x: x + ev.deltaX,
      y: y + ev.deltaY,
      current: true
    });
  }

  handlePanStart(ev) {
    ev.preventDefault();
    this.setState({pan: true})
  }

  handlePanEnd(ev) {
    ev.preventDefault();
    let {currentX, currentY} = this.state;
    this.setState({pan: false});
    this.transformMap({ x:currentX, y:currentY });
    this.braking(ev.velocityX, ev.velocityY);
  }

  handlePanCancel(ev) {
    ev.preventDefault();
    let {currentX, currentY} = this.state;
    this.setState({pan: false});
    this.transformMap({ x:currentX, y:currentY });
    this.braking(ev.velocityX, ev.velocityY);
  }

  handleWheel(ev) {
    ev.preventDefault();
    let deltaY = ev.deltaY;
    let {
      zoom,
      minZoom,
      maxZoom,
      x,
      y,
      mapSize
    } = this.state;
    let newZoom = clampZoom(zoom + deltaY/Math.pow(maxZoom,1/zoom)/100, minZoom, maxZoom);
    let newX = x+(zoom-newZoom)*mapSize.width/2;
    let newY = y+(zoom-newZoom)*mapSize.height/2;
    // console.log({newY,zoom,newZoom,mapSize});
    this.transformMap({x:newX,y:newY,zoom:newZoom});
  }

  handlePinchStart(ev) {
    this.setState({pinch: true});
  }

  handlePinchEnd(ev) {
    this.setState({pinch: false});
    let {currentX,currentY,currentZoom} = this.state;
    this.transformMap({x:currentX,y:currentY,zoom: currentZoom});
  }

  handlePinch(ev) {
    ev.preventDefault();
    this.setState({hammerEvent:ev.type});
    let {x,y,zoom,mapSize} = this.state;
    let newZoom = zoom*ev.scale;
    let newX = x+(zoom-newZoom)*mapSize.width/2;
    let newY = y+(zoom-newZoom)*mapSize.height/2;
    this.transformMap({x:newX,y:newY,zoom:newZoom,current:true});
  }

  render() {
    var options = {
      touchAction: 'compute',
      recognizers: {
        tap: {
          time: 600,
          threshold: 100
        },
        pinch: {
          enable: true
        }
      }
    };

    let {mapSize, containerSize} = this.state;
    let {
      x,
      y,
      currentX,
      currentY,
      zoom,
      currentZoom
    } = this.state;
    let floors = this.state.floors;

    floors.sort(floorCompare);
    return (<div style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
      <Hammer options={options} onWheel={this.handleWheel} onPanStart={this.handlePanStart} onPanEnd={this.handlePanEnd} onPanCancel={this.handlePanCancel} onPan={this.handlePan} onPinchStart={this.handlePinchStart} onPinchEnd={this.handlePinchEnd} onPinch={this.handlePinch}>
        <div>
          <svg id='interactiveSvg' height={mapSize.height} width={mapSize.width} viewBox={'0 0 3500 1400'} preserveAspectRatio='xMidYMid meet'>
            <rect fill={'#fff'} x={0} y={0} height={containerSize.height} width={containerSize.width}/>
            <g className='controlGroup' transform={getTransformation({
                x: ((this.state.pan)||(this.state.pinch))
                  ? currentX
                  : x,
                y: ((this.state.pan)||(this.state.pinch))
                  ? currentY
                  : y,
                zoom: (this.state.pinch)
                  ? currentZoom
                  : zoom
              })}>
              {
                floors.map((floor, index) => {
                  return <Floor key={floor['title']} index={index} data={floor['g']}/>;
                })
              }
            </g>
          </svg>
          <Button style={{position:'absolute',bottom:'16px',right:'86px'}} variant="fab" color="secondary" aria-label="edit">
              <One />
          </Button>
          <Button style={{position:'absolute',bottom:'16px',right:'16px'}} variant="fab" color="secondary" aria-label="edit">
              <Two />
          </Button>
        </div>
      </Hammer>
    </div>);
  }
}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default sizeMeHOC(InteractiveSvg);
