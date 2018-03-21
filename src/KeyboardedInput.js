import React from 'react';
import PropTypes from 'prop-types';
import Keyboard from './Keyboard';
import './keyboard.css';
import {withStyles} from 'material-ui/styles';
import {
  FormControl,
  Input,
  InputAdornment,
  MenuItem,
  Paper
} from 'material-ui/';
import Search from 'material-ui-icons/Search';

function getSuggestions(inputValue, data) {
  let count = 0;

  return data.filter(location => {
    const keep = (inputValue !== '') && (!inputValue || location.title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) && (count < 5) && (location.title !==inputValue);
    if (keep) {
      count += 1;
    }

    return keep;
  });
}

const styles = theme => ({
  container: {
    flexGrow: 0.4,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit + 12,
    left: 0,
    right: 0
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  hiddenInput: {
    display: 'none'
  }
});

class KeyboardedInput extends React.Component {
  static propTypes = {
    name: PropTypes.any,
    inputClassName: PropTypes.any,
    keyboardClassName: PropTypes.any,
    placeholder: PropTypes.any,
    value: PropTypes.any.isRequired,
    type: PropTypes.any,
    min: PropTypes.any,
    max: PropTypes.any,
    step: PropTypes.any,
    pattern: PropTypes.any,
    readOnly: PropTypes.any,
    enabled: PropTypes.any,
    defaultKeyboard: PropTypes.any,
    secondaryKeyboard: PropTypes.any,
    opacity: PropTypes.any,
    isDraggable: PropTypes.any,
    isFirstLetterUppercase: PropTypes.any,
    uppercaseAfterSpace: PropTypes.any,
    dataset: PropTypes.any,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.hideKeyboard = this.hideKeyboard.bind(this);

    this.state = {
      showKeyboard: false,
      input: null,
      inputValue: '',
      selectedItem: []
    };
  }

  handleChange(ev) {
    let value = ev.target.value;
    this.setState({inputValue: value})
  }

  handleFocus(ev) {
    this.setState({input: ev.target, inputValue: ev.target.value});
    let temp_value = ev.target.value
    ev.target.value = ''
    ev.target.value = temp_value;
  }

  handleBlur(ev) {
    const that = this;
    setTimeout(() => {
      if (!document.activeElement.classList.contains('keyboard-button') && !document.activeElement.classList.contains('keyboard') && !document.activeElement.classList.contains('keyboard-row')) {
        that.setState({
          ...that.state,
          showKeyboard: false
        });
        this.setState({input: null});
      }
    }, 0);
  }

  handleSelect(ev){
    console.log('selected '+ev.target.title);
    this.setState({inputValue:ev.target.title});
  }

  hideKeyboard() {
    this.setState({
      ...this.state,
      showKeyboard: false
    });
  }

  render() {
    const {classes} = this.props;
    return (<div style={{
        flexGrow: 1
      }}>
      <FormControl onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} fullWidth>
        <Input value={this.state.inputValue}onChange={this.handleChange} startAdornment={<InputAdornment position = "start" > <Search/></InputAdornment>}/>
      </FormControl>
      <Paper className={classes.paper}>
        {
          getSuggestions(this.state.inputValue, this.props.data).map((suggestion, index) => {
            return (<MenuItem key={index} component="div" onClick={this.handleSelect} title={suggestion.title}>
              {suggestion.title}
            </MenuItem>)
          })
        }
      </Paper>
      {
        (this.state.input)
          ? <Keyboard defaultKeyboard={this.props.defaultKeyboard} secondaryKeyboard={this.props.secondaryKeyboard} inputNode={this.state.input} dataset={this.props.dataset} isFirstLetterUppercase={this.props.isFirstLetterUppercase}/>
          : null
      }

    </div>);
  }
}

export default withStyles(styles)(KeyboardedInput);
