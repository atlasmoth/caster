import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { newOrySdk } from "../utils/orySdk";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { baseStyles } from "../utils/baseStyles";
import { useAuth } from "../hooks/useAuth";
import { storage } from "../utils/storage";
import { whoAmI } from "../utils/api";
import { RedirectSignin } from "../components/Redirect";
import { LoginFlow } from "@ory/client";

const redirectUri = AuthSession.makeRedirectUri({
  preferLocalhost: true,
  path: "/signin",
  scheme: "atlasmoth_caster",
});
function Signin({ navigation }: any) {
  const orySdk = newOrySdk();

  const { setSession, setSubscribed } = useAuth();
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState("");
  const [flow, setFlow] = useState<LoginFlow | null>(null);

  useEffect(() => {
    async function getFlow() {
      setLoading(true);
      let { data } = await orySdk.createNativeLoginFlow({
        returnTo: redirectUri,
        returnSessionTokenExchangeCode: true,
      });

      let url = "";
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
          url = error?.response?.data?.redirect_browser_to;
        }
      }
      setFlow(data);
      setLink(url);
    }
    getFlow()
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setLink, setFlow]);

  return (
    <SafeAreaView style={[baseStyles.blackBg]}>
      <ScrollView
        style={[baseStyles.container]}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={[baseStyles.centerViewContainer]}>
          <View>
            <Text
              style={[
                baseStyles.boldText,
                {
                  fontSize: 24,
                  lineHeight: 36,
                  color: "#fff",
                  marginBottom: 20,
                },
              ]}
            >
              Sign in
            </Text>
            <Pressable
              onPress={async () => {
                if (loading) {
                  return;
                }
                try {
                  setLoading(true);
                  const result = await WebBrowser.openAuthSessionAsync(
                    link,
                    redirectUri
                  );

                  if (result.type === "success") {
                    const code = new URL(result.url).searchParams.get("code")!;
                    const session = await orySdk.exchangeSessionToken({
                      initCode: flow?.session_token_exchange_code!,
                      returnToCode: code,
                    });
                    const userData = await whoAmI(session.data.session_token!);

                    setSession(session.data);
                    await storage.setItem(
                      "caster_key",
                      JSON.stringify(session.data)
                    );

                    setLoading(false);
                    if (userData.data) {
                      setSubscribed(true);
                      navigation.replace("MediaFeed");
                      return;
                    }
                    navigation.replace("CreatePayment");
                  }
                  setLoading(false);
                } catch (error) {
                  setLoading(false);
                  console.log(error);
                }
              }}
              style={[
                {
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  paddingHorizontal: 40,
                  paddingVertical: 10,
                  width: "auto",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={"#000"} size={24} />
              ) : (
                <>
                  <Image
                    source={require("./../assets/google.png")}
                    style={[{ width: 30, height: 30 }]}
                  />
                  <Text
                    style={[
                      baseStyles.boldText,
                      {
                        fontSize: 16,
                        lineHeight: 24,
                        color: "#000",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    Sign in with Google
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function SigninWithRedirect({ ...props }) {
  return <RedirectSignin screen={Signin} {...props} />;
}
