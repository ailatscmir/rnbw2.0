const initialState = {
  dataStatus:false,
  data: null,
  way: null,
  target:null,
  transformation:{
    x:50,y:50,scale:1
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    // case 'FETCH_DATA': return {...state, dataStatus: false};
    case 'SAVE_DATA': return {...state, dataStatus:true,data : action.payload};
    case 'SET_WAYINFO': return {...state, way: action.payload};
    case 'SET_TARGET': return {...state, target: {...state.target,...action.payload}};
    case 'SAVE_TRANSFORMATION': return {...state, transformation: {...state.transformation,...action.payload}};

    default:
        return state;
  }
};
export default rootReducer;
