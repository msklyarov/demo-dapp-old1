import keyMirror from '../utils/keyMirror'
import beautyServicesJson from '../../public/schemas/beauty-services.json';
import cosmeticsJson from '../../public/schemas/cosmetics.json';

export const FilteringConstants = keyMirror(
  {
    GET_STATE: null,
    SET_STATE: null,
    RESET_STATE: null,
    CLEAR_STATE: null,
  },
  'FILTERING'
)

export const sortKey = {
  none: 'none',
  name: 'name',
  category: 'category',
  price: 'price'
}

export const sortOrder = {
  asc: 'asc',
  desc: 'desc'
}

export const initialState = {
  location: '',
  name: '',
  beautyServices: beautyServicesJson.properties.category.enum,
  cosmetics: cosmeticsJson.properties.category.enum,
  weekDays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  dayHourFrom: 8,
  dayHourTo: 20,
  sortKey: sortKey.none,
  sortOrder: null,
}

export const clearedState = {
  location: '',
  name: '',
  beautyServices: [],
  cosmetics: [],
  weekDays: [],
  dayHourFrom: 8,
  dayHourTo: 20,
  sortKey: sortKey.none,
  sortOrder: null,
}

const demoAppStorageKey = 'dapp-filtering'

export function getFiltering() {
  return async function(dispatch) {
    const strObj = window.localStorage.getItem(demoAppStorageKey)
    const storedObj = strObj ? JSON.parse(strObj) : initialState
    dispatch({ type: FilteringConstants.GET_STATE, payload: storedObj })
  }
}

export function setFiltering(obj) {
  return async function(dispatch) {
    const strObj = window.localStorage.getItem(demoAppStorageKey)
    const storedObj = strObj ? JSON.parse(strObj) : initialState
    const resultObj = { ...storedObj, ...obj }

    window.localStorage.setItem(demoAppStorageKey, JSON.stringify(resultObj))
    dispatch({ type: FilteringConstants.SET_STATE, payload: resultObj })
  }
}

export function resetFiltering() {
  return async function(dispatch) {
    window.localStorage.removeItem(demoAppStorageKey)
    dispatch({ type: FilteringConstants.RESET_STATE })
  }
}

export function clearFiltering() {
  return async function(dispatch) {
    window.localStorage.setItem(demoAppStorageKey, JSON.stringify(clearedState))
    dispatch({ type: FilteringConstants.CLEAR_STATE, payload: clearedState })
  }
}
