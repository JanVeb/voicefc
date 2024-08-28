// src/comp/recordAudio.ts
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioBlob: Blob | null = null;

  public startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
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
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          resolve(this.audioBlob);
        };
        this.mediaRecorder.stop();
      }
    });
  }

  public getAudioBlob(): Blob | null {
    return this.audioBlob;
  }
}
