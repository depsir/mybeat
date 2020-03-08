export let audioContext = null

export const initAudioContext = () => {
  audioContext = new AudioContext();
}
