import { FacetConstants, initialState } from '../actions/Facet'

export default function Facet(state = initialState, action = {}) {
  switch (action.type) {
    case FacetConstants.GET_STATE:
    case FacetConstants.SET_STATE:
      return { isEnabled: action.isEnabled }

    default:
      return state
  }
}


