import { View, Text } from "react-native";
import ThemedScrollView from "@/components/ThemedScrollView";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Pressable } from "react-native";
import { Image } from "react-native";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
const Reader = () => {
  const { downloadAndStoreChapter, accessSavedFile } = useLocalStorage();
  const [imageUri, setImageUri] = useState("");

  const imageUrl =
    "http://192.168.1.73:5000/image/i/d/d8/d8fd48b71ebd5f32a2392b5e71eeb3c6.jpg";

  const loadImage = async () => {
    const uri = await accessSavedFile(imageUrl);
    if (uri) {
      setImageUri(uri);
    } else {
      console.error("Image could not be loaded.");
    }
  };

  return (
    <ThemedScrollView>
      <Text className="text-white">this is a read</Text>
      {/* <ProgressiveImage></ProgressiveImage> */}
      <Pressable
        onPress={() =>
          downloadAndStoreChapter(
            "http://192.168.1.73:5000/image/i/d/d8/d8fd48b71ebd5f32a2392b5e71eeb3c6.jpg"
          )
        }
      >
        <Text className="text-blue-400 font-bold">Click to download image</Text>
      </Pressable>
      <Pressable onPress={() => loadImage()}>
        <Text className="text-blue-400 font-bold">Click to access image</Text>
      </Pressable>

      {imageUri !== "" && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
    </ThemedScrollView>
  );
};

export default Reader;
