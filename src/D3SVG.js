import React, {Component} from 'react';
import XMLParser from 'react-xml-parser';
import Hammer from 'react-hammerjs';
import sizeMe from 'react-sizeme';

const hammerOptions = {
  touchAction: 'auto',
  recognizers: {
    tap: {
      time: 200,
      threshold: 2
    },
    pinch: {
      enable: true
    }
  }
};

const fitScaleCalculate = (planDimension, componentDimension) => {
  let fitWidth = componentDimension.width / planDimension.width;
  let fitHeight = componentDimension.height / planDimension.height;
  return {fitHeight,fitWidth};
}

const rangecheck = (x,y,center,scale) => {
  if ((1-scale>x - center.x * scale)||(x - center.x * scale>0)) return false;
  return true;
}

class D3SVG extends Component {
  constructor(props) {
    super(props);
    let XMLP = new XMLParser();
    let levels = this.props.levels.map(level => XMLP.parseFromString(level.raw));
    let [top, left, width, height] = levels[0].attributes.viewBox.split(' ');
    let planDimension = {
      top,
      left,
      width,
      height
    };
    let fitScale = fitScaleCalculate(planDimension, this.props.size);
    let center = {
      y: height * fitScale / 2 / this.props.size.height,
      x: width * fitScale / 2 / this.props.size.width
    };

    this.state = {
      planDimension: planDimension,
      center: center,
      fitScale: fitScale,
      x: 0.5,
      y: 0.5,
      currentX: 0.5,
      currentY: 0.5,
      scale: 1,
      currentScale: 1,
      pan: false,
      pinch: false
    };
    this.handleWheel = this.handleWheel.bind(this);
    this.handlePan = this.handlePan.bind(this);
    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handlePinch = this.handlePinch.bind(this);
    this.handlePinchStart = this.handlePinchStart.bind(this);
    this.handlePinchEnd = this.handlePinchEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fitScale: fitScaleCalculate(this.state.planDimension, nextProps.size)
    });
  }

  // ZOOM_EVENTS
  handleWheel(ev) {
    ev.preventDefault();
    let {scaleToFit} = this.state;
    let newScale = this.state.scale + 0.005 * ev.deltaY;
    if (newScale > 1) {
      console.log(newScale,1/scaleToFit);
      this.setState({scale: newScale})

    } else {
      this.setState({scale: 1})
    }
  }
  handlePinchStart(ev) {
    this.setState({pinch: true});
  }
  handlePinchEnd(ev) {
    let {currentScale} = this.state;
    this.setState({pinch: false, scale: currentScale});
  }
  handlePinch(ev) {
    ev.preventDefault();
    let {scale} = this.state;
    this.setState({
      currentScale: scale * ev.scale
    });
  }

  // PAN_EVENTS
  handlePan(ev) {
    ev.preventDefault();
    let {x, y, scale,center} = this.state;
    let newx = x + ev.deltaX / this.props.size.width;
    let newy = y + ev.deltaY / this.props.size.height;
    if (!rangecheck(newx,newy,center,scale)) console.log('outofrange');
    this.setState({
      currentX: newx,
      currentY: newy
    })
  }
  handlePanStart(ev) {
    ev.preventDefault();
    this.setState({pan: true});
  }
  handlePanEnd(ev) {
    ev.preventDefault();
    let {currentX, currentY} = this.state;
    this.setState({pan: false, x: currentX, y: currentY});
  }

  render() {
    const {
      x,
      y,
      currentX,
      currentY,
      scale,
      currentScale,
      planDimension,
      center,
      scaleToFit,
      pan,
      pinch
    } = this.state;
    let top,
      left,
      divScale;

    if (pinch) {
      left = (x - center.x * currentScale) * 100;
      top = (y - center.y * currentScale) * 100;
      divScale = 100 * currentScale;
    } else {
      divScale = 100 * scale;
      if (pan) {
        left = (currentX - center.x * scale) * 100;
        top = (currentY - center.y * scale) * 100;
      } else {
        left = (x - center.x * scale) * 100;
        top = (y - center.y * scale) * 100;
      };
    }
    console.log(left,top);
    return (<Hammer options={hammerOptions} onWheel={this.handleWheel} onPan={this.handlePan} onPanStart={this.handlePanStart} onPanEnd={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handlePinchEnd}>
      <div style={{
          height: '100vh',
          width: '100vw',
          background: '#333'
        }}>
        <div className='svgWrap' style={{
            position: 'relative',
            height: `${divScale}%`,
            width: `${divScale}%`,
            left: `${left}%`,
            top: `${top}%`
          }} dangerouslySetInnerHTML={{
            __html: this.props.levels[0].raw
          }}/>
      </div>
    </Hammer>);
  }

}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default sizeMeHOC(D3SVG);
