import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, Dimensions } from "react-native";
import Modal from "react-native-modal";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  groupNames: string[];
  onSelectionChange: (selectedGroups: string[]) => void;
  initialSelectedGroups: string[];
}

const CustomCheckbox = ({
  checked,
  onValueChange,
}: {
  checked: boolean;
  onValueChange: () => void;
}) => (
  <Pressable
    className={`w-6 h-6 border-2 rounded justify-center items-center ${
      checked ? "bg-blue-500" : "border-blue-500"
    }`}
    onPress={onValueChange}
  >
    {checked && <Text className="text-white text-lg font-bold">✓</Text>}
  </Pressable>
);

const { width, height } = Dimensions.get("window");

export default function FilterModal({
  isVisible,
  onClose,
  groupNames,
  onSelectionChange,
  initialSelectedGroups,
}: FilterModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    initialSelectedGroups
  );

  useEffect(() => {
    setSelectedGroups(initialSelectedGroups);
  }, [initialSelectedGroups]);

  const handleToggleGroup = (groupName: string) => {
    setSelectedGroups((prevState) => {
      if (prevState.includes(groupName)) {
        return prevState.filter((item) => item !== groupName);
      } else {
        return [...prevState, groupName];
      }
    });
  };

  const handleSave = () => {
    onSelectionChange(selectedGroups);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSelectAll = () => {
    setSelectedGroups(groupNames);
  };

  const handleDeselectAll = () => {
    setSelectedGroups([]);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      className="m-0 justify-center items-center"
    >
      <View
        className="bg-gray-900 rounded-lg p-5"
        style={{ width: width * 0.9, maxHeight: height * 0.8 }}
      >
        <View className="mb-2">
          <Text className="text-white text-lg font-bold mb-2">
            Filter Scanlator Groups
          </Text>
          <View className="flex-row justify-between mb-2">
            <Pressable
              onPress={handleSelectAll}
              className="bg-gray-800 p-2 rounded"
            >
              <Text className="text-[#1288ff] text-sm">Select All</Text>
            </Pressable>
            <Pressable
              onPress={handleDeselectAll}
              className="bg-gray-800 p-2 rounded"
            >
              <Text className="text-[#1288ff] text-sm">Deselect All</Text>
            </Pressable>
          </View>
        </View>
        <FlatList
          data={groupNames}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="flex-row items-center mb-2">
              <CustomCheckbox
                checked={selectedGroups.includes(item)}
                onValueChange={() => handleToggleGroup(item)}
              />
              <Text className="text-white ml-2 text-base">{item}</Text>
            </View>
          )}
          style={{ maxHeight: height * 0.5 }}
        />
        <Pressable
          onPress={handleSave}
          className="bg-[#1288ff] p-3 rounded mt-2 items-center"
        >
          <Text className="text-white text-base font-bold">Save</Text>
        </Pressable>
        <Pressable
          onPress={handleCancel}
          className="bg-gray-800 p-3 rounded mt-2 items-center"
        >
          <Text className="text-white text-base font-bold">Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
