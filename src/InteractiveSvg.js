import React, {Component} from 'react';
import XMLParser from 'react-xml-parser';
import Hammer from 'react-hammerjs';
import sizeMe from 'react-sizeme';

const hammerOptions = {
  touchAction: 'compute',
  recognizers: {
    tap: {
      time: 200,
      threshold: 2
    },
    pinch: {
      enable: true
    },
    pan:{
      threshold:10,
      pointers:1
    }
  }
};

const getTransform = ({pan,pinch,x,y,currentX,currentY,scale,currentScale,center}) => {
  let left,top,divScale;
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
  return {top,left,divScale}
}

const getRatio = (planDimension, componentDimension) =>{
  let pAsp = planDimension.height/planDimension.width;
  let cAsp = componentDimension.height/componentDimension.width;
  let divisionX = 1;
  let divisionY = pAsp / cAsp;
  return {pAsp,cAsp,divisionX,divisionY};
}

// const rangecheck = (x,y,center,scale,fitScale) => {
//
//   let range = (scale-1)/2;
//   console.log(y,scale,fitScale.fitHeight);
//   return {newx: x,newy:y};
//   // if ((1-scale>x - center.x * scale)||(x - center.x * scale>0)) return false;Math.max(Math.min(x,center.x+range)
//   // return true;
// }

class InteractiveSVG extends Component {
  constructor(props) {
    super(props);
    let XMLP = new XMLParser();
    let levels = this.props.levels.map(level => XMLP.parseFromString(level.raw));
    let [, , width, height] = levels[0].attributes.viewBox.split(' ');
    let planDimension = {
      width,
      height
    };

    let ratio = getRatio(planDimension, this.props.size);

    this.state = {
      planDimension: planDimension,
      ratio:ratio,
      center: {x:ratio.divisionX/2,y:ratio.divisionY/2},
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
    console.log({newProps:nextProps});
    let ratio = getRatio(this.state.planDimension, nextProps.size);
    this.setState({
      ratio: ratio,
      center: {x:ratio.divisionX/2,y:ratio.divisionY/2}
    });
  }

  setTransform({x=this.state.x,y=this.state.y,scale=this.state.scale,current=false}){
    if (!current){
        this.setState({x:x,y:y,scale:scale});
    } else {
        this.setState({currentX:x,currentY:y,currentScale:scale});
    }
  }

  // ZOOM_EVENTS
  handleWheel(ev) {
    ev.preventDefault();
    let newScale = this.state.scale + 0.005 * ev.deltaY;
    this.setTransform({scale:(newScale > 1)?newScale:1});
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
    this.setTransform({scale:scale * ev.scale,current:true});
    // this.setState({
    //   currentScale:
    // });
  }

  // PAN_EVENTS
  handlePan(ev) {
    ev.preventDefault();
    let {x,y} = this.state;
    let newx = x + ev.deltaX / this.props.size.width;
    let newy = y + ev.deltaY / this.props.size.height;
    this.setTransform({x:newx,y:newy,current:true});
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
    const {pan,pinch,x,y,currentX,currentY,scale,currentScale,center} = this.state;
    let {top,left,divScale} = getTransform({pan,pinch,x,y,currentX,currentY,scale,currentScale,center});

    return (<Hammer options={hammerOptions} onWheel={this.handleWheel} onPan={this.handlePan} onPanStart={this.handlePanStart} onPanEnd={this.handlePanEnd} onPinch={this.handlePinch} onPinchStart={this.handlePinchStart} onPinchEnd={this.handlePinchEnd}>
      <div style={{
          height: '100vh',
          width: '100vw',
          // background: '#333'
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

export default sizeMeHOC(InteractiveSVG);
