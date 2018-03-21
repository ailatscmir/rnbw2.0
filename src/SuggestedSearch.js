import React, {Component,Fragment} from 'react';
import {TextField, FormControl,Input,InputAdornment,MenuItem,Paper} from 'material-ui/';
import Search from 'material-ui-icons/Search';
import Downshift from 'downshift';

import { withStyles } from 'material-ui/styles';

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(inputValue,data) {
  let count = 0;
  return data.filter(suggestion => {

    const keep =
      (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

const styles = theme => ({
  container: {
    flexGrow: 0.4,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  hiddenInput: {
    display: 'none'
  }
});


class SuggestedSearch extends Component {

  constructor(props) {
    super(props);
    let locations = this.props.data.map(location => location.title);
    this.state = {
      inputNode:null,
      inputValue: '',
      selectedItem: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderInput = this.renderInput.bind(this);


  }

  handleChange(ev){
    this.setState({value:ev.target.value})
  }

  handleFocus(ev){
    console.log(ev.target);
    this.setState({inputNode:ev.target})
  }
  handleBlur(ev){
    console.log('blur');
    this.setState({inputNode:null})
  }
  handleClick(){
    console.log('keyy');
  }
  renderInput(inputProps){

    const { InputProps, classes, ref, ...other } = inputProps;
    const {inputNode} = this.state;
    return (
      <FormControl onFocus={this.handleFocus} onBlur={this.handleBlur}>
      <Input
        startAdornment={<InputAdornment position = "start"> <Search/></InputAdornment>}
        inputProps={{
          classes: {
            root: classes.inputRoot,
          },
          ...InputProps,
        }}
        {...other}

      />
    </FormControl>
    );
  }

  render() {
    const { classes } = this.props;
    return (<Fragment>
      <Downshift>
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div className={classes.container}>
            {this.renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'Поиск по названию магазина',
                id: 'integration-downshift-simple',
              }),
            })}
            {isOpen ? (
              <Paper className={classes.paper}>
                {getSuggestions(inputValue,this.props.data.map(location => {return {label:location.title}})).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>

      </Fragment>
  );
  }

}

export default withStyles(styles)(SuggestedSearch);
