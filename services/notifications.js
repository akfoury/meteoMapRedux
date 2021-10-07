import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import axios from "axios";

export const subscribeToPushNotifications = () => {
    Permissions.getAsync(Permissions.NOTIFICATIONS).then(existingPermission => {
        if (existingPermission != "granted") {
            Permissions.askAsync(Permissions.NOTIFICATIONS).then(permission => {
                if(permission.status != "granted") {
                    return;
                } else {
                    Notifications.getExpoPushTokenAsync().then(token => {
                        console.log(token.data);
                        axios.get("https://notifications-test-push.herokuapp.com/?token="+token.data).then(axiosRes => {
                            console.log("reponse: ", axiosRes.data);
                        });
                    });
                }
            });
        } else {
            Notifications.getExpoPushTokenAsync().then(token => {
                // console.log(token.data);
                axios.get("https://notifications-test-push.herokuapp.com/?token="+token.data).then(axiosRes => {
                    console.log("reponse: ", axiosRes.data);
                });
            });
        }
    });
}
