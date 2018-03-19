import React, { Component,Fragment } from 'react';
import {connect} from "react-redux";

import KeyboardedInput from 'react-touch-screen-keyboard';
import 'react-touch-screen-keyboard/lib/Keyboard.css';
import LocationsList from './LocationsList'

const mapStateToProps = (state) => {
  return {locations: state.locations}
}

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFieldValue: ''
    };
    this.handleSearchFieldChangle = this.handleSearchFieldChangle.bind(this);
  }

  handleSearchFieldChangle(ev){
    console.log(ev);
    this.setState({searchFieldValue:ev});
  }

  render() {
    console.log(this.props.locations);
    return (
      <Fragment>
        <KeyboardedInput enabled name='name' inputClassName='searchField' value={this.state.searchFieldValue} isDraggable={false} defaultKeyboard="ru" secondaryKeyboard="us" placeholder={'Поиск'} isFirstLetterUppercase={false} onChange={this.handleSearchFieldChangle}/>
        {(this.props.locations.length!==0)
          ?<LocationsList/>
          :null
        }
      </Fragment>
    );
  }

}

export default connect(mapStateToProps, null)(Sidebar);
