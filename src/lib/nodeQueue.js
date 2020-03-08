import {audioContext} from "./audioContext"

let notesInQueue = [];

function reset() {
  notesInQueue = [];
}

function push(n){
  notesInQueue.push(n)
}

export function getNextNoteTempo(){
  const currentNote = getNextNote();
  if (currentNote){
    return currentNote.tempo
  }
  return undefined;
}

export function getNextNote(){
  const number = getCurrentNoteIndex()+1
  return notesInQueue[Math.min(number, notesInQueue.length-1)]
}

export function getCurrentNote() {
  return notesInQueue[getCurrentNoteIndex()]
}

export function getCurrentAndNext(){
  const currentNoteIndex = getCurrentNoteIndex()
  const res = {}
  res.current = notesInQueue[currentNoteIndex]
  if (currentNoteIndex < notesInQueue.length){
    res.next = notesInQueue[currentNoteIndex+1]
  }
  return res
}

function getCurrentNoteIndex(){
  // todo: at some point should cleanup the queue, otherwise it will grow indefinitely
  let l = notesInQueue.length
  while (l--) {
    if (notesInQueue[l].time <= audioContext.currentTime) {
      return l;
    }
  }

}

export function getCurrentBar(){
  const currentNote = getCurrentNote()
  if (currentNote) {
    return currentNote.note
  }
  return undefined
}

export const queue = {
  reset,
  push
}