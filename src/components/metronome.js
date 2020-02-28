import React, { useState, useEffect, useReducer } from "react"
import { init, play, scheduler } from "../lib/clicker"
import { GlobalHotKeys } from "react-hotkeys"

const Metronome = () => {
  const [started, setStarted] = useState(false)
  const [bpm, setBpm] = useReducer((state, action) => action === "INCREASE" ? state + 1 : state -1,60)


  useEffect(() => {
    init()
  }, [])


  useEffect(() => {
    if (started) {
      scheduler(bpm)
      let interval = setInterval(() => {
        scheduler(bpm)
      }, 60 * 1000 / bpm / 10)
      return () => clearInterval(interval)
    }
  }, [started, bpm])

  const doStart = (v) => {
    play()
    setStarted(v)
  }
  const keyMap = { INCREASE: ["+", "shift++"], DECREASE: "-"}
  const handlers = {INCREASE: () => setBpm("INCREASE"), DECREASE: () => setBpm("DECREASE")}


  return <div>
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={handlers}
    />

    current bpm: {bpm}
    <button onClick={() => setBpm("INCREASE")}>+</button>
    <button onClick={() => setBpm("DECREASE")}>-</button>
    <button onClick={() => doStart(!started)}>{started ? "stop" : "start"}</button>
  </div>
}

export default Metronome