const initialState = {
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
  currentFloor: '1',
  selectedLocation: '',
  
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_LOCATIONS': return {...state, fetchLocations : action.payload};
    case 'FETCH_MAP': return {...state, fetchMap : action.payload};
    case 'SAVE_LOCATIONS': return {...state, locations : action.payload};
    case 'SAVE_MAP': return {...state, map : action.payload};
    case 'GOTO_FLOOR': return {...state, currentFloor: action.payload};
    case 'SET_CONTAINER': return {...state, containerSize: action.payload};
    case 'SET_MAPSIZE': return {...state, mapSize: action.payload};
    case 'SELECT_LOCATION': return {...state, selectedLocation: action.payload};
    default:
        return state;
  }
};
export default rootReducer;
