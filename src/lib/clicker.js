import { INCREMENT, INCREMENT_UNIT } from "./domain"

let audioContext = null
let current16thNote         // What note is currently last scheduled?
let scheduleAheadTime = 0.1    // How far ahead to schedule audio (sec)
let nextNoteTime = 0.0;     // when the next note is due.
let noteLength = 0.05;      // length of "beep" (in seconds)
let notesInQueue = [];      // the notes that have been put into the web audio,
let currentNote

const config = {
  tempo: 60,
  beatsPerMeasure: 4,
  beats: [{frequency: 440}],
  incrementEnabled: false,
  increment: [{
    mode: INCREMENT.BEAT,
    period: 16,
    delta:4,
    direction: 1,
    unit: INCREMENT_UNIT.BPM
  }],
  lastIncrementTime: 0,
  lastIncrementBeat: 0,
  lastIncrementConfigIndex: 0
}

export function configure(c){
  Object.keys(c).forEach(k => config[k] = c[k])
}

export function incrementBpm(delta, round=true){
  const tempo = Math.max(config.tempo + delta, 0)
  const factor = round ? 1 : 10;

  config.tempo = Math.round(tempo*factor)/factor;
  return getCurrentTempo()
}

export function scheduleNote( beatNumber, time) {

  const beat = config.beats[beatNumber % config.beatsPerMeasure]

  // create an oscillator
    const osc = audioContext.createOscillator();
  osc.connect( audioContext.destination );
  osc.frequency.value = beat.frequency;

  osc.start( time );
  osc.stop( time + noteLength );
}

export function getCurrentTempo(){
  const currentNote = getCurrentNote();
  if (currentNote){
    return currentNote.tempo
  }
  return config.tempo;
}

export function getCurrentNote() {
  let l = notesInQueue.length
  while (l--) {
    if (notesInQueue[l].time <= audioContext.currentTime) {
      return notesInQueue[l]
    }
  }
}

export function getCurrentBar(){
  // todo: at some point should cleanup the queue, otherwise it will grow indefinitely
  return getCurrentNote().note
}

export function nextNote(tempo) {
  // Advance current note and time by a 16th note...
  const secondsPerBeat = 60.0 / (tempo );    // Notice this picks up the CURRENT
                                        // tempo value to calculate beat length.
  nextNoteTime += secondsPerBeat;    // Add beat length to last beat time


  current16thNote++;    // Advance the beat number, wrap to zero
  currentNote++
  if (current16thNote === 4) {
    current16thNote = 0;
  }
}

function incrementTempo(){
  if (!config.incrementEnabled) return
  
  const incrementConfig = config.increment[config.lastIncrementConfigIndex]

  const isPercent = incrementConfig.unit === INCREMENT_UNIT.PERCENT
  const factor = isPercent ? config.tempo/100  : 1
  const delta = incrementConfig.direction * factor * incrementConfig.delta

  let shouldIncrement = false;

  if (incrementConfig.mode === INCREMENT.BEAT) {
    const period = incrementConfig.period * 4 * config.beatsPerMeasure;
    if (currentNote > 0 && (currentNote - config.lastIncrementBeat) % period === 0) {
      shouldIncrement = true;
    }
  }

  if (incrementConfig.mode === INCREMENT.TIME) {
    console.log(nextNoteTime, config.lastIncrementTime, incrementConfig.period)
    if (nextNoteTime >= config.lastIncrementTime + incrementConfig.period) {
      shouldIncrement = true;
    }
  }

  if (shouldIncrement){
    config.lastIncrementTime = nextNoteTime;
    config.lastIncrementBeat = currentNote
    incrementBpm(delta, !isPercent)
    config.lastIncrementConfigIndex = (config.lastIncrementConfigIndex + 1) % config.increment.length
  }
}

// call this periodically to schedule notes
export function scheduleNextClicks() {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    incrementTempo()
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: current16thNote, time: nextNoteTime, tempo: config.tempo, currentNote } );
    scheduleNote( current16thNote, nextNoteTime, config.tempo, currentNote);
    nextNote(config.tempo);
  }
}

// call this to initialize the metronome
export function play() {
  notesInQueue = []
  currentNote = 0
  current16thNote = 0;
  nextNoteTime = audioContext.currentTime;
  config.lastIncrementTime = audioContext.currentTime;
  config.lastIncrementConfigIndex = 0
  config.lastIncrementBeat = 0
}

// call this as soon as
export function init(c){
  audioContext = new AudioContext();
  configure(c)
}


