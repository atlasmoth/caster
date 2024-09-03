import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { baseStyles } from "../utils/baseStyles";

export default function Loading() {
  return (
    <SafeAreaView style={[baseStyles.blackBg, { flex: 1 }]}>
      <View
        style={[
          {
            width: "100%",
            maxWidth: 470,
            marginHorizontal: "auto",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator color={"#fff"} size={50} />
      </View>
    </SafeAreaView>
  );
}
