import { Linking, Text } from "react-native";
import { baseStyles } from "../utils/baseStyles";

export const ProcessText = ({ text }: { text: string }) => {
  return (
    <Text
      style={[
        baseStyles.regularText,
        {
          marginBottom: 10,
          color: "#fff",
          fontSize: 14,
          lineHeight: 20,
        },
      ]}
    >
      {text
        .replaceAll("\n", " ")
        .split(" ")
        .map((t, index) => {
          if ((t.length > 0 && t.startsWith("@")) || t.startsWith("http")) {
            return (
              <Text
                onPress={() => {
                  Linking.openURL(
                    t.startsWith("@") ? `https://warpcast.com/${t.slice(1)}` : t
                  ).catch(console.log);
                }}
                key={index}
                style={[
                  {
                    color: "#0D78F2",
                    fontWeight: "600",
                  },
                ]}
              >
                {t}{" "}
              </Text>
            );
          }

          return <Text key={index}>{t} </Text>;
        })}
    </Text>
  );
};
