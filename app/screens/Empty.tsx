import { SafeAreaView } from "react-native";
import { baseStyles } from "../utils/baseStyles";

export default function Empty() {
  return (
    <SafeAreaView style={[baseStyles.blackBg, { flex: 1 }]}></SafeAreaView>
  );
}
