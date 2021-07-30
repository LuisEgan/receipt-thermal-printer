import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { SelectedPrinter } from "src/App";

interface INetPrinterSelector {
  setSelectedPrinter: React.Dispatch<React.SetStateAction<SelectedPrinter>>;
}

const NetPrinterSelector = (props: INetPrinterSelector) => {
  const { setSelectedPrinter } = props;

  const handleChangeHostAndPort = (params: string) => (text: string) =>
    setSelectedPrinter((prev) => ({
      ...prev,
      device_name: "Net Printer",
      [params]: text,
      printerType: "net",
    }));

  return (
    <View style={{ paddingVertical: 16 }}>
      <View style={styles.rowDirection}>
        <Text>Host: </Text>
        <TextInput
          placeholder="192.168.100.19"
          onChangeText={handleChangeHostAndPort("host")}
        />
      </View>
      <View style={styles.rowDirection}>
        <Text>Port: </Text>
        <TextInput
          placeholder="9100"
          onChangeText={handleChangeHostAndPort("port")}
        />
      </View>
    </View>
  );
};

export default NetPrinterSelector;

const styles = StyleSheet.create({
  rowDirection: {
    flexDirection: "row",
  },
});
