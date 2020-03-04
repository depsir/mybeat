var audioContext = null;
var current16thNote;        // What note is currently last scheduled?
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
var nextNoteTime = 0.0;     // when the next note is due.
var noteLength = 0.05;      // length of "beep" (in seconds)
var notesInQueue = [];      // the notes that have been put into the web audio,
let currentNote

const config = {
  tempo: 60,
  noteResolution: 1,
  incrementEnabled: false,
  incrementMode: "beat",
  incrementPeriod: 16,
  incrementDelta:4,
  incrementDirection: 1
}

export function configure(c){
  Object.keys(c).forEach(k => config[k] = c[k])
}

export function incrementBpm(delta){
  config.tempo = Math.max(config.tempo + delta, 0);
  return getCurrentTempo()
}

export function scheduleNote( beatNumber, time, noteResolution ) {

  if ( (noteResolution===1) && (beatNumber%2))
    return; // we're not playing non-8th 16th notes
  if ( (noteResolution===2) && (beatNumber%4))
    return; // we're not playing non-quarter 8th notes

  // create an oscillator
  const osc = audioContext.createOscillator();
  osc.connect( audioContext.destination );
  if (beatNumber % 16 === 0)    // beat 0 == high pitch
    osc.frequency.value = 880.0;
  else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
    osc.frequency.value = 440.0;
  else                        // other 16th notes = low pitch
    osc.frequency.value = 220.0;

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
  nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time


  current16thNote++;    // Advance the beat number, wrap to zero
  currentNote++
  if (current16thNote === 16) {
    current16thNote = 0;
  }
}

function incrementTempo(){
  if (config.incrementEnabled && config.incrementMode === "beat"){
    if (currentNote > 0 && currentNote % config.incrementPeriod === 0){
      incrementBpm(config.incrementDirection * config.incrementDelta)
    }
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
    scheduleNote( current16thNote, nextNoteTime, config.noteResolution, config.tempo, currentNote);
    nextNote(config.tempo);
  }
}


// call this to initialize the metronome
export function play() {
  notesInQueue = []
  currentNote = 0
  current16thNote = 0;
  nextNoteTime = audioContext.currentTime;
}

// call this as soon as
export function init(c){
  audioContext = new AudioContext();
  configure(c)
}


