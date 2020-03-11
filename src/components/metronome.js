import React, { useEffect, useReducer, useState } from "react"
import { configure, incrementBpm, init, play, scheduleNextClicks } from "../lib/scheduler"
import { GlobalHotKeys } from "react-hotkeys"
import Bars from "./bars"
import Stopwatch from "./stopwatch"
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline"
import Stop from "@material-ui/icons/Stop"
import DoubleArrow from "@material-ui/icons/DoubleArrow"
import ChevronRight from "@material-ui/icons/ChevronRight"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import AutoIncrement from "./autoIncrement"
import { getCurrentBar } from "../lib/nodeQueue"
import CurrentBpm from "./currentBpm"
import { get, set } from 'idb-keyval';
import { BEAT_MODES } from "../lib/domain"

const currentBar = () => {
  return Math.floor(getCurrentBar());    // for res  = 2
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
  const [time, setTime] = useReducer(timeReducer, {})
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)
  const [beats, setBeats] = useState([BEAT_MODES.HIGH, BEAT_MODES.LOW, BEAT_MODES.LOW, BEAT_MODES.LOW ])


  useEffect(() => {
    init({ beatsPerMeasure, beats})
  }, [beats, beatsPerMeasure])

  useEffect(() => {
    if (started) {
      scheduleNextClicks()
      const interval = setInterval(scheduleNextClicks, 20)
      return () => clearInterval(interval)
    }
  }, [started])


  useEffect(() => {
    async function f() {
      const bpm = await get("bpm")
      if (bpm){
        configure({tempo: bpm})
      }
    }
    f()
  }, [])

  const onChangeTempo = (bpm) => {
    set("bpm", bpm)
  }

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
    UP_FIVE: () => incrementBpm(1, true, 5),
    DOWN_FIVE: () => incrementBpm(-1, true, 5),
    INCREASE: () => incrementBpm(1),
    DECREASE: () => incrementBpm(-1),
    START: () => { doStart(!started) }
  }

  const mapConfigure = ({ enabled, auto}) => {
    configure({
      incrementEnabled: enabled,
      increment: auto
    })
  }
  const onBeatClick = (beatNumber) => {
    const beatMode = beats[beatNumber].mode
    const modes = Object.keys(BEAT_MODES)
    const nextBeatMode = modes[(modes.indexOf(beatMode) + 1) % modes.length]
    const nextBeats = [...beats]
    
    nextBeats.splice(beatNumber, 1, BEAT_MODES[nextBeatMode])
    setBeats(nextBeats);
  }

  return <div style={{display: 'flex', flexDirection:"column", alignItems: "center"}}>
    <GlobalHotKeys
      allowChanges
      keyMap={keyMap}
      handlers={handlers}
    />
    <h3>My Beat</h3>
    <Bars onClick={onBeatClick} beats={beats} numberOfBars={beatsPerMeasure} started={started} getCurrentBar={currentBar}/>

    { started ? <Stop onClick={handlers.START} /> : <PlayCircleOutline onClick={handlers.START} />}

    <div style={{marginBottom: "5px", display: "flex", alignItems:"center"}}>
      <DoubleArrow style={{transform: "rotate(180deg)"}} onClick={handlers.DOWN_FIVE} />
      <ChevronLeft onClick={handlers.DECREASE} />
      <CurrentBpm started={started} onChange={onChangeTempo}/>
      <ChevronRight onClick={handlers.INCREASE} />
      <DoubleArrow onClick={handlers.UP_FIVE} />
    </div>


    <AutoIncrement started={started} configure={mapConfigure}/>
    <Stopwatch started={started} startTime={time.start}/>
    <Stopwatch started={started} showWhenStopped={false} startTime={started ? time.start : 0} elapsed={time.elapsed}/>
    <button onClick={() => setTime({type:"RESET"})}>reset</button>
  </div>
}

export default Metronome