export default class AudioManager {
    constructor() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);
      this.sounds = {};
      this.backgroundMusic = null;
      this.backgroundMusicPlaying = false;
      this.isMuted = false;
      this.masterVolume = 0.5; // Default volume
  
      this.masterGainNode.gain.value = this.masterVolume;
    }
  
    loadSound(name, url) {
      return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => this.audioContext.decodeAudioData(buffer))
        .then(decodedData => {
          this.sounds[name] = decodedData;
        })
        .catch(err => console.error(`Error loading sound ${name}: ${err.message}`));
    }


    initSounds() {
        const soundList = [
          { name: 'backgroundMusic', url: 'http://127.0.0.1:5501/js/Audio/background_music.mp3' },
          { name: 'deadSound', url: 'http://127.0.0.1:5501/js/Audio/dead_sound.mp3' },
          { name: 'winSound', url: 'http://127.0.0.1:5501/js/Audio/win_sound.mp3' },
          { name: 'hitSound', url: 'http://127.0.0.1:5501/js/Audio/hit_sound.mp3' },
          { name: 'shootSound', url: 'http://127.0.0.1:5501/js/Audio/shoot_sound.mp3' }
        ];
      
        const promises = soundList.map(sound => {
          return this.loadSound(sound.name, sound.url);
        });
      
        return Promise.all(promises);
      }
  
    playSound(name) {
      if (this.isMuted) return;
  
      const sound = this.sounds[name];
      if (!sound) {
        console.error(`Sound '${name}' not found.`);
        return;
      }
  
      const soundSource = this.audioContext.createBufferSource();
      soundSource.buffer = sound;
      soundSource.connect(this.masterGainNode);
      soundSource.start();
    }
  
    playBackgroundMusic(url) {
      if (this.backgroundMusicPlaying) return;
  
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => this.audioContext.decodeAudioData(buffer))
        .then(decodedData => {
          const musicSource = this.audioContext.createBufferSource();
          musicSource.buffer = decodedData;
          musicSource.loop = true;
          musicSource.connect(this.masterGainNode);
          musicSource.start();
          this.backgroundMusic = musicSource;
          this.backgroundMusicPlaying = true;
        })
        .catch(err => console.error(`Error playing background music: ${err.message}`));
    }
  
    stopBackgroundMusic() {
      if (this.backgroundMusic) {
        this.backgroundMusic.stop();
        this.backgroundMusic = null;
        this.backgroundMusicPlaying = false;
      }
    }
  
    muteAll() {
      this.isMuted = true;
      this.masterGainNode.gain.value = 0;
    }
  
    unmuteAll() {
      this.isMuted = false;
      this.masterGainNode.gain.value = this.masterVolume;
    }
  
    setVolume(volume) {
      if (volume < 0 || volume > 1) return; // Ensure volume is between 0 and 1
      this.masterVolume = volume;
      if (!this.isMuted) {
        this.masterGainNode.gain.value = volume;
      }
    }
  }
  