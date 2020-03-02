import React, { useEffect, useReducer, useState } from "react"
import { getCurrentBar, init, play, scheduleNextClicks } from "../lib/clicker"
import { GlobalHotKeys } from "react-hotkeys"
import Bars from "./bars"
import Stopwatch from "./stopwatch"

const increase = (bpm=1) => ({
  type: "INCREASE",
  value: bpm
})
const decrease= (bpm=1) => ({
  type: "DECREASE",
  value: bpm
})

const currentBar = () => {
  return Math.floor(getCurrentBar() / 4);    // for res  = 2
}

const reducer = (state, action) => {
  switch (action.type) {
    case "INCREASE": return {...state, bpm: state.bpm + action.value}
    case "DECREASE": return {...state, bpm: state.bpm - action.value}
    default: return state;
  }
}
const timeReducer = (state, action) => {
  if (action.type === "RESET"){
    return {start: state.start}
  }
  if (state.start) {
   return {elapsed: (state.elapsed||0) + (new Date()).getTime() - state.start}
  }
  return {...state, start: (new Date()).getTime()}
}

const Metronome = () => {
  const [started, setStarted] = useReducer((state) => !state, false)
  const [autoIncrement, setAutoIncrement] = useState(false)
  const [{bpm}, setBpm] = useReducer(reducer,{bpm: 60})
  const [time, setTime] = useReducer(timeReducer, {})

  const noteResolution = 2; // 0 == 16th, 1 == 8th, 2 == quarter note

  useEffect(() => {
    init()
  }, [])


  useEffect(() => {
    if (autoIncrement && started) {
      const interval = setInterval(() => {
        setBpm(increase(2))
      }, 15 * 1000)
      return () => clearInterval(interval)
    }
  }, [autoIncrement, started])

  useEffect(() => {
    if (started) {
      scheduleNextClicks(bpm, noteResolution)
      let interval = setInterval(() => {
        scheduleNextClicks(bpm, noteResolution)
      }, 60 * 1000 / bpm / 10)
      return () => clearInterval(interval)
    }
  }, [started, bpm])

  const doStart = () => {
    play()
    setTime({type: !started ? "START" : "STOP"})
    setStarted()
  }

  const keyMap = {
    UP_FIVE: "down",
    DOWN_FIVE: "up",
    INCREASE: ["+", "shift++"],
    DECREASE: "-",
    START: {sequence: "space", action: "keydown"}}
  const handlers = {
    UP_FIVE: () => setBpm(increase(5-bpm%5)),
    DOWN_FIVE: () => setBpm(decrease(bpm%5 || 5)),
    INCREASE: () => setBpm(increase()),
    DECREASE: () => setBpm(decrease()),
    START: () => { doStart(!started) }
  }


  return <div style={{display: 'flex', flexDirection:"column", alignItems: "center"}}>
    <GlobalHotKeys
      allowChanges
      keyMap={keyMap}
      handlers={handlers}
    />
    <h3>My Beat</h3>
    <Bars numberOfBars={4} started={started} getCurrentBar={currentBar}/>

    <div style={{marginBottom: "5px"}}>
      <button onClick={handlers.DOWN_FIVE}>--</button>
      <button onClick={handlers.DECREASE}>-</button>
      <span style={{margin: "0 5px"}}>{bpm}</span>
      <button onClick={handlers.INCREASE}>+</button>
      <button onClick={handlers.UP_FIVE}>++</button>
    </div>

    <button onClick={handlers.START}>{started ? "stop" : "start"}</button>
    <button onClick={() => setAutoIncrement(!autoIncrement)}>{"autoIncrement"}</button>
    <Stopwatch started={started} startTime={time.start}/>
    <Stopwatch started={started} showWhenStopped={false} startTime={started ? time.start : 0} elapsed={time.elapsed}/>
    <button onClick={() => setTime({type:"RESET"})}>reset</button>
  </div>
}

export default Metronome