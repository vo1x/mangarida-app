import { ScrollView, ScrollViewProps } from "react-native";

export default function ThemedScrollView({
  children,
  ...rest
}: ScrollViewProps) {
  return (
    <ScrollView className={`flex flex-col mt-24 mx-4 text-white`} {...rest}>
      {children}
    </ScrollView>
  );
}
