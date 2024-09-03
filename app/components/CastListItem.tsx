import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Cast } from "./../utils/CastTypes";
import { formatDistance } from "date-fns";
import { memo } from "react";

const blurhash = "L5KUl|IA0Kay~WWBWVj]00ayaeWC";
const colors = {
  bgWhite: "#fff",
  grey: "rgba(153, 153, 153,0.6)",
  black: "#000",
  bgWhiteTransparent: "rgba(0, 0, 0, 0.15)",
  blue: "#0C66CD",
};

function NoMemoCastListItem({ data }: { data: Cast }) {
  return (
    <View
      style={[
        castListItemStyles.itemContainer,
        data.main
          ? {
              borderBottomColor: "rgba(255,255,255,0.1)",
              borderBottomWidth: 1,
              marginBottom: 20,
              paddingBottom: 20,
            }
          : {},
      ]}
    >
      <View style={[castListItemStyles.splitArticle]}>
        <View
          style={[
            {
              width: 36,
              marginRight: 10,
              height: "100%",
              alignItems: "center",
            },
          ]}
        >
          <Image
            style={[castListItemStyles.avatar]}
            source={data.author.pfp_url}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
        </View>
        <View style={[{ flex: 1 }]}>
          <View
            style={[
              castListItemStyles.flexRow,
              { marginBottom: 5, alignItems: "flex-start" },
            ]}
          >
            <View style={[{ flex: 1 }]}>
              <Text
                style={[
                  {
                    fontFamily: "Chirp_Bold",
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.bgWhite,
                  },
                ]}
              >
                {data.author.display_name}
              </Text>
              <Text
                style={[
                  {
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.grey,
                    fontFamily: "Chirp_Regular",
                  },
                ]}
              >
                @{data.author.username}
              </Text>
            </View>
            <Text
              style={[
                {
                  fontSize: 14,
                  lineHeight: 20,
                  color: colors.grey,
                  fontFamily: "Chirp_Regular",
                },
              ]}
            >
              {formatDistance(
                new Date(data.timestamp || new Date()),
                new Date(),
                {
                  addSuffix: true,
                }
              )}
            </Text>
          </View>
          <Text
            style={[
              {
                marginBottom: 10,
                fontFamily: "Chirp_Regular",
                color: colors.bgWhite,
                fontSize: 14,
                lineHeight: 20,
              },
            ]}
          >
            {data.text
              .replaceAll("\n", " ")
              .split(" ")
              .map((t, index) => {
                if (
                  (t.length > 0 && t.startsWith("@")) ||
                  t.startsWith("http")
                ) {
                  return (
                    <Text
                      onPress={() => {
                        Linking.openURL(
                          t.startsWith("@")
                            ? `https://warpcast.com/${t.slice(1)}`
                            : t
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

          <View style={[castListItemStyles.flexRow, { flex: 1 }]}>
            <Feather name="message-circle" size={20} color={colors.grey} />
            <Text style={[castListItemStyles.lightSubText, { marginLeft: 3 }]}>
              {data.replies.count}
            </Text>
            <AntDesign
              name="retweet"
              size={20}
              color={colors.grey}
              style={[{ marginLeft: 10 }]}
            />
            <Text style={[castListItemStyles.lightSubText, { marginLeft: 3 }]}>
              {data.reactions.recasts.length}
            </Text>
            <AntDesign
              name="hearto"
              size={20}
              color={colors.grey}
              style={[{ marginLeft: 10 }]}
            />
            <Text style={[castListItemStyles.lightSubText, { marginLeft: 3 }]}>
              {data.reactions.likes.length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export const CastListItem = memo(NoMemoCastListItem);

const castListItemStyles = StyleSheet.create({
  avatar: { width: 36, height: 36, borderRadius: 36, objectFit: "cover" },
  centerView: { justifyContent: "center" },
  splitArticle: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.bgWhiteTransparent,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lightSubText: {
    color: colors.grey,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Chirp_Regular",
  },
  thumbnail: {
    width: 16,
    height: 16,
    borderRadius: 500,
    objectFit: "cover",
  },
  thumbnails: {
    width: 36,
    marginRight: 10,
  },
  secondThumbnail: {
    marginLeft: -6,
  },
  galleryItem: {
    flexBasis: "47%",
    borderRadius: 15,
    minHeight: 140,
    flex: 1,
    objectFit: "cover",
    overflow: "hidden",
    marginBottom: 10,
  },
});
