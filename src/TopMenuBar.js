import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,MenuItem
} from 'material-ui/';
import SuggestedSearch  from './SuggestedSearch';
import ListIcon from 'material-ui-icons/List';
import {LooksOne,LooksTwo} from 'material-ui-icons/';

const setLevel = (level) => {
  return {type:'SET_LEVEL',payload:level}
}
const mapStateToProps = state => {
  return {currentLevel:state.currentFloor}
}

const mapDispatchToProps = dispatch => {
  return {
    setLevel: bindActionCreators(setLevel, dispatch)
  }
}

const style = {
  menu: {
    padding:24
  }
}


class TopMenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levelMenu:null,
    };
  }
  toggleLevelMenu = (event) => {
    this.setState({ levelMenu: event.currentTarget });

  }

  handleClose = () => {
    this.setState({levelMenu:null});
  }

  levelSelect = (level) => {
    this.props.setLevel(level);
    this.handleClose();
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
        <Toolbar style={{display:'flex'}}>
          <Button color="inherit" aria-label="List">
            <ListIcon/>
          </Button>
          <SuggestedSearch isDraggable={false} isFirstLetterUppercase={false} defaultKeyboard={'ru'} secondaryKeyboard={'us'} data={this.props.data}/>
          <Button color='primary' variant='raised' aria-haspopup="true">
            <LooksOne/>&nbsp;этаж
          </Button>
          <Button color='primary' variant='raised' aria-haspopup="true">
            <LooksTwo/>&nbsp;этаж
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(style)(TopMenuBar));
