// src/main.ts
import './css/card.css';
import { loadCSV, csvData, CSVRow } from './utils/csvLoader.ts';
import { Card } from './comp/card';
import { renderCard, createNextButton } from './comp/cardUI.ts';
import { recordMic } from './utils/spacedRepetition.ts';

const app = document.getElementById('app') as HTMLElement;
let cards: Card[] = [];
let currentIndex = 0;

// Initialization function
async function init() {
  try {
    // Load the CSV data and wait for completion
    await loadCSV('/data/chinese.csv');

    // Ensure csvData is populated
    if (csvData.length === 0) {
      throw new Error('CSV data is empty or not loaded properly.');
    }

    // Process the CSV data
    cards = csvData.map(
      (row: CSVRow) =>
        new Card(
          row.book,
          row.lesson,
          `/audio/${row.audio_1}`,
          row.text_1,
          row.text_2,
          row.text_3,
          row.text_4
        )
    );

    // Render the first card and create the next button
    renderCard(currentIndex, cards, app);
    createNextButton(cards, app);

    // Initialize the recorder functionality
    recordMic(cards);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Initialize the app
init();

// bluetooth

// main.ts

// // Define types for better type safety
// type BluetoothDevice = {
//   gatt: BluetoothRemoteGATTServer | null;
//   addEventListener: (event: string, callback: () => void) => void;
//   name: string;
// };

// type BluetoothRemoteGATTServer = {
//   connect: () => Promise<BluetoothRemoteGATTServer>;
//   getPrimaryService: (
//     serviceUUID: string
//   ) => Promise<BluetoothRemoteGATTService>;
// };

// type BluetoothRemoteGATTService = {
//   getCharacteristic: (
//     characteristicUUID: string
//   ) => Promise<BluetoothRemoteGATTCharacteristic>;
// };

// type BluetoothRemoteGATTCharacteristic = {
//   writeValue: (value: BufferSource) => Promise<void>;
// };

// // Function to request Bluetooth device and connect
// async function connectToBluetoothDevice(): Promise<void> {
//   try {
//     console.log('Requesting Bluetooth Device...');
//     const device: BluetoothDevice = (await navigator.bluetooth.requestDevice({
//       acceptAllDevices: true,
//       optionalServices: ['00001896-0000-1000-8000-00805f9b34fb'], // Media Control Service UUID
//     })) as BluetoothDevice;

//     console.log('Connecting to GATT Server...');
//     const server: BluetoothRemoteGATTServer = await device.gatt!.connect();

//     console.log('Connected to Bluetooth Device:', device.name);

//     // Optionally, interact with the device here, e.g., controlling media playback
//   } catch (error) {
//     console.error('Error connecting to Bluetooth device:', error);
//   }
// }

// // Function to control media playback
// async function playPauseMedia(
//   server: BluetoothRemoteGATTServer
// ): Promise<void> {
//   try {
//     const service: BluetoothRemoteGATTService = await server.getPrimaryService(
//       '00001896-0000-1000-8000-00805f9b34fb'
//     );
//     const characteristic: BluetoothRemoteGATTCharacteristic =
//       await service.getCharacteristic('media-player-control-point');

//     // Example: Play or Pause media
//     await characteristic.writeValue(new Uint8Array([0x01])); // 0x01 might represent a play/pause toggle
//   } catch (error) {
//     console.error('Error controlling media:', error);
//   }
// }

// // Event listener for the connect button
// document
//   .querySelector<HTMLButtonElement>('#connectButton')
//   ?.addEventListener('click', connectToBluetoothDevice);

// function handleDeviceDisconnection(device: BluetoothDevice): void {
//   device.addEventListener('gattserverdisconnected', () => {
//     console.log('Device disconnected');
//     // Optionally, you can attempt to reconnect or notify the user
//   });
// }
