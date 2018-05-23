import keyMirror from '../utils/keyMirror'

export const FacetConstants = keyMirror(
  {
    GET_STATE: null,
    SET_STATE: null,
  },
  'FACET'
)

export const initialState = { isEnabled: true }

const demoAppStorageKey = 'dapp-facet'

export function getFacetState() {
  return async function(dispatch) {
    const strObj = window.localStorage.getItem(demoAppStorageKey)

    const { isEnabled } = strObj ? JSON.parse(strObj) : initialState
    dispatch({ type: FacetConstants.GET_STATE, isEnabled })
  }
}

export function setFacetState(isEnabled) {
  return async function(dispatch) {
    window.localStorage.setItem(demoAppStorageKey, JSON.stringify({ isEnabled }))
    dispatch({ type: FacetConstants.SET_STATE, isEnabled })
  }
}
