import React, { Component,Fragment } from 'react';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,MenuItem,
  Paper
} from 'material-ui/';
import SuggestedSearch  from './SuggestedSearch';
import LocationsList from './LocationsList';
import {List,Layers} from 'material-ui-icons/';
// import {LooksOne,LooksTwo} from 'material-ui-icons/';

const mapStateToProps = state => {
  return {currentLevel:state.currentFloor}
}

const setTarget = levelId => {
  return ({type:'SET_TARGET', payload:{type:'switchLevel',level:levelId}})
}

const mapDispatchToProps = dispatch => {
  return {
    setTarget: bindActionCreators(setTarget, dispatch)
  }
}

const styles = {
  listButtonLabel: {
    display:'flex',
    flexDirection:'column',
    fontSize:12
  },
  listButton:{
    padding:0,
    marginRight:12
  },
  listIcon: {
    width:'1.5em',
    height:'1.5em',
    marginBottom:-4
  }
};


class TopMenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList:true
    };
  }
  toggleList = () => {
    let {showList} = this.state;
    this.setState({showList:!showList})
  }
  render() {
    let {classes}  = this.props;
    return (
      <AppBar position="absolute" color="default" style={{
          zIndex: 'auto',
          maxWidth: '80%',
          left: '0',
          right: '0',
          margin: '2% auto 0'
        }}>
        <Toolbar style={{display:'flex',justifyContent:'space-between'}}>

            <Button color="inherit" aria-label="List" classes={{root:classes.listButton,label:classes.listButtonLabel}} onClick={this.toggleList}>
              {
                (this.state.showList)?<Fragment><Layers className={classes.listIcon}/>Карта</Fragment>
                :<Fragment><List className={classes.listIcon}/>Список</Fragment>
              }
            </Button>
          <div style={{flexGrow:1}}>
            {(this.state.showList)?null:<SuggestedSearch  isDraggable={false} isFirstLetterUppercase={false} defaultKeyboard={'ru'} secondaryKeyboard={'us'} data={this.props.data}/>}
          </div>
          <div>
            {
              (!this.state.showList)?
              this.props.levelIds.map( levelId =>
                <Button style={{marginLeft:12}} key={levelId.id} color='primary' variant='raised' aria-haspopup="true" onClick={() => {this.props.setTarget(levelId.id)}}>
                  {levelId.name}
                </Button> ):null
            }
          </div>
          <Paper className='scrollable' square style={{position:'absolute',height:'80vh',top:64,width:'100%',marginLeft:-24,padding:20,overflowY:'scroll',display:(this.state.showList)?'block':'none'}}>
            <LocationsList locations={this.props.data} />
          </Paper>

        </Toolbar>
      </AppBar>
    );
  }

}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(TopMenuBar));
