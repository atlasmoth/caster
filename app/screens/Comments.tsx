import * as React from "react";
import { FlatList, View, SafeAreaView } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

import { Image } from "expo-image";
import { Feather, FontAwesome, Entypo } from "@expo/vector-icons";

import data from "./../utils/sample.json";
import { baseStyles } from "../utils/baseStyles";
import { CastListItem } from "../components/CastListItem";

export default function Comments() {
  const FlatItem = React.useCallback(({ item }: any) => {
    return <CastListItem data={item} />;
  }, []);

  return (
    <SafeAreaView style={[baseStyles.blackBg, { flex: 1 }]}>
      <View
        style={[
          { width: "100%", maxWidth: 470, marginHorizontal: "auto", flex: 1 },
        ]}
      >
        <FlatList
          keyExtractor={(item) => item.hash}
          data={data}
          renderItem={FlatItem}
        />
      </View>
    </SafeAreaView>
  );
}
