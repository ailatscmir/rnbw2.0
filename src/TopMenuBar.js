import React, { Component } from 'react';
import {
  AppBar,
  Toolbar,
  Button
} from 'material-ui/';
import SuggestedSearch  from './SuggestedSearch';
import ListIcon from 'material-ui-icons/List';

class TopMenuBar extends Component {

  render() {
    return (
      <AppBar position="absolute" color="default" style={{
          zIndex: 'auto',
          maxWidth: '80%',
          left: '0',
          right: '0',
          margin: '2% auto 0'
        }}>
        <Toolbar>
          <Button color="inherit" aria-label="List">
            <ListIcon/>
          </Button>
          <SuggestedSearch isDraggable={false} isFirstLetterUppercase={false} defaultKeyboard={'ru'} secondaryKeyboard={'us'} data={this.props.data}/>
        </Toolbar>
      </AppBar>
    );
  }

}

export default TopMenuBar;
