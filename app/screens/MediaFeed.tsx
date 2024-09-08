import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  Text,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { ResizeMode, Video } from "expo-av";
import { FontAwesome6 } from "@expo/vector-icons";
import { baseStyles } from "../utils/baseStyles";
import { RedirectFeed } from "../components/Redirect";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getFeed } from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { Cast, Embed, FeedResponse } from "../utils/interfaces";
import { purgeDuplicates } from "../utils/misc";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ProcessText } from "../components/ProcessText";

const ImageViewer = ({
  src,
  mediaHeight,
  mediaWidth,
}: {
  src: string;
  mediaWidth: number;
  mediaHeight: number;
}) => {
  return (
    <View
      style={[
        {
          height: mediaHeight,
          width: mediaWidth,
          justifyContent: "center",
        },
      ]}
    >
      <Image
        source={{ uri: src }}
        style={[{ width: "100%", height: "100%" }]}
        contentFit="cover"
      />
    </View>
  );
};

const VideoPlayer = ({
  src,
  mediaHeight,
  mediaWidth,
  currentIndex,
  index,
  addVideoRef,
  castHash,
}: {
  src: string;
  mediaWidth: number;
  mediaHeight: number;
  currentIndex: number;
  index: number;
  addVideoRef: (ref: Video | null) => void;
  castHash: string;
}) => {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    if (video.current) {
      if (index !== currentIndex) {
        video.current
          ?.setStatusAsync({ shouldPlay: false })
          ?.catch(console.log);
      }
    }
  }, [video.current, index, currentIndex]);

  return (
    <Pressable
      onPress={async () => {
        try {
          if (status.isPlaying) {
            video.current
              ?.setStatusAsync({ shouldPlay: false })
              ?.catch(console.log);
          } else {
            // @ts-ignore
            video.current.hash = castHash;
            addVideoRef(video.current);
            video.current
              ?.setStatusAsync({ shouldPlay: true })
              ?.catch(console.log);
          }
        } catch (error) {
          console.log(error);
        }
      }}
      style={[
        {
          width: mediaWidth,
          justifyContent: "center",
          height: mediaHeight,
          position: "relative",
        },
      ]}
    >
      <View
        style={[
          {
            position: "absolute",
            zIndex: 20,
            left: 0,
            right: 0,
            alignItems: "center",
            top: 0,
            bottom: 0,
            justifyContent: "center",
          },
        ]}
      >
        {status?.isLoaded && !status?.isPlaying ? (
          <FontAwesome5 name="play" size={50} color="rgba(255,255,255,0.9)" />
        ) : null}

        {status?.isBuffering ? (
          <ActivityIndicator size={50} color="rgba(255,255,255,0.9)" />
        ) : null}
      </View>

      <Video
        ref={video}
        isMuted={false}
        source={{ uri: src }}
        style={{ flexGrow: 1 }}
        shouldPlay={false}
        isLooping
        onPlaybackStatusUpdate={setStatus}
        resizeMode={ResizeMode.COVER}
        videoStyle={{
          height: mediaHeight,
          width: mediaWidth,
          flexGrow: 1,
        }}
      />
    </Pressable>
  );
};
const MediaCast = ({
  data,
  setCurrentVideoRef,
}: {
  data: Cast;
  setCurrentVideoRef: Function;
}) => {
  const flatListRef = useRef<FlatList<Embed>>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { width } = useWindowDimensions();
  const mediaWidth = Math.min(470, width);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / mediaWidth);
    setCurrentIndex(index);
  };

  const goToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * mediaWidth,
      animated: true,
    });
    setCurrentIndex(index);
  };

  return (
    <View style={[{ width: "100%", maxWidth: mediaWidth, marginBottom: 20 }]}>
      <Pressable
        onPress={() => {
          Linking.openURL(`https://warpcast.com/${data.author.username}`);
        }}
        style={[{ flexDirection: "row", alignItems: "center", margin: 16 }]}
      >
        <Image
          source={{
            uri: data.author.pfp_url,
          }}
          style={[
            {
              width: 32,
              height: 32,
              borderRadius: 32,
              marginRight: 10,
              flexShrink: 0,
            },
          ]}
          contentFit="cover"
        />
        <View style={[{ flex: 1 }]}>
          <Text
            style={[
              baseStyles.boldText,
              { color: "#fff", marginBottom: 3, fontSize: 16 },
            ]}
          >
            {data.author.display_name}
          </Text>
          <Text
            style={[
              baseStyles.regularText,
              { color: "rgba(153, 153, 153,0.6)" },
            ]}
          >
            @{data.author.username}
          </Text>
        </View>
      </Pressable>
      <View
        style={[{ position: "relative", justifyContent: "center", flex: 1 }]}
      >
        <FlatList
          initialScrollIndex={currentIndex}
          contentContainerStyle={[
            { alignItems: "center", justifyContent: "center" },
          ]}
          ref={flatListRef}
          style={[{ zIndex: 1 }]}
          keyExtractor={(item, index) => index.toString()}
          data={data.embeds}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item, index }) => {
            return item.metadata.content_type.startsWith("image") ? (
              <ImageViewer
                src={item.url}
                mediaWidth={mediaWidth}
                mediaHeight={
                  (mediaWidth * item.metadata.image?.height_px!) /
                  item.metadata.image?.width_px!
                }
              />
            ) : (
              <VideoPlayer
                addVideoRef={(ref: Video | null) => {
                  setCurrentVideoRef(ref);
                }}
                mediaHeight={
                  (mediaWidth * item.metadata.video?.streams[0]?.height_px!) /
                  item.metadata.video?.streams[0]?.width_px!
                }
                src={item.url}
                mediaWidth={mediaWidth}
                index={index}
                currentIndex={currentIndex}
                castHash={data.hash}
              />
            );
          }}
          viewabilityConfig={viewabilityConfig}
        />
        {currentIndex > 0 && (
          <Pressable
            style={[{ position: "absolute", zIndex: 3 }, { left: 10 }]}
            onPress={() => goToIndex(currentIndex - 1)}
          >
            <FontAwesome6 name="circle-arrow-left" size={30} color="#fff" />
          </Pressable>
        )}

        {currentIndex < data.embeds.length - 1 && (
          <Pressable
            style={[{ position: "absolute", zIndex: 3 }, { right: 10 }]}
            onPress={() => goToIndex(currentIndex + 1)}
          >
            <FontAwesome6 name="circle-arrow-right" size={30} color="#fff" />
          </Pressable>
        )}

        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "center",
              position: "absolute",
              zIndex: 10,
              bottom: 20,
              left: 0,
              right: 0,
            },
          ]}
        >
          {data.embeds.map((t: any, index: any) => (
            <View
              key={index.toString()}
              style={[
                {
                  backgroundColor:
                    currentIndex === index
                      ? "rgba(255,255,255,1)"
                      : "rgba(255,255,255,0.6)",
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  marginRight: 2,
                },
              ]}
            ></View>
          ))}
        </View>
      </View>
      <View
        style={[
          {
            marginHorizontal: 16,
            marginVertical: 10,
            width: "100%",
          },
        ]}
      >
        <View
          style={[
            { flexDirection: "row", alignItems: "center", marginVertical: 10 },
            { flex: 1 },
          ]}
        >
          <Feather
            name="message-circle"
            size={20}
            color={"rgba(255,255,255,0.7)"}
          />
          <Text
            style={[
              baseStyles.regularText,
              { color: "#fff" },
              { marginLeft: 3 },
            ]}
          >
            {data.replies.count}
          </Text>
          <AntDesign
            name="retweet"
            size={20}
            color={"rgba(255,255,255,0.7)"}
            style={[{ marginLeft: 15 }]}
          />
          <Text
            style={[
              baseStyles.regularText,
              { color: "#fff" },
              { marginLeft: 3 },
            ]}
          >
            {data.reactions.recasts.length}
          </Text>
          <AntDesign
            name="hearto"
            size={20}
            color={"rgba(255,255,255,0.6)"}
            style={[{ marginLeft: 15 }]}
          />
          <Text
            style={[
              baseStyles.regularText,
              { color: "#fff" },
              { marginLeft: 3 },
            ]}
          >
            {data.reactions.likes.length}
          </Text>
        </View>
        <ProcessText text={data.text} />

        <Pressable
          onPress={() => {
            Linking.openURL(
              `https://warpcast.com/${data.author.username}/${data.hash.slice(
                0,
                10
              )}`
            ).catch(console.log);
          }}
        >
          <Text
            style={[
              baseStyles.regularText,
              { color: "#0095f6", marginBottom: 10 },
            ]}
          >
            View more
          </Text>
        </Pressable>

        <Text
          style={[baseStyles.regularText, { color: "rgba(255,255,255,0.7)" }]}
        >
          {new Date(data.timestamp).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          })}
        </Text>
      </View>
    </View>
  );
};

