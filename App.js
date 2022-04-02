import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Events from "./Events";
import EventContent from "./EventContent";

const MainStack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{headerShown: false}}>
        <MainStack.Screen name="Events" component={Events} />
        <MainStack.Screen name="EventContent" component={EventContent} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App