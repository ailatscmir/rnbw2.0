import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import { withStyles } from 'material-ui/styles';
import {Button,Paper} from 'material-ui/';
import {ZoomIn,ZoomOut,Place} from 'material-ui-icons/';
import sizeMe from 'react-sizeme';
import Map from './Map';
import TransformContainer from './TransformContainer';

const mapStateToProps = state => {
  return {transformation: state.transformation, target: state.target}
}

const setTarget = ({param,from}) => {
  return ({type:'SET_TARGET', payload:{type:'zoom',param:param,from:from}})
}

const mapDispatchToProps = dispatch => {
  return {
    setTarget: bindActionCreators(setTarget, dispatch)
  }
}
const styles = {
  sideButtonsArea : {
    zIndex:200000,
    position:'absolute',
    right:24,
    top:'40%',
    display: 'flex',
    flexDirection: 'column',
    padding:'0 6px 6px 6px',
    borderRadius:36,
    background:'#515B70'
  },
  zoomButtons: {
    marginTop:6
  },
  icon:{
    height:'1.5em',
    width:'1.5em',
  },
}
class InteractiveMap extends Component {
  constructor(props) {
    super(props);
    let levels = this.props.levels;
    let defaultLevel = Object.keys(levels).map(id => {
      return {
        ...{
          id : id
        },
        ...levels[id]
      }
    }).find(level => level.hasOwnProperty('default')).id;
    let [,, width, height] = levels[defaultLevel].svg['@attributes'].viewBox.split(' ');
    this.state = {
      defaultLevel: defaultLevel,
      mapSize: {
        height: height,
        width: width
      },
      levels: levels,
      locations: this.props.locations,
      level: null,
      direction: '',
      target: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};
    let newTarget = (nextProps.target)
      ? ((target) => {
        switch (target.type) {
          case 'tenant': {
            if (prevState.locations[nextProps.target.id]) {
              let tenant = prevState.locations[target.id];
              let currentLevel = (prevState.target)
                ? prevState.level
                : prevState.defaultLevel;
              let direction = (({currentLevel, newLevel}) => {
                if (newLevel < currentLevel) return 'down';
                if (newLevel > currentLevel) return 'up';
                if (newLevel === currentLevel) return prevState.direction;
                }
              )({currentLevel: currentLevel, newLevel: prevState.locations[target.id].level});
              return {
                  target: {
                    id: target.id,
                    transform: {
                      x: tenant.position.x * 100,
                      y: tenant.position.y * 100,
                      scale: 4
                    }
                  },
                  level: tenant.level,
                  direction: direction
              };
            } else return null;
          }
          case 'switchLevel': {
            let currentLevel = (prevState.target)
              ? prevState.level
              : prevState.defaultLevel;
            let direction = (({currentLevel, newLevel}) => {
              if (newLevel < currentLevel) return 'down';
              if (newLevel > currentLevel) return 'up';
              if (newLevel === currentLevel) return prevState.direction;
              }
            )({currentLevel: currentLevel, newLevel: target.level});
            return {
              target:{
                id:target.type+'_'+target.level,
                transform:{scale:1}
              },
              level:target.level,
              direction: direction
            }
          }
          case 'zoom': {
            return {
              target:{
                id:target.type+target.param+'from'+target.from,
                transform:{scale:target.param}
              },
              level:prevState.level
            };
          }
          default:
            return null;
        }
      })(nextProps.target):null;
    newTarget = (newTarget)
      ? newTarget
      : (prevState.target)
        ? { level: prevState.level }
        : { level: prevState.defaultLevel };
    newState = { ...newState, ...newTarget };
    return newState;
  }

  render() {
    let {classes} = this.props;
    return (<div style={{
        height: '100vh',
        width: '100vw',
        background: '#25324D'
      }}>
      <Paper className={classes.sideButtonsArea}>
        <Button className={classes.zoomButtons} variant="fab"  aria-label="zoom-in" onClick={() => {this.props.setTarget({param:'in',from:this.props.transformation.scale})}}><ZoomIn className={classes.icon}/></Button>
        <Button className={classes.zoomButtons} variant="fab" aria-label="zoom-out" onClick={() => {this.props.setTarget({param:'out',from:this.props.transformation.scale})}}><ZoomOut className={classes.icon}/></Button>
        <Button className={classes.zoomButtons} variant="fab" color='secondary'><Place className={classes.icon}/></Button>
      </Paper>
      <TransformContainer target={this.state.target} transformation={this.props.transformation} componentSize={this.props.size} mapSize={this.state.mapSize}>
        <Map currentLevel={(this.state.level)
              ? this.state.level
              : this.state.defaultLevel}
            levels={this.state.levels}
            direction={this.state.direction}/>
      </TransformContainer>
    </div>);
  }
}

const config = {
  monitorHeight: true,
  monitorWidth: true
};
const sizeMeHOC = sizeMe(config);

export default connect(mapStateToProps, mapDispatchToProps)(sizeMeHOC(withStyles(styles)(InteractiveMap)));
