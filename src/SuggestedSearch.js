 import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Keyboard from './Keyboard';
import './keyboard.css';
import {withStyles} from 'material-ui/styles';
import Fuse from 'fuse.js';
import {
  FormControl,
  Input,
  // InputAdornment,
  ListItem,
  ListItemText,
  Paper,
  // IconButton
} from 'material-ui/';
// import Search from 'material-ui-icons/Search';
// import Clear from 'material-ui-icons/Clear';
const fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  includeScore: true,
  threshold: 0.2,
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
  // console.log(inputValue);
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
    marginTop: 16,
    left: 0,
    right: 0,
  }
});

class SuggestedSearch extends Component {
  constructor(props) {
    super(props);
    let locations = Object.keys(this.props.data).map(key => this.props.data[key]);
    this.state = {
      showKeyboard: false,
      input: null,
      inputValue: '',
      locations: locations
    };
  }

  handleFocus = event => {
      this.setState({input:event.target,showKeyboard:true,});
  }

  handleBlur = event => {
    this.setState({showKeyboard: false,input: null});
  }


  handleChange = (data) => {
    if (typeof data === 'object'){
      this.setState({inputValue: data.target.value})
    } else {
      this.setState({inputValue: data})
    };
  }

  handleSelect({title,id}){
    this.props.setSelectedLocation(id);
    this.setState({inputValue:title});
  }

  handleClear = (ev) => {
    this.inputNode.focus();
    this.setState({inputValue:''});
    this.props.setSelectedLocation(null);
  }

  render() {
    const {classes} = this.props;
    return (
      <div style={this.props.style}>
        <FormControl className={classes.search} onFocus={this.handleFocus} onBlur={this.handleBlur}  fullWidth>
          <Input  inputProps={{ref: (node) => {this.inputNode = node}}}  placeholder='Поиск по названию или ключевым словам'  style={{borderBottom:'1px solid #ccc'}} value={this.state.inputValue}
            // startAdornment={<InputAdornment position = "start" ><Search/></InputAdornment>}

            // endAdornment={(this.state.inputValue!=='')?<InputAdornment position = "end" onClick={this.handleClear}><IconButton><Clear/></IconButton></InputAdornment>:null}
            onChange={this.handleChange}
          />
        </FormControl>

        <Paper className={classes.paper} square>
          {
            getSuggestions(this.state.inputValue, this.state.locations).map((suggestion, index) => {
              let hint;
              if (suggestion.matches[0].key!=='title'){
                hint = ((suggestion.matches[0].key==='category.name')?'Категория: ':'Ключевое слово: ')+suggestion.matches[0].value
              } else hint=null;
              return ((this.state.inputValue!==suggestion.item.title)?<ListItem button key={index} component="div" id={suggestion.item.name} onClick={() => this.handleSelect({title:suggestion.item.title,id:suggestion.item.name})}>
                <ListItemText primary={suggestion.item.title} secondary={hint}/>
              </ListItem>:null)
            })
          }
        </Paper>
        {
          (this.state.showKeyboard)
            ? <Keyboard onClick={(value) => {this.handleChange(value)}} defaultKeyboard={this.props.defaultKeyboard} secondaryKeyboard={this.props.secondaryKeyboard} inputNode={this.state.input} dataset={this.props.dataset} isFirstLetterUppercase={this.props.isFirstLetterUppercase}/>
            : null
        }
      </div>

      //
      //


    );
  }
}

export default connect(null,mapDispatchToProps)(withStyles(styles)(SuggestedSearch));
