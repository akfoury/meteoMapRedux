import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { facebookLogin, setToken } from "../../actions";
import AsyncStorage from "@react-native-community/async-storage";
import { withNavigation } from "react-navigation";
import { subscribeToPushNotifications } from '../../services/notifications';

function IndexScreen({ facebookLogin, navigation, setToken } = props) {
    useEffect(() => {
        subscribeToPushNotifications();
        AsyncStorage.getItem("fbToken").then((token) => {
            if (token) {
                setToken(token);
                goToSearch();
            } else {
                console.log("not login");
                facebookLogin(goToSearch);
            }
        })
    }, []);

    const goToSearch = () => {
        navigation.push("Search");
    }

    return <View><Text>Hello world</Text></View>;
}

const mapStateTopProps = store => {
    return {};
}

const mapDispatchToProps = {
    facebookLogin,
    setToken
};

export default withNavigation(connect(mapStateTopProps, mapDispatchToProps)(IndexScreen));