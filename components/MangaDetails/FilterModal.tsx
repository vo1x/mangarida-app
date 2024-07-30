import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
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
    style={[styles.checkbox, checked && styles.checkboxChecked]}
    onPress={onValueChange}
  >
    {checked && <Text style={styles.checkmark}>✓</Text>}
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
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Scanlator Groups</Text>
          <View style={styles.selectButtons}>
            <Pressable onPress={handleSelectAll} style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Select All</Text>
            </Pressable>
            <Pressable onPress={handleDeselectAll} style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Deselect All</Text>
            </Pressable>
          </View>
        </View>
        <FlatList
          data={groupNames}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              <CustomCheckbox
                checked={selectedGroups.includes(item)}
                onValueChange={() => handleToggleGroup(item)}
              />
              <Text style={styles.groupName}>{item}</Text>
            </View>
          )}
          style={styles.flatList}
        />
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    width: width * 0.9,
    maxHeight: height * 0.8,
    padding: 20,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  selectButton: {
    backgroundColor: "#2c2c2e",
    padding: 8,
    borderRadius: 5,
  },
  selectButtonText: {
    color: "#1288ff",
    fontSize: 14,
  },
  flatList: {
    maxHeight: height * 0.5,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  groupName: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#1288ff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#2c2c2e",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#1288ff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1288ff",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
