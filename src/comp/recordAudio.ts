// src/comp/recordAudio.ts
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioBlob: Blob | null = null;

  public startRecording() {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000, // Set sample rate to 16 kHz
          channelCount: 1 // Mono audio
        }
      })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm; codecs=opus', // Use WebM with Opus codec
          audioBitsPerSecond: 128000 // Set bit rate to 128 kbps
        });
        this.audioChunks = []; // Clear previous audio chunks
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  }

  public stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          // Combine audio chunks into a single Blob
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

          // Play the recorded audio
          this.playAudioBlob(this.audioBlob);

          resolve(this.audioBlob);
        };
        this.mediaRecorder.stop();
      }
    });
  }

  // Method to play the audio blob
  private playAudioBlob(blob: Blob): void {
    const sizeInKB = (blob.size / 1024).toFixed(2); // Convert bytes to KB and format to 2 decimal places
    console.log(`Audio Blob Size: ${sizeInKB} KB`);
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  }

  public getAudioBlob(): Blob | null {
    return this.audioBlob;
  }
}



// opus records in opus format, whisper doesnt suport opus format, need to convert to mp3, issues with ffmpeg while trying that
// import Recorder, { RecorderConfig } from "opus-recorder";
// import encoderPath from "opus-recorder/dist/encoderWorker.min.js?url";



// export class AudioRecorder {
//   private recorder: Recorder | null = null;
//   private recordedChunks: ArrayBuffer[] = [];
//   private audioBlob: Blob | null = null;

//   constructor() {
//     // Initialize the recorder with the specified configuration
//     const config: RecorderConfig = {
//       encoderPath,
//       encoderBitRate: 64000, // Higher bit rate for better audio quality
//       encoderSampleRate: 48000, // Higher sample rate for more detailed sound
//       numberOfChannels: 2, // Stereo recording
//       maxFramesPerPage: 10, // Optional: Reduce latency in dispatching data
//     };
    
//     this.recorder = new Recorder(config);
//   }

//   public startRecording(): void {
//     if (this.recorder) {
//       this.recordedChunks = []; // Clear previous audio chunks
//       this.recorder.ondataavailable = (arrayBuffer: ArrayBuffer) => {
//         this.recordedChunks.push(arrayBuffer);
//       };
//       this.recorder.start();
//     } else {
//       console.error("Recorder not initialized");
//     }
//   }
//   public stopRecording(): Promise<Blob> {
//     return new Promise((resolve) => {
//       if (this.recorder) {
//         this.recorder.onstop = () => {
//           // Combine all recorded chunks into one ArrayBuffer
//           const combinedBuffer = this.combineArrayBuffers(this.recordedChunks);
//           this.audioBlob = new Blob([combinedBuffer], { type: "audio/opus" });
  
//           // Log the audio format
//           console.log(`Audio Blob Format: ${this.audioBlob.type}`); // Logs the MIME type
          
//           // Play the audio once it's ready
//           this.playAudioBlob(this.audioBlob);
          
//           resolve(this.audioBlob);
//         };
//         this.recorder.stop();
//       }
//     });
//   }
  
// // Method to play the audio blob and log its size in MB
// private playAudioBlob(blob: Blob): void {
//   const sizeInKB = (blob.size / 1024).toFixed(2); // Convert bytes to KB and format to 2 decimal places
//   console.log(`Audio Blob Size: ${sizeInKB} KB`);
  
//   const audioUrl = URL.createObjectURL(blob);
//   const audio = new Audio(audioUrl);

//   // Play the audio
//   audio.play().catch((error) => {
//     console.error("Error playing audio:", error);
//   });
// }


//   public getAudioBlob(): Blob | null {
//     return this.audioBlob;
//   }

//   // Helper function to combine multiple ArrayBuffers into one
//   private combineArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
//     const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
//     const combinedBuffer = new Uint8Array(totalLength);
//     let offset = 0;

//     buffers.forEach((buffer) => {
//       combinedBuffer.set(new Uint8Array(buffer), offset);
//       offset += buffer.byteLength;
//     });

//     return combinedBuffer.buffer;
//   }
// }
