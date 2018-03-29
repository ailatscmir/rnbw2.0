const initialState = {
  fetchStatus:false,
  data: null,
  wayNum: 0,
  currentFloor: 'floor1',
  selectedLocation: null,
  transform:{
    x:0,y:0,scale:2
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA': return {...state, fetchStatus: false};
    case 'SAVE_DATA': return {...state, fetchStatus:true,data : action.payload};
    case 'SET_WAY_NUMBER': return {...state, wayNum: action.payload};
    case 'SET_LEVEL': return {...state, currentFloor: action.payload};
    case 'SET_SELECTED_LOCATION': return {...state, selectedLocation: action.payload};
    case 'SET_TRANSFORM': return {...state, transform: action.payload};
    default:
        return state;
  }
};
export default rootReducer;
