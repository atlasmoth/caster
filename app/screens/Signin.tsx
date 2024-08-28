import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { newOrySdk } from "../utils/orySdk";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

export default function Signin() {
  const orySdk = newOrySdk();
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: true,
    });
  }, []);

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
                  let { data } = await orySdk.createNativeLoginFlow({
                    returnTo: AuthSession.makeRedirectUri({
                      preferLocalhost: true,
                      path: "/Signin",
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

                  const result = await WebBrowser.openAuthSessionAsync(
                    link,
                    AuthSession.makeRedirectUri({
                      preferLocalhost: true,
                      path: "/Signin",
                    })
                  );

                  if (result.type === "success") {
                    const code = new URL(result.url).searchParams.get("code")!;
                    const session = await orySdk.exchangeSessionToken({
                      initCode: data.session_token_exchange_code!,
                      returnToCode: code,
                    });
                    console.log(JSON.stringify(session.data, null, 2));
                  }
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
                source={require("./../assets/google.png")}
                style={[{ width: 30, height: 30, backgroundColor: "#fff" }]}
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
