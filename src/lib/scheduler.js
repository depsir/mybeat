import { INCREMENT, INCREMENT_UNIT } from "./domain"
import { queue } from "./nodeQueue"
import { audioContext, initAudioContext } from "./audioContext"

let current16thNote         // What note is currently last scheduled?
let scheduleAheadTime = 0.1    // How far ahead to schedule audio (sec)
let nextNoteTime = 0.0;     // when the next note is due.
let noteLength = 0.05;      // length of "beep" (in seconds)
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

export function getConfig(){
  return config;
}

export function configure(c){
  Object.keys(c).forEach(k => config[k] = c[k])
}

export function incrementBpm(delta, round=true, other){
  const tempo = Math.max(config.tempo + delta, 0)
  const factor = round ? 1 : 10;

  const tempo1 = Math.round(tempo*factor)/factor
  const roundFun = delta > 0 ? Math.ceil : Math.floor;
  const rounded = other ? roundFun(tempo1/other)*other : tempo1;

  config.tempo = rounded;
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
    queue.push( { note: current16thNote, time: nextNoteTime, tempo: config.tempo, currentNote } );
    scheduleNote( current16thNote, nextNoteTime, config.tempo, currentNote);
    nextNote(config.tempo);
  }
}

// call this to initialize the metronome
export function play() {
  queue.reset();
  currentNote = 0
  current16thNote = 0;
  nextNoteTime = audioContext.currentTime;
  config.lastIncrementTime = audioContext.currentTime;
  config.lastIncrementConfigIndex = 0
  config.lastIncrementBeat = 0
}

// call this as soon as
export function init(c){
  initAudioContext()
  configure(c)
}


