import {
  View,
  Text,
  Pressable,
  ActionSheetIOS,
  ActionSheetIOSOptions,
} from "react-native";
import { router, usePathname, useRouter } from "expo-router";
import useReadChaptersStore from "@/stores/readChaptersStore";
import { HoldItem } from "react-native-hold-menu";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";

const Chapter = ({
  title,
  publishedOn,
  chNum,
  slug,
  chID,
  isRead,
}: {
  title: string;
  publishedOn: string;
  chNum: number;
  slug: string;
  chID: string;
  isRead: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const checkIfChapterIsRead = useReadChaptersStore(
    (state) => state.checkIfChapterIsRead
  );

  const markChapterAsRead = useReadChaptersStore(
    (state) => state.markChapterAsRead
  );
  const markChapterAsUnread = useReadChaptersStore(
    (state) => state.markChapterAsUnread
  );

  // const [isRead, setIsRead] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      const read = await checkIfChapterIsRead(chID);
      // setIsRead(read);
    };
    check();
  }, []);

  // useEffect(() => {
  //   const markAsRead = async () => {
  //     await markChapterAsRead(chID);
  //     setIsRead(true);
  //   };
  //   const markAsUnread = async () => {
  //     await markChapterAsUnread(chID);
  //     setIsRead(false);
  //   };
  //   return {
  //     markAsRead,
  //     markAsUnread,
  //   };
  // }, [chID]);

  const handlePress = async () => {
    // await markChapterAsRead(chID);
    // setIsRead(true);
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
            // cancelButtonTintColor:['#FF3B30'],
            destructiveButtonIndex: 2,
          },
          async (buttonIndex) => {
            if (buttonIndex === 2) {
            } else if (buttonIndex === 0) {
              await markChapterAsRead(chID);
              // setIsRead(() => true);
            } else if (buttonIndex === 1) {
              await markChapterAsUnread(chID);
              // setIsRead(() => false);
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
      <Text className="text-neutral-400">{publishedOn}</Text>
    </Pressable>
  );
};

export default Chapter;
