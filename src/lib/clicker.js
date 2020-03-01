var audioContext = null;
var current16thNote;        // What note is currently last scheduled?
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
var nextNoteTime = 0.0;     // when the next note is due.
var noteLength = 0.05;      // length of "beep" (in seconds)
var notesInQueue = [];      // the notes that have been put into the web audio,

export function scheduleNote( beatNumber, time, noteResolution ) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push( { note: beatNumber, time: time } );

  if ( (noteResolution===1) && (beatNumber%2))
    return; // we're not playing non-8th 16th notes
  if ( (noteResolution===2) && (beatNumber%4))
    return; // we're not playing non-quarter 8th notes

  // create an oscillator
  var osc = audioContext.createOscillator();
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

export function getCurrentBar(){
  // todo: at some point should cleanup the queue, otherwise it will grow indefinitely
  let l = notesInQueue.length;
  while (l--) {
    if (notesInQueue[l].time <= audioContext.currentTime) {
      return notesInQueue[l].note;
    }
  }
}

export function nextNote(tempo) {
  // Advance current note and time by a 16th note...
  var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
                                        // tempo value to calculate beat length.
  nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time


  current16thNote++;    // Advance the beat number, wrap to zero
  if (current16thNote === 16) {
    current16thNote = 0;
  }
}

// call this periodically to schedule notes
export function scheduleNextClicks(tempo, noteResolution) {
  console.log(`scheduling at ${tempo} bpm`)

  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    scheduleNote( current16thNote, nextNoteTime, noteResolution );
    nextNote(tempo);
    console.log(nextNoteTime)
  }
}


// call this to start and stop metronome
export function play() {
  // if (!unlocked) {
  //   play silent buffer to unlock the audio
  //   var buffer = audioContext.createBuffer(1, 1, 22050);
  //   var node = audioContext.createBufferSource();
  //   node.buffer = buffer;
  //   node.start(0);
  //   unlocked = true;
  // }

  // isPlaying = !isPlaying;

  // if (isPlaying) { // start playing
    current16thNote = 0;
    nextNoteTime = audioContext.currentTime;
    // timerWorker.postMessage("start");
    // return "stop";
  // } else {
    // timerWorker.postMessage("stop");
    // return "play";
  // }
}

// call this as soon as
export function init(){

  // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
  // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
  // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
  // spec-compliant, and work on Chrome, Safari and Firefox.
  audioContext = new AudioContext();
}


