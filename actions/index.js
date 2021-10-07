import axios from "axios";
import { API_KEY, FACEBOOK_APP_ID } from "../constants";
const WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const FORECAST_WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';
import { SET_CURRENT_WEATHER, SET_FORECAST_WEATHER, FACEBOOK_LOGIN_SUCCESS, FACEBOOK_LOGIN_ERROR} from "./action-types";
import * as Facebook from "expo-facebook";
import AsyncStorage from "@react-native-community/async-storage";


export const getCurrentWeatherByCity = city => async dispatch => {
    const response = await axios.get(`${WEATHER_BASE_URL}?q=${city}&appid=${API_KEY}`);
    dispatch({type: SET_CURRENT_WEATHER, payload: response.data});
}

export const getForecastWeatherByCity = city => async dispatch => {
    const response = await axios.get(`${FORECAST_WEATHER_BASE_URL}?q=${city}&appid=${API_KEY}`);
    dispatch({type: SET_FORECAST_WEATHER, payload: response.data});
}

export const facebookLogin = async (dispatch, onSuccess, onError) => {
    try {
      await Facebook.initializeAsync({
        appId: FACEBOOK_APP_ID,
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // dispatcher success fbResponse.token
        setToken(token);
        AsyncStorage.setItem("fbToken", token);
        onSuccess && onSuccess();
      } else {
            // dispatcher une erreur
            onError && onError();
            return dispatch({type: FACEBOOK_LOGIN_ERROR});
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
}

export const setToken = token => dispatch => {
    dispatch({type: FACEBOOK_LOGIN_SUCCESS, payload: token});
}

