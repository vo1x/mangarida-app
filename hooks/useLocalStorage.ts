import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const useLocalStorage = () => {
  const downloadAndStoreChapter = async (imageUrl: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Media Library permissions are required to download chapters");
        return;
      }
      const cacheDirectory = FileSystem.cacheDirectory;
      const fileName = imageUrl.split("/").pop();
      const fileUri = cacheDirectory! + fileName;

      const downloadResult = await FileSystem.downloadAsync(
        imageUrl,
        FileSystem.cacheDirectory! + imageUrl.split("/").pop()
      );

      if (downloadResult.status === 200) {
        const documentsFolderUri = FileSystem.documentDirectory + "mangarida/";
        const finalUri = documentsFolderUri + fileName;

        const info = await FileSystem.getInfoAsync(documentsFolderUri);
        if (!info.exists) {
          await FileSystem.makeDirectoryAsync(documentsFolderUri, {
            intermediates: true,
          });
        }

        await FileSystem.moveAsync({
          from: fileUri,
          to: finalUri,
        });

        console.log("Image saved to Documents folder:", finalUri);
      } else {
        console.error("Failed to download image:", downloadResult);
      }
    } catch (error) {
      console.error("Error download image: ", error);
    }
  };

  const accessSavedFile = async (imageUrl: string) => {
    try {
      const fileName = imageUrl.split("/").pop();
      const filePath = FileSystem.documentDirectory + "mangarida/" + fileName;

      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        console.log("File exists at:", filePath);
        return filePath;
      } else {
        console.error("File does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error accessing saved file:", error);
      return null;
    }
  };

  return { downloadAndStoreChapter, accessSavedFile };
};

export default useLocalStorage;
