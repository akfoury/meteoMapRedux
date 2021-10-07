import { SET_FORECAST_WEATHER, SET_CURRENT_WEATHER } from "../actions/action-types";

const initialState = {
    currentWeather: undefined,
    forecastWeather: undefined
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_CURRENT_WEATHER: 
            return {
                ...state,
                currentWeather: action.payload
            }
        case SET_FORECAST_WEATHER:
            return {
                ...state,
                forecastWeather: action.payload
            }
        default:
            return state;
    }
}