import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { SheetProvider } from "react-native-actions-sheet";
import Signin from "./screens/Signin";
import CreatePayment from "./screens/CreatePayment";
import { makeRedirectUri } from "expo-auth-session";
import MediaFeed from "./screens/MediaFeed";
import { AuthProvider } from "./hooks/useAuth";
import * as WebBrowser from "expo-web-browser";
import Empty from "./screens/Empty";

const Stack = createNativeStackNavigator();

const redirectUri = makeRedirectUri({});

const linking = {
  prefixes: [redirectUri],
  config: {
    screens: {
      CreatePayment: "create_payment",
      Signin: "signin",
      MediaFeed: "media_feed",
    },
  },
};

export default function App() {
  React.useEffect(() => {
    WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: true,
    });
  }, []);

  const [fontsLoaded] = useFonts({
    Chirp_Bold: require("./assets/fonts/chirp_bold.otf"),
    Chirp_Regular: require("./assets/fonts/chirp_regular.otf"),
  });
  if (!fontsLoaded) {
    return <Empty />;
  }
  return (
    <AuthProvider>
      <SheetProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator>
            <Stack.Screen
              name="Signin"
              component={Signin}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MediaFeed"
              component={MediaFeed}
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
    </AuthProvider>
  );
}
