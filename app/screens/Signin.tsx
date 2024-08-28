import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { newOrySdk } from "../utils/orySdk";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

export default function Signin() {
  const orySdk = newOrySdk();

  return (
    <View style={[styles.blackBg]}>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={[styles.centerViewContainer]}>
          <View>
            <Text
              style={[
                {
                  fontFamily: "Chirp_Bold",
                  fontSize: 24,
                  lineHeight: 36,
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: 40,
                },
              ]}
            >
              Sign in
            </Text>
            <Pressable
              onPress={async () => {
                try {
                  // const flow = await initializeFlow("login");
                  // const socialProviders = getProviders(flow.ui.nodes);
                  // console.log({ socialProviders });
                  let { data } = await orySdk.createNativeLoginFlow({
                    returnTo: AuthSession.makeRedirectUri({
                      preferLocalhost: true,
                      path: "/Callback",
                    }),
                    returnSessionTokenExchangeCode: true,
                  });
                  let link = "";
                  try {
                    await orySdk.updateLoginFlow({
                      flow: data.id,
                      updateLoginFlowBody: {
                        method: "oidc",
                        provider: "google",
                      },
                    });
                  } catch (error: any) {
                    if (error?.response?.data?.redirect_browser_to) {
                      link = error?.response?.data?.redirect_browser_to;
                    }
                  }
                  console.log(
                    AuthSession.makeRedirectUri({
                      preferLocalhost: true,
                      path: "/Callback",
                    })
                  );
                  const result = await WebBrowser.openAuthSessionAsync(
                    link,
                    AuthSession.makeRedirectUri({
                      preferLocalhost: true,
                      path: "/Callback",
                    })
                  );

                  console.log({ result });
                  // Linking.openURL(`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=593019911827-pug37laickoaummfsuinncrtfqo54em8.apps.googleusercontent.com&redirect_uri=http://localhost:8081/Callback&scope=openid%20email%20profile&access_type=offline&prompt=consent
                  // `);
                } catch (error) {
                  console.log(error);
                }
              }}
              style={[
                {
                  backgroundColor: "#fff",
                  borderRadius: 25,
                  paddingHorizontal: 40,
                  paddingVertical: 10,
                  width: "auto",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                source={require("./../assets/google_logo.png")}
                style={[{ width: 30, height: 30 }]}
              />

              <Text
                style={[
                  {
                    fontFamily: "Chirp_Bold",
                    fontSize: 16,
                    lineHeight: 24,
                    color: "#000",
                    marginLeft: 10,
                  },
                ]}
              >
                Sign in with Google
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  blackBg: {
    backgroundColor: "#000",
    flexGrow: 1,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    marginHorizontal: "auto",
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },
});
