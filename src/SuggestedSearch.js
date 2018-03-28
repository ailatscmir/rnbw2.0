import React, {Component,Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Keyboard from './Keyboard';
import './keyboard.css';
import {withStyles} from 'material-ui/styles';
import Fuse from 'fuse.js';
import {
  FormControl,
  Input,
  InputAdornment,
  ListItem,
  ListItemText,
  Paper,
  IconButton
} from 'material-ui/';
import Search from 'material-ui-icons/Search';
import Clear from 'material-ui-icons/Clear';
const fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  includeScore: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {name:"title",weight:0.8},
    {name:"searchKeys",weight:0.3},
    {name:"category.name",weight:0.5}
]
};


const setSelectedLocation = (location) =>{
  return {type:'SET_SELECTED_LOCATION',payload:location}
}

const getSuggestions = (inputValue, data) => {
  let fuse = new Fuse(data,fuseOptions);
  return fuse.search(inputValue).slice(0,8);
}

const mapDispatchToProps = dispatch => {
  return {
    setSelectedLocation: bindActionCreators(setSelectedLocation, dispatch)
  }
}
const styles = theme => ({
  root:{
    flexGrow:1
  },
  search:{
    flexGrow:1,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 44,
    left: 0,
    right: 0,
  }
});

class SuggestedSearch extends Component {
  constructor(props) {
    super(props);
    // this.handleFocus = this.handleFocus.bind(this);
    // this.handleBlur = this.handleBlur.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSelect = this.handleSelect.bind(this);
    // this.hideKeyboard = this.hideKeyboard.bind(this);
    // this.handleClear = this.handleClear.bind(this);
    this.state = {
      showKeyboard: false,
      input: null,
      inputValue: ''
    };
  }

  handleFocus = event => {
      this.setState({input:event.target,showKeyboard:true,});
  }

  handleBlur = event => {
    setTimeout(() => {
       if (!document.activeElement.classList.contains('keyboard-button') && !document.activeElement.classList.contains('keyboard') && !document.activeElement.classList.contains('keyboard-row')) {
         this.setState({showKeyboard: false,input: null});
       }
     }, 0);
  }


  handleChange(ev) {
    let value = ev.target.value;
    this.setState({inputValue: value})
  }

  // handleFocus(ev) {
  //   this.setState({input: ev.target, inputValue: ev.target.value});
  //   let temp_value = ev.target.value
  //   ev.target.value = ''
  //   ev.target.value = temp_value;
  // }
  //
  // handleBlur(ev) {
  //   const that = this;
  //   setTimeout(() => {
  //     if (!document.activeElement.classList.contains('keyboard-button') && !document.activeElement.classList.contains('keyboard') && !document.activeElement.classList.contains('keyboard-row')) {
  //       that.setState({
  //         ...that.state,
  //         showKeyboard: false
  //       });
  //       this.setState({input: null});
  //     }
  //   }, 0);
  // }

  handleSelect({title,id}){
    this.props.setSelectedLocation(id);
    this.setState({inputValue:title});
  }

  hideKeyboard() {
    this.setState({
      ...this.state,
      showKeyboard: false
    });
  }
  handleClear(){
    console.log('clear');
    document.getElementById("kinput").focus();
    this.setState({inputValue:''});
    this.props.setSelectedLocation('');
  }
  render() {
    const {classes} = this.props;
    return (
      <Fragment>
        <FormControl className={classes.search} onFocus={this.handleFocus} onBlur={this.handleBlur}>
          <Input placeholder='Поиск по названию или ключевым словам' ref={(input) => { this.textInput = input } } disableUnderline style={{borderBottom:'1px solid #ccc'}}
            startAdornment={<InputAdornment position = "start" ><Search/></InputAdornment>}
            // endAdornment={(this.state.inputValue!=='')?<InputAdornment position = "end" onClick={this.handleClear}><IconButton><Clear/></IconButton></InputAdornment>:null}
          />
        </FormControl>

        <Paper className={classes.paper} square>
          <h1>124</h1>
              {/* getSuggestions(this.state.inputValue, this.props.data).map((suggestion, index) => {
              let hint;
              if (suggestion.matches[0].key!=='title'){
                hint = ((suggestion.matches[0].key==='category.name')?'Категория: ':'Ключевое слово: ')+suggestion.matches[0].value
              } else hint=null;
              return ((this.state.inputValue!==suggestion.item.title)?<ListItem button key={index} component="div" id={suggestion.item.name} onClick={() => this.handleSelect({title:suggestion.item.title,id:suggestion.item.name})}>
                <ListItemText primary={suggestion.item.title} secondary={hint}/>
              </ListItem>:null)
            })
           */}
        </Paper>
        {
          (this.state.showKeyboard)
            ? <Keyboard defaultKeyboard={this.props.defaultKeyboard} secondaryKeyboard={this.props.secondaryKeyboard} inputNode={this.state.input} dataset={this.props.dataset} isFirstLetterUppercase={this.props.isFirstLetterUppercase}/>
            : null
        }
      </Fragment>

      //
      //


    );
  }
}

export default connect(null,mapDispatchToProps)(withStyles(styles)(SuggestedSearch));
