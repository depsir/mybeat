export const INCREMENT = {
  BEAT: 'beat',
  TIME: 'time'
}

export const INCREMENT_UNIT = {
  PERCENT: 'percent',
  BPM: 'bpm'
}

export const BEAT_MODES = {
  CLICK: {mode: "CLICK", url: "/click.mp3", volume: 1},
  HIGH: {mode: "HIGH", frequency: 880, volume: 1},
  MIDDLE: {mode: "MIDDLE", frequency: 660, volume: 1},
  LOW: {mode: "LOW", frequency: 440, volume: 1},
  MUTE: {mode: "MUTE", frequency: 440, volume: 0},
}
