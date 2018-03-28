const initialState = {
  fetchStatus:false,
  data: null,
  wayNum: 0,
  currentFloor: 0,
  selectedLocation: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA': return {...state, fetchStatus: false};
    case 'SAVE_DATA': return {...state, fetchStatus:true,data : action.payload};
    case 'GOTO_FLOOR': return {...state, currentFloor: action.payload};
    case 'SET_SELECTED_LOCATION': return {...state, selectedLocation: action.payload};
    case 'SET_WAY_NUMBER': return {...state, wayNum: action.payload};
    default:
        return state;
  }
};
export default rootReducer;
