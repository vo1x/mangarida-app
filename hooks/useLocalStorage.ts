import * as FileSystem from "expo-file-system";

const useLocalStorage = () => {
  const downloadAndStoreChapter = async (
    imageUrls: string[],
    mangaSlug: string,
    chapterID: string
  ) => {
    try {
      const documentsFolderUri = `${FileSystem.documentDirectory}mangarida/${mangaSlug}/${chapterID}/`;

      const info = await FileSystem.getInfoAsync(documentsFolderUri);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(documentsFolderUri, {
          intermediates: true,
        });
      }

      for (let index = 0; index < imageUrls.length; index++) {
        const imageUrl = imageUrls[index];
        const fileExtension = imageUrl.split(".").pop();
        const newFileName = `${index + 1}.${fileExtension}`;
        const fileUri = `${FileSystem.cacheDirectory}${newFileName}`;

        const downloadResult = await FileSystem.downloadAsync(
          imageUrl,
          fileUri
        );

        if (downloadResult.status === 200) {
          const finalUri = documentsFolderUri + newFileName;

          await FileSystem.moveAsync({
            from: fileUri,
            to: finalUri,
          });

          console.log("Image saved to:", finalUri);
        } else {
          console.error("Failed to download image:", downloadResult);
        }
      }
      return true;
    } catch (error) {
      console.error("Error downloading images: ", error);
    }
  };

  const accessDownloadedChapter = async (
    mangaSlug: string,
    chapterID: string
  ) => {
    try {
      const directoryUri = `${FileSystem.documentDirectory}mangarida/${mangaSlug}/${chapterID}`;

      const directoryInfo = await FileSystem.getInfoAsync(directoryUri);
      if (!directoryInfo.exists) {
        console.error("Directory does not exist:", directoryUri);
        return [];
      }

      const files = await FileSystem.readDirectoryAsync(directoryUri);

      const sortedFilePaths = files
        .map((fileName) => ({
          fileName,
          filePath: `${directoryUri}${fileName}`,
          fileNumber: parseInt(fileName.split(".")[0], 10),
        }))
        .sort((a, b) => a.fileNumber - b.fileNumber)
        .map((file) => file.filePath);

      console.log("Sorted files in directory:", sortedFilePaths);
      return sortedFilePaths;
    } catch (error) {
      console.error("Error accessing saved files:", error);
      return [];
    }
  };

  return { downloadAndStoreChapter, accessDownloadedChapter };
};

export default useLocalStorage;
