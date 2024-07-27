import { Text, View, Pressable, ActionSheetIOS } from "react-native";

import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import useReadChaptersStore from "@/stores/readChaptersStore";

const Chapter = ({
  title,
  publishedOn,
  chNum,
  slug,
  chID,
  groupName,
  isRead,
}: {
  title: string;
  publishedOn: string;
  chNum: number;
  slug: string;
  chID: string;
  groupName: string;
  isRead: boolean;
}) => {
  const markChapterAsRead = useReadChaptersStore(
    (state) => state.markChapterAsRead
  );
  const markChapterAsUnread = useReadChaptersStore(
    (state) => state.markChapterAsUnread
  );

  const handlePress = async () => {
    router.push({
      pathname: "/reader",
      params: {
        chID: chID,
        chNum: chNum,
      },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Mark as Read", "Mark as Unread", "Cancel"],
            cancelButtonIndex: 2,
            destructiveButtonIndex: 2,
          },
          async (buttonIndex) => {
            if (buttonIndex === 2) {
            } else if (buttonIndex === 0) {
              await markChapterAsRead(chID);
            } else if (buttonIndex === 1) {
              await markChapterAsUnread(chID);
            }
          }
        );
      }}
    >
      <Text
        className={`${isRead ? "text-neutral-400" : "text-white"} text-base`}
      >
        {title}
      </Text>
      <View className="flex flex-row items-center gap-1">
        <Text className="text-neutral-400">{publishedOn}</Text>
        <Text className="text-neutral-400">•</Text>
        <Text className="text-neutral-400 capitalize">{groupName}</Text>
      </View>
    </Pressable>
  );
};

export default Chapter;
