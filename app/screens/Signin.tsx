import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

export default function Signin() {
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

                  marginBottom: 40,
                },
              ]}
            >
              Sign in
            </Text>
            <Pressable
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
                source={require("./../assets/google_logo.svg")}
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
