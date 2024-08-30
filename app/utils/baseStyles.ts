import { StyleSheet } from "react-native";

export const baseStyles = StyleSheet.create({
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
  boldText: {
    fontFamily: "Chirp_Bold",
  },
  regularText: {
    fontFamily: "Chirp_Regular",
  },
});
