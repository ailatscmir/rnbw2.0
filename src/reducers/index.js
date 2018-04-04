import React from 'react';
const initialState = {
  dataStatus:false,
  data: null,
  way: null,
  listMode:false,
  target:null,
  overlays:[],
  transformation:{
    x:50,y:50,scale:1
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    // case 'FETCH_DATA': return {...state, dataStatus: false};
    case 'SAVE_DATA': return {...state, dataStatus:true,data : action.payload};
    case 'CHANGLE_LISTMODE': return {...state, listMode:action.payload};
    case 'SET_WAYINFO': return {...state, overlays: [...state.overlays,...action.payload]};
    case 'SET_TARGET': return {...state, target: {...state.target,...action.payload}};
    case 'SET_TARGETMENU': return {...state, target: {...state.target,...action.payload.target},listMode:action.payload.listMode};
    case 'SAVE_TRANSFORMATION': return {...state, transformation: {...state.transformation,...action.payload}};

    default:
        return state;
  }
};
export default rootReducer;
