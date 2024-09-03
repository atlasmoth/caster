import { useEffect, useState } from "react";
import { baseStyles } from "../utils/baseStyles";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "../hooks/useAuth";
import { BASE_URL } from "../utils/api";

export default function CreatePayment({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const { session } = useAuth();
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: true,
    });
  }, []);

  return (
    <View style={[baseStyles.blackBg]}>
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
                  fontSize: 14,
                  lineHeight: 20,
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: 20,
                },
              ]}
            >
              Subscribe to Caster
            </Text>
            <Text
              style={[
                baseStyles.boldText,
                {
                  fontSize: 24,
                  lineHeight: 36,
                  color: "#fff",
                  marginBottom: 40,
                },
              ]}
            >
              $50.00
            </Text>
            <Pressable
              onPress={async () => {
                if (loading) {
                  return;
                }
                setLoading(true);
                try {
                  let redirectUri = encodeURI(
                    AuthSession.makeRedirectUri({
                      preferLocalhost: true,
                      path: "CreatePayment",
                      scheme: "atlasmoth_caster",
                    })
                  );

                  const res = await axios.post(
                    `${BASE_URL}/users/checkout`,
                    {
                      successUrl: redirectUri,
                      cancelUrl: redirectUri,
                    },
                    {
                      withCredentials: false,
                      headers: {
                        Authorization: `Bearer ${session?.session_token}`,
                      },
                    }
                  );

                  const result = await WebBrowser.openAuthSessionAsync(
                    res.data.data.url,
                    redirectUri
                  );

                  console.log({ result });
                  setLoading(false);
                } catch (error) {
                  setLoading(false);
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
                <ActivityIndicator size={24} color={"#000"} />
              ) : (
                <Text
                  style={[
                    baseStyles.boldText,
                    {
                      fontSize: 16,
                      lineHeight: 24,
                      color: "#000",
                    },
                  ]}
                >
                  Continue
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
