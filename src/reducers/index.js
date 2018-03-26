const initialState = {
  wayNum: 0,
  fetchLocations: 'none',
  fetchMap: 'none',
  locations: [],
  map: [],
  containerSize:{
    height: Number(),
    width: Number()
  },
  mapSize: {
    height: Number(),
    width: Number()
  },
  currentFloor: 0,
  selectedLocation: '',
  selectedCenter:{x:0,y:0,moved:true},
  selectedLevel:0,
  fetchRaw: '',
  mapRaw: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_LOCATIONS': return {...state, fetchLocations : action.payload};
    case 'FETCH_MAP': return {...state, fetchMap : action.payload};
    case 'FETCH_RAW': return {...state, fetchRaw : action.payload};
    case 'SAVE_RAW': return {...state, mapRaw : action.payload};
    case 'SAVE_LOCATIONS': return {...state, locations : action.payload};
    case 'SAVE_MAP': return {...state, map : action.payload};
    case 'GOTO_FLOOR': return {...state, currentFloor: action.payload};
    case 'SET_SELECTED_LOCATION': return {...state, selectedLocation: action.payload};
    case 'SET_WAY_NUMBER': return {...state, wayNum: action.payload};
    case 'SET_SELECTED_CENTER': return {...state, selectedCenter: {x:action.payload.x,y:action.payload.y,moved:false}};
    case 'SET_SELECTED_LEVEL': return {...state, currentFloor: action.payload};
    default:
        return state;
  }
};
export default rootReducer;
