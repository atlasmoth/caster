import { baseStyles } from "../utils/baseStyles";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function CreatePayment() {
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
                  textAlign: "center",
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
                  textAlign: "center",
                  marginBottom: 40,
                },
              ]}
            >
              $50.00
            </Text>
            <Pressable
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
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
