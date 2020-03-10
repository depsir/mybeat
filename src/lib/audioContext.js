export let audioContext = null

export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
}
