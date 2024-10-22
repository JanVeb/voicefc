declare module 'opus-recorder' {
    // Declare the RecorderConfig interface based on the options available in the library
    export interface RecorderConfig {
      encoderPath: string;
      encoderBitRate?: number;
      encoderSampleRate?: number;
      numberOfChannels?: number;
      maxFramesPerPage?: number;
      streamPages?: boolean;
      wavBitDepth?: number;
      sourceNode?: AudioNode;
      monitorGain?: number;
      mediaTrackConstraints?: MediaTrackConstraints;
    }
  
    export default class Recorder {
      constructor(config: RecorderConfig);
  
      start(): void;
      stop(): void;
      ondataavailable?: (data: ArrayBuffer) => void;
      onstop?: () => void;
    }
  }
  