import { View, Text, Pressable } from "react-native";
import { router, usePathname, useRouter } from "expo-router";

const Chapter = ({
  title,
  publishedOn,
  chNum,
  slug,
  chID,
}: {
  title: string;
  publishedOn: string;
  chNum: number;
  slug: string;
  chID: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const getBackTitle = () => {
    if (pathname.includes("/library")) return "Library";
    if (pathname.includes("/search")) return "Search";
    return "Back";
  };
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/reader",
          params: {
            chID: chID,
            chNum: chNum,
          },
        });
      }}
    >
      <Text className="text-white text-base">{title}</Text>
      <Text className="text-neutral-400">{publishedOn}</Text>
    </Pressable>
  );
};

export default Chapter;
