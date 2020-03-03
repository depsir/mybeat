import React, { useEffect, useReducer } from "react"
import { getCurrentBar, init, play, scheduleNextClicks } from "../lib/clicker"
import { GlobalHotKeys } from "react-hotkeys"
import Bars from "./bars"
import Stopwatch from "./stopwatch"
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline"
import Stop from "@material-ui/icons/Stop"
import DoubleArrow from "@material-ui/icons/DoubleArrow"
import ChevronRight from "@material-ui/icons/ChevronRight"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import AutoIncrement from "./autoIncrement"

const currentBar = () => {
  return Math.floor(getCurrentBar() / 4);    // for res  = 2
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
  const [{bpm}, varyBpm] = useReducer((state, action) => {
    const nextBpm = state.bpm + action;
    return ({ ...state, bpm: Math.max(0, nextBpm) })
  },{bpm: 60})
  const [time, setTime] = useReducer(timeReducer, {})

  const noteResolution = 2; // 0 == 16th, 1 == 8th, 2 == quarter note

  useEffect(() => {
    init()
  }, [])

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
    UP_FIVE: () => varyBpm(5-bpm%5),
    DOWN_FIVE: () => varyBpm(- (bpm%5 || 5)),
    INCREASE: () => varyBpm(1),
    DECREASE: () => varyBpm(-1),
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

    { started ? <Stop onClick={handlers.START} /> : <PlayCircleOutline onClick={handlers.START} />}

    <div style={{marginBottom: "5px", display: "flex", alignItems:"center"}}>
      <DoubleArrow style={{transform: "rotate(180deg)"}} onClick={handlers.DOWN_FIVE} />
      <ChevronLeft onClick={handlers.DECREASE} />
      <span style={{margin: "0 5px"}}>{bpm}</span>
      <ChevronRight onClick={handlers.INCREASE} />
      <DoubleArrow onClick={handlers.UP_FIVE} />
    </div>


    <AutoIncrement started={started} varyBpm={varyBpm}/>
    <Stopwatch started={started} startTime={time.start}/>
    <Stopwatch started={started} showWhenStopped={false} startTime={started ? time.start : 0} elapsed={time.elapsed}/>
    <button onClick={() => setTime({type:"RESET"})}>reset</button>
  </div>
}

export default Metronome