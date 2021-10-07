import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import { getForecastWeatherByCity } from "../../actions";
import { LineChart } from "react-native-chart-kit";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { kelvinToCelsius } from "../../services/temperature";
import { Button } from "react-native-elements";

function AdvancedDetailsScreen({ navigation, getForecastWeatherByCity, forecastWeather }) {
    useEffect(() => {
        const city = navigation.getParam("city");
        getForecastWeatherByCity(city);
    }, []);

    const getTemperatures = () => {
        return forecastWeather.list.map(weather => {
            return (kelvinToCelsius(weather.main.temp));
        })
    }

    const getHumidity = () => {
        return forecastWeather.list.map(weather => {
            return (kelvinToCelsius(weather.main.humidity));
        })
    }

    const getLabels = () => {
        return forecastWeather.list.map((_, index) => {
            let day = index / 8;
            return (index === 0 ? "t" : index % 8 === 0 ? "t+" + day + "j" : "");
        });
    } 

    const renderChart = (data) => {
        return (
        <LineChart
            data={{
            labels: getLabels(),
            datasets: [
                {
                data: data
                }
            ]
            }}
            width={wp("90%")} // from react-native
            height={hp("30%")}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16,
                left: wp("5%")
            },
            propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
            }
            }}
            bezier
            style={{
            marginVertical: 8,
            borderRadius: 16
            }}
        />
        )
    }

    const goBack = () => {
        navigation.goBack();
    }

    const renderCharts = () => {
        return (
            <View style={{alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: 30, paddingTop: hp("1%")}}>
                    {forecastWeather.city.name} 5 days forecast
                </Text>
                <Text style={{fontSize: 20, marginBottom: hp("2%")}}>
                    Températures (C°)
                </Text>
                {renderChart(getTemperatures())}
                <Text style={{fontSize: 20, marginBottom: hp("2%")}}>
                    Humidity (C°)
                </Text>
                {renderChart(getHumidity())}
                <Button onPress={goBack} title="Back" containerStyle={{marginTop: hp("1%"), width: wp("90%")}} />
            </View>
        )
    }

    return (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "white"}}>
            {forecastWeather ? renderCharts() : <Text>Loading...</Text>}
        </View> 
    );
}

const mapStoreToProps = store => {
    return {
        forecastWeather: store.weather.forecastWeather
    };
}

const mapDispatchToProps = {
    getForecastWeatherByCity
}

export default withNavigation(connect(mapStoreToProps, mapDispatchToProps)(AdvancedDetailsScreen));
