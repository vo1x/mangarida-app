import { View, Text, Pressable } from "react-native";
import { router, usePathname, useRouter } from "expo-router";

const Chapter = ({
  title,
  publishedOn,
  chNum,
}: {
  title: string;
  publishedOn: string;
  chNum?: number;
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
          params: { backTitle: getBackTitle() },
        });
      }}
    >
      <Text className="text-white text-lg">{title}</Text>
      <Text className="text-gray-300">{publishedOn}</Text>
    </Pressable>
  );
};

export default Chapter;