const MediaFeed = ({ ...props }) => {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState("");
  const { session } = useAuth();
  const [currentVideoRef, setCurrentVideoRef] = useState<Video | null>();
  const [viewableKeys, setViewableKeys] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        currentVideoRef
          ?.setStatusAsync({ shouldPlay: false })
          ?.catch(console.log);
      };
    }, [currentVideoRef])
  );

  useEffect(() => {
    if (currentVideoRef) {
      // @ts-ignore

      if (!viewableKeys.includes(currentVideoRef.hash)) {
        currentVideoRef
          ?.setStatusAsync({ shouldPlay: false })
          ?.catch(console.log);
      }
    }
  }, [viewableKeys, currentVideoRef]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    const keys = viewableItems.map((t: any) => t.key);
    setViewableKeys(keys);
  }, []);

  useEffect(() => {
    return () => {
      setCursor("");
      setCasts([]);
    };
  }, []);

  return (
    <SafeAreaView
      style={[
        baseStyles.blackBg,
        { flex: 1, paddingVertical: 20, paddingBottom: 50 },
      ]}
    >
      <FlatList
        onViewableItemsChanged={onViewableItemsChanged}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: "auto",
        }}
        onEndReached={async () => {
          if (loading) return;
          try {
            setLoading(true);
            const feedResponse: FeedResponse = await getFeed(
              session?.session_token!,
              cursor
            );
            setCursor(feedResponse.next?.cursor!);
            setCasts((t) =>
              purgeDuplicates([
                ...t,
                ...feedResponse.casts.map((t) => ({
                  ...t,
                  embeds: t.embeds.filter((e) => {
                    if (e?.metadata?.content_type?.startsWith("image")) {
                      return true;
                    }
                    if (e?.metadata?.content_type?.startsWith("video")) {
                      const firstStream = (e?.metadata?.video?.streams ||
                        [])[0];
                      if (firstStream?.height_px) {
                        return true;
                      }
                    }

                    return false;
                  }),
                })),
              ])
            );
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }}
        data={casts}
        keyExtractor={(item) => item.hash}
        renderItem={({ item }) => (
          <MediaCast
            {...props}
            data={item}
            setCurrentVideoRef={setCurrentVideoRef}
          />
        )}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
      {loading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 25,
          }}
        >
          <ActivityIndicator size={40} color={"#fff"} />
        </View>
      ) : null}
    </SafeAreaView>
  );
};
export default function MediaFeedWithRedirect({ ...props }) {
  return <RedirectFeed screen={MediaFeed} {...props} />;
}
