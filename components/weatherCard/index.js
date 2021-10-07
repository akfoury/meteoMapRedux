import React, { useEffect, useState, useRef } from 'react';
import { Animated, View, Text, PanResponder, Image } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { kelvinToCelsius } from "../../services/temperature";
import { Button } from "react-native-elements";
import { withNavigation } from "react-navigation";

const CARD_INITIAL_POSITION_Y = hp("80%");
const CARD_INITIAL_POSITION_X = wp("5%");
const TRESHOLD_TO_TOP = hp("75%");
const TRESHOLD_TO_BOTTOM = hp("70%");
const CARD_OPEN_POSITION = hp("50%");
const MAX_DRAG_ZONE_WHEN_OPEN = hp("60%");
const ICON_URL = "http://openweathermap.org/img/w/";

function WeatherCard({ currentWeather, navigation }) {
    const [panResponder, setPanResponder] = useState(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const position = useRef(new Animated.ValueXY()).current;

    const getCardStyle = () => {
        return {
            width: wp("90%"),
            height: hp("110%"),
            borderRadius: 10,
            zIndex: 1,
            backgroundColor: "white",
            elevation: 1,
            shadowColor: "black",
            shadowOpacity: 0.2,
            shadowOffset: { height: 2, width: 2},
            position: "absolute",
            left: CARD_INITIAL_POSITION_X,
            padding: hp("2%"),
            ...position.getLayout()
        }
    }

    useEffect(() => {
        const onFocusListener = navigation.addListener(
            "willFocus",
            payload => {
                resetPosition(() => setIsOpen(false));
            }
        )
        position.setValue({x: CARD_INITIAL_POSITION_X, y: CARD_INITIAL_POSITION_Y});
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
                if(!(isOpen && gesture.y0 > MAX_DRAG_ZONE_WHEN_OPEN)) {
                    position.setValue({
                        x: CARD_INITIAL_POSITION_X,
                        y: gesture.moveY
                    });
                }
            },
            onPanResponderRelease: (e, gesture) => {
                if(!isOpen) {
                    if(gesture.moveY <= TRESHOLD_TO_TOP) {
                        setOpenPosition(() => setIsOpen(true));
                    } else {
                        resetPosition();
                    }
                } else {
                    if(gesture.moveY <= TRESHOLD_TO_BOTTOM) {
                        setOpenPosition();
                    } else {
                        if(gesture.y0 < MAX_DRAG_ZONE_WHEN_OPEN) {
                            resetPosition(() => setIsOpen(false));
                        }
                    }
                }
            }
        });
        setPanResponder(panResponder);
    }, []);

    const setOpenPosition = (done) => {
        Animated.spring(position, {
            toValue: {x: CARD_INITIAL_POSITION_X, y: CARD_OPEN_POSITION},
            useNativeDriver: false
        }).start(() => done && done());
    }

    const resetPosition = (done) => {
        Animated.spring(position, {
            toValue: {x: CARD_INITIAL_POSITION_X, y: CARD_INITIAL_POSITION_Y},
            useNativeDriver: false
        }).start(() => done && done());
    }

    const goToAdvancedDetails = () => {
        navigation.push("Detail", {city: currentWeather.name});
        // console.log('Advanced Details');
    }

    const renderHeader = () => {
        return (
            <View style={{justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 30, marginTop: hp("1%")}}>
                    {currentWeather.name}
                </Text>
                <View style={{flexDirection: "row"}}>
                    <Text style={{marginTop: hp("1%"), fontSize: 35}}>
                        {kelvinToCelsius(currentWeather.main.temp) + " C°"}
                    </Text>
                    <Image style={{height: 60, width: 60}} source={{uri: `${ICON_URL}${currentWeather.weather[0].icon}.png`}} />
                </View>
            </View>
        )
    }

    const renderMoreDetails = () => {
        return (
            <View>
                <View style={{alignItems: "center", paddingTop: hp("5%")}}>
                    <Text>Humidity: {currentWeather.main.humidity}%</Text>
                    <Text>Pressure: {currentWeather.main.pressure}hpa</Text>
                    <Text>Max temparature: {kelvinToCelsius(currentWeather.main.temp_max)}C°</Text>
                    <Text>Min temparature: {kelvinToCelsius(currentWeather.main.temp_min)}C°</Text>
                    <Text>Wind speed: {currentWeather.wind.speed} Km/h</Text>
                </View>
                <Button 
                    containerStyle={{marginTop: hp("3%"), width: wp("80%")}} 
                    onPress={goToAdvancedDetails} 
                    title="See 5 days forecast"
                >
                </Button>
            </View>
        )
    }

    return (
        panResponder 
            ? <Animated.View 
                {...panResponder.panHandlers} 
                style={getCardStyle()} 
              >
                  {renderHeader()}
                  {isOpen && renderMoreDetails()}
              </Animated.View>
            : <View />
    )
}

export default withNavigation(WeatherCard);
