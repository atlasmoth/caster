import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { SheetProvider } from "react-native-actions-sheet";
import Signin from "./screens/Signin";
import SuccessPayment from "./screens/SuccessPayment";
import CreatePayment from "./screens/CreatePayment";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Chirp_Bold: require("./assets/fonts/chirp_bold.otf"),
    Chirp_Regular: require("./assets/fonts/chirp_regular.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SheetProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SuccessPayment"
            component={SuccessPayment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreatePayment"
            component={CreatePayment}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SheetProvider>
  );
}
