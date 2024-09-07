import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
  Text,
  SafeAreaView,
  ViewToken,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { ResizeMode, Video } from "expo-av";
import { FontAwesome6 } from "@expo/vector-icons";
import { baseStyles } from "../utils/baseStyles";
import { RedirectFeed } from "../components/Redirect";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type MediaItem = {
  type: "image" | "video";
  uri: string;
};

const mediaData: MediaItem[] = [
  {
    type: "image",
    uri: "https://images.unsplash.com/photo-1725261353746-fdb0052adc46?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    type: "video",
    uri: "https://vz-629bcc17-285.b-cdn.net/fd3bf2f8-533a-4591-94e2-18a96aecfba6/play_720p.mp4",
  },
  {
    type: "image",
    uri: "https://plus.unsplash.com/premium_photo-1719467541039-567e90c13506?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

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
}: {
  src: string;
  mediaWidth: number;
  mediaHeight: number;
  currentIndex: number;
  index: number;
  addVideoRef: (ref: Video | null) => void;
}) => {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    if (video.current) {
      if (index !== currentIndex) {
        video.current?.setStatusAsync({ shouldPlay: false });
      } else {
        addVideoRef(video.current);
        video.current?.setStatusAsync({ shouldPlay: true });
      }
    }
  }, [video.current, index, currentIndex]);

  return (
    <Pressable
      onPress={async () => {
        try {
          if (status.isPlaying) {
            video.current?.setStatusAsync({ shouldPlay: false });
          } else {
            video.current?.setStatusAsync({ shouldPlay: true });
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
        shouldPlay={true}
        isLooping
        onPlaybackStatusUpdate={setStatus}
        resizeMode={ResizeMode.CONTAIN}
        videoStyle={{
          height: mediaHeight,
          width: mediaWidth,
          flexGrow: 1,
        }}
      />
    </Pressable>
  );
};
const MediaCast: React.FC = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList<MediaItem>>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { width, height } = useWindowDimensions();
  const mediaHeight = height * 0.5;
  const mediaWidth = Math.min(470, width);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const [currentVideoRef, setCurrentVideoRef] = useState<Video | null>();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        currentVideoRef?.setStatusAsync({ shouldPlay: false });
      };
    }, [currentVideoRef])
  );
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
    <SafeAreaView style={[baseStyles.blackBg]}>
      <View
        style={[{ width: "100%", maxWidth: 470, marginHorizontal: "auto" }]}
      >
        <View
          style={[
            { flexDirection: "row", alignItems: "center", marginVertical: 10 },
          ]}
        >
          <Image
            source={{
              uri: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725235200&semt=ais_hybrid",
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
              Jason Goldberg
            </Text>
            <Text
              style={[
                baseStyles.regularText,
                { color: "rgba(153, 153, 153,0.6)" },
              ]}
            >
              @betashop.eth
            </Text>
          </View>
        </View>
        <View style={[{ position: "relative", justifyContent: "center" }]}>
          <FlatList
            initialScrollIndex={currentIndex}
            ref={flatListRef}
            style={[{ zIndex: 1 }]}
            keyExtractor={(_, index) => index.toString()}
            data={mediaData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            renderItem={({ item, index }) => {
              return item.type === "image" ? (
                <ImageViewer
                  src={item.uri}
                  mediaHeight={mediaHeight}
                  mediaWidth={mediaWidth}
                />
              ) : (
                <VideoPlayer
                  addVideoRef={(ref: Video | null) => {
                    setCurrentVideoRef(ref);
                  }}
                  src={item.uri}
                  mediaHeight={mediaHeight}
                  mediaWidth={mediaWidth}
                  index={index}
                  currentIndex={currentIndex}
                />
              );
            }}
            viewabilityConfig={viewabilityConfig}
          />
          {currentIndex > 0 && (
            <Pressable
              style={[{ position: "absolute", zIndex: 3 }, { left: 10 }]}
              onPress={() => goToIndex(Math.max(0, currentIndex - 1))}
            >
              <FontAwesome6 name="circle-arrow-left" size={30} color="#fff" />
            </Pressable>
          )}

          {currentIndex < mediaData.length - 1 && (
            <Pressable
              style={[{ position: "absolute", zIndex: 3 }, { right: 10 }]}
              onPress={() =>
                goToIndex(Math.min(currentIndex + 1, mediaData.length - 1))
              }
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
            {mediaData.map((t, index) => (
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
        <View style={[{ marginHorizontal: 16, marginVertical: 10 }]}>
          <Text
            style={[baseStyles.boldText, { color: "#fff", fontWeight: "700" }]}
          >
            312 likes
          </Text>
          <Text
            style={[
              baseStyles.regularText,
              {
                marginVertical: 10,
                color: "#fff",
                fontSize: 15,
                lineHeight: 20,
              },
            ]}
          >
            I’ve been using it for a however long it’s been out now. In cursor
            their both side by side so I switch whenever it’s relevant, I guess
            I just finally noticed how much stingier Claude is with the response
            tokens
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate("Comments", { id: 1234 });
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
            March 31
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function MediaCastWithRedirect({ ...props }) {
  return <RedirectFeed screen={MediaCast} {...props} />;
}
