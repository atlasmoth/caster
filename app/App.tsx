import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { SheetProvider } from "react-native-actions-sheet";
import Signin from "./screens/Signin";
import SuccessPayment from "./screens/SuccessPayment";
import CreatePayment from "./screens/CreatePayment";
import { makeRedirectUri } from "expo-auth-session";
import MediaViewer from "./screens/MediaViewer";
import Comments from "./screens/Comments";

const Stack = createNativeStackNavigator();

const redirectUri = makeRedirectUri({});

const linking = {
  prefixes: [redirectUri],
  config: {
    screens: {
      CreatePayment: "CreatePayment",
      Signin: "Signin",
      MediaViewer: "MediaViewer",
      Comments: "/:id/Comments",
    },
  },
};

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
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen
            name="MediaViewer"
            component={MediaViewer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Comments"
            component={Comments}
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
