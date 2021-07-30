import React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
  IUSBPrinter,
  IBLEPrinter,
  INetPrinter,
} from "react-native-thermal-receipt-printer";

import Loader from "./components/Loader";
import NetPrinterSelector from "./components/NetPrinterSelector";
import PrinterSelector from "./components/PrinterSelector";

export const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
};

export interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

export default function App() {
  const [selectedValue, setSelectedValue] = useState<keyof typeof printerList>(
    "usb"
  );
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPrinter, setSelectedPrinter] = useState<SelectedPrinter>({});
  const [log, setLog] = useState<string>("");
  const [errorLog, setErrorLog] = useState<string>("");

  // * Set devices on start
  useEffect(() => {
    const getListDevices = async () => {
      if (selectedValue === "net") return;

      // * Get list device for net printers is support scanning in local ip but not recommended
      const Printer = printerList[selectedValue];
      try {
        setLoading(true);
        setLog(
          `${log} init printer - value: ${selectedValue} - ${Printer}\n\n`
        );
        await Printer.init();
        setLog(`${log} initialized\n\n`);
        const results = await Printer.getDeviceList();
        setLog(`${log} results: ${JSON.stringify(results)}\n\n`);

        const devices = results.map((item: any) => ({
          ...item,
          printerType: selectedValue,
        }));

        setLog(`${log} devices: ${JSON.stringify(devices)}\n\n`);

        setDevices(devices);
      } catch (err) {
        console.warn(err);
        setErrorLog(`getListDevices - ${err}\n\n`);
      } finally {
        setLoading(false);
      }
    };
    getListDevices();
  }, []);

  const handleConnectSelectedPrinter = () => {
    if (!selectedPrinter) return;
    const connect = async () => {
      try {
        setLoading(true);
        switch (selectedPrinter.printerType) {
          case "ble":
            await BLEPrinter.connectPrinter(
              selectedPrinter?.inner_mac_address || ""
            );
            break;
          case "net":
            await NetPrinter.connectPrinter(
              selectedPrinter?.host || "",
              selectedPrinter?.port || ""
            );
            break;
          case "usb":
            await USBPrinter.connectPrinter(
              selectedPrinter?.vendor_id || "",
              selectedPrinter?.product_id || ""
            );
            break;
          default:
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    connect();
  };

  const handleChangePrinterType = (type: keyof typeof printerList) => {
    setSelectedValue((prev) => {
      printerList[prev].closeConn();
      return type;
    });
    setSelectedPrinter({});
  };

  const handlePrint = async () => {
    try {
      const Printer = printerList[selectedValue];
      await Printer.printText("<C>ayyy</C>\n\n");
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Select printer type: </Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(type) =>
            handleChangePrinterType(type as keyof typeof printerList)
          }
        >
          {Object.keys(printerList).map((item, index) => (
            <Picker.Item
              label={item.toUpperCase()}
              value={item}
              key={`printer-type-item-${index}`}
            />
          ))}
        </Picker>
      </View>

      <ScrollView style={styles.logger}>
        <Text>{log}</Text>
        <Text style={{ color: "red" }}>{errorLog}</Text>
      </ScrollView>

      <View style={styles.section}>
        <Text>Select printer: </Text>

        {selectedValue === "net" ? (
          <NetPrinterSelector {...{ setSelectedPrinter }} />
        ) : (
          <PrinterSelector
            {...{ devices, log, selectedPrinter, setLog, setSelectedPrinter }}
          />
        )}
      </View>

      <Button
        disabled={!selectedPrinter?.device_name}
        title="Connect"
        onPress={handleConnectSelectedPrinter}
      />
      <Button
        disabled={!selectedPrinter?.device_name}
        title="Print sample"
        onPress={handlePrint}
      />
      <Loader loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  section: {
    flex: 1,
  },
  rowDirection: {
    flexDirection: "row",
  },
  logger: {
    height: 300,
  },
});
