import React, { Component } from 'react';
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
import KeyboardArrowDown from 'material-ui-icons/KeyboardArrowDown';

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
    return (
      <AppBar position="absolute" color="default" style={{
          zIndex: 'auto',
          maxWidth: '80%',
          left: '0',
          right: '0',
          margin: '2% auto 0'
        }}>
        <Toolbar style={{display:'flex'}}>
          <Button style={{flexGrow:1,padding:0,margin:0,boxSizing:'border-box'}} color="inherit" aria-label="List">
            <ListIcon/>
          </Button>
          <SuggestedSearch style={{flexBasis:'50%',padding:0,margin:0}} isDraggable={false} isFirstLetterUppercase={false} defaultKeyboard={'ru'} secondaryKeyboard={'us'} data={this.props.data}/>
          <Button style={{flexGrow:1,padding:0,margin:0}} color='primary' variant='raised' aria-haspopup="true" onClick={this.toggleLevelMenu}>{(this.props.currentLevel==='floor1')?'Первый этаж':'Второй этаж'}<KeyboardArrowDown /></Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.levelMenu}
          open={(this.state.levelMenu)?true:false}
          onClose={this.handleClose}
          style={{}}
        >
          <MenuItem onClick={() => {this.levelSelect('floor1')}}>1 Этаж</MenuItem>
          <MenuItem onClick={() => {this.levelSelect('floor2')}}>2 Этаж</MenuItem>
        </Menu>
        </Toolbar>
      </AppBar>
    );
  }

}

export default connect(mapStateToProps,mapDispatchToProps)(TopMenuBar);
