import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import MapView from "react-native-maps";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import { getCurrentWeatherByCity } from "../../actions";
import { WeatherCard } from "../../components";

const DEFAULT_COORD = {
  lat: 48.859268,
  lng: 2.347060
}

function SearchScreen({ currentWeather, getCurrentWeatherByCity } = props) {
  const [search, setSearch] = useState();

  const updateSearch = (search) => {
    setSearch(search);
  }

  const submitSearch = () => {
    getCurrentWeatherByCity(search);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
      style={styles.container}
    >
      <MapView 
        style={{flex: 1, zIndex: 0}}
        region={{
          latitude: currentWeather ? currentWeather.coord.lat : DEFAULT_COORD.lat, 
          longitude: currentWeather ? currentWeather.coord.lon : DEFAULT_COORD.lng, 
          latitudeDelta: 0.2000, 
          longitudeDelta: 0.1000
        }}
        scrollEnabled={false}
        liteMode={false}
      />
      {currentWeather && <WeatherCard currentWeather={currentWeather} />}
      <SearchBar
        lightTheme
        onChangeText={updateSearch}
        value={search}
        onSubmitEditing={submitSearch}
        placeholder="Type your city..."
        containerStyle={{
          position: "absolute",
          bottom: hp("50%"),
          left: wp("5%"),
          width: wp("90%")
        }} 
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

// Update component props based on store
const mapStoreToProps = (store) => {
  return {
    currentWeather: store.weather.currentWeather
  }
}

const mapDispatchToProps = {
  getCurrentWeatherByCity
}

export default connect(mapStoreToProps, mapDispatchToProps)(SearchScreen);