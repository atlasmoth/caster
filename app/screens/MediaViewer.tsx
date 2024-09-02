import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { ResizeMode, Video } from "expo-av";
import { FontAwesome6 } from "@expo/vector-icons";
import { baseStyles } from "../utils/baseStyles";

const { width, height } = Dimensions.get("window");

type MediaItem = {
  type: "image" | "video";
  uri: string;
};

const mediaData: MediaItem[] = [
  {
    type: "image",
    uri: "https://via.placeholder.com/800x600.png?text=Image+1",
  },
  { type: "video", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
  {
    type: "image",
    uri: "https://via.placeholder.com/800x600.png?text=Image+2",
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
}: {
  src: string;
  mediaWidth: number;
  mediaHeight: number;
}) => {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const togglePlayPause = () => {
    if (status.isPlaying) {
      video.current?.pauseAsync();
    } else {
      video.current?.playAsync();
    }
  };

  return (
    <View
      style={[
        {
          width: mediaWidth,
          justifyContent: "center",
          height: mediaHeight,
        },
      ]}
    >
      <Video
        ref={video}
        source={{ uri: src }}
        style={{ flex: 1 }}
        isLooping
        shouldPlay
        onPlaybackStatusUpdate={setStatus}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls={true}
        videoStyle={{
          height: mediaHeight,
          width: mediaWidth,
        }}
      />
    </View>
  );
};
const MediaViewer: React.FC = () => {
  const flatListRef = useRef<FlatList<MediaItem>>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { width, height } = useWindowDimensions();
  const mediaHeight = height * 0.6;
  const mediaWidth = Math.min(500, width);
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
    <View style={[baseStyles.blackBg]}>
      <View
        style={[{ width: "100%", maxWidth: 500, marginHorizontal: "auto" }]}
      >
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
            renderItem={({ item }) => {
              return item.type === "image" ? (
                <ImageViewer
                  src={item.uri}
                  mediaHeight={mediaHeight}
                  mediaWidth={mediaWidth}
                />
              ) : (
                <VideoPlayer
                  src={item.uri}
                  mediaHeight={mediaHeight}
                  mediaWidth={mediaWidth}
                />
              );
            }}
            viewabilityConfig={viewabilityConfig}
          />
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[{ position: "absolute", zIndex: 3 }, { left: 10 }]}
              onPress={() => goToIndex(Math.max(0, currentIndex - 1))}
            >
              <FontAwesome6 name="circle-arrow-left" size={30} color="#fff" />
            </TouchableOpacity>
          )}

          {currentIndex < mediaData.length - 1 && (
            <TouchableOpacity
              style={[{ position: "absolute", zIndex: 3 }, { right: 10 }]}
              onPress={() =>
                goToIndex(Math.min(currentIndex + 1, mediaData.length - 1))
              }
            >
              <FontAwesome6 name="circle-arrow-right" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default MediaViewer;
