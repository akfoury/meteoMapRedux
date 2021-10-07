import React from 'react';
import store from "./store";
import { Provider } from "react-redux";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { SearchScreen, AdvancedDetailsScreen, IndexScreen } from "./screens";

export default function App() {
  return (
    <Provider store={store}>
      <Routes />
      </Provider>
  );
}

const StackNavigator = createStackNavigator(
  {
    Index: IndexScreen,
    Search: SearchScreen,
    Detail: AdvancedDetailsScreen
  },
  {
    initialRouteName: "Index",
    headerMode: "none"
  }
);

const Routes = createAppContainer(StackNavigator);