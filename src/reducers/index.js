const initialState = {
  dataStatus:false,
  data: null,
  wayNum: (window.location.hash.replace('#', '')!=='')?window.location.hash.replace('#', ''):0,
  currentFloor: 'floor1',
  currentLocation: null,
  transformation:{
    x:50,y:50,scale:2
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    // case 'FETCH_DATA': return {...state, dataStatus: false};
    case 'SAVE_DATA': return {...state, dataStatus:true,data : action.payload};
    case 'SET_WAY_NUMBER': return {...state, wayNum: action.payload};
    case 'SET_CURRENTLEVEL': return {...state, currentFloor: action.payload};
    case 'SET_CURRENTLOCATION': return {...state, currentLocation: action.payload};
    case 'SAVE_TRANSFORMATION': return {...state, transformation: action.payload};

    default:
        return state;
  }
};
export default rootReducer;
