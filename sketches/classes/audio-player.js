const DEFAULT_SETTINGS = {
  fftSize: 512,
  smoothingTimeConstant: 0.8,
};

export class AudioPlayer {
  constructor({ filename = '/assets/01.mp3', settings = DEFAULT_SETTINGS }) {
    this.filename = filename;
    this.settings = { ...DEFAULT_SETTINGS, ...settings };
    this.initialize();
  }

  initialize() {
    this.createAudioElement();
    this.context = new AudioContext();
    this.setupSourceNode();
    this.setupAnalyserNode();

    this.minDb = this.analyserNode.minDecibels;
    this.maxDb = this.analyserNode.maxDecibels;
    this.audioData = new Float32Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getFloatFrequencyData(this.audioData);
  }

  createAudioElement() {
    this.audioElement = document.createElement('audio');
    this.audioElement.src = 'audio/02.mp3';
  }

  setupSourceNode() {
    this.sourceNode = this.context.createMediaElementSource(this.audioElement);
    this.sourceNode.connect(this.context.destination);
  }

  setupAnalyserNode() {
    this.analyserNode = this.context.createAnalyser();
    this.analyserNode.fftSize = this.settings.fftSize;
    this.analyserNode.smoothingTimeConstant =
      this.settings.smoothingTimeConstant;
    this.sourceNode.connect(this.analyserNode);
  }

  play() {
    this.audioElement.play();
  }

  pause() {
    this.audioElement.pause();
  }
}
