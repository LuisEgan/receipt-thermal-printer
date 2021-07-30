import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet } from "react-native";
import { SelectedPrinter } from "src/App";

interface IPrinterSelector {
  setLog: (log: string) => void;
  log: string;
  selectedPrinter: SelectedPrinter;
  devices: any[];
  setSelectedPrinter: React.Dispatch<React.SetStateAction<SelectedPrinter>>;
}

const PrinterSelector = (props: IPrinterSelector) => {
  const { setLog, log, selectedPrinter, devices, setSelectedPrinter } = props;

  return (
    <Picker
      selectedValue={selectedPrinter.device_name}
      onValueChange={(device_name) => {
        setLog(`${log} setPrinter: ${device_name}\n\n`);

        if (device_name !== "Pick") {
          const foundPrinter = (devices.find(
            (d: any) => d.device_name === device_name
          ) as unknown) as SelectedPrinter;

          setSelectedPrinter(foundPrinter);
        }
      }}
    >
      {[{ device_name: "Pick", device_id: 0 }, ...devices].map((item: any) => (
        <Picker.Item
          label={item.device_name}
          value={item.device_name}
          key={item.device_id}
        />
      ))}
    </Picker>
  );
};

export default PrinterSelector;

const styles = StyleSheet.create({
  container: {},
});
