
export function setFetchFlag(data) {
  return {
    type: 'FETCH_DATA',
    payload: data
  }
}

export function saveItems(data) {
  return {
    type: 'SAVE_DATA',
    payload: data
  }
}
