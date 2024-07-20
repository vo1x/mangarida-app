import { SafeAreaView, ScrollView, ScrollViewProps } from "react-native";

export default function ThemedScrollView({
  children,
  ...rest
}: ScrollViewProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className={`flex flex-col mx-4 text-white mt-4`} {...rest}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
