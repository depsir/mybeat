import { audioContext } from "./audioContext"

const soundCache = {}

export const fetchSoundBuffer = soundUrl => {
  if (!soundCache[soundUrl]) {
    console.log("sound was not in cache, fetching")
    soundCache[soundUrl] = fetch(soundUrl, { "mode": "no-cors" })
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  }
  return soundCache[soundUrl]
}


const createSoundFromBuffer = async (soundUrl) => {
  const buffer = await fetchSoundBuffer(soundUrl)
  var source = audioContext.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  return source
}

export async function getSound(beat) {
  console.log(beat)
  if (beat.frequency) {
    const osc = audioContext.createOscillator();
    osc.frequency.value = beat.frequency;
    return Promise.resolve(osc)
  }
  if (beat.url) {
    return await createSoundFromBuffer(beat.url)
  }
}
