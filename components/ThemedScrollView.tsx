import { ScrollView, ScrollViewProps } from "react-native";

export default function ThemedScrollView({ children }: ScrollViewProps) {
  return (
    <ScrollView className={`flex flex-col mt-24 mx-4 text-white`}>
      {children}
    </ScrollView>
  );
}
