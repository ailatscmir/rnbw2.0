
export function setFetchFlag(flag, data) {
  return {
    type: 'FETCH_' + flag,
    payload: data
  }
}

export function saveItems(flag, data) {
  return {
    type: 'SAVE_' + flag,
    payload: data
  }
}
