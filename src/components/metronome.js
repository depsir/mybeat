import React, { useState, useEffect, useReducer } from "react"
import { init, play, scheduler } from "../lib/clicker"
import { GlobalHotKeys } from "react-hotkeys"

const increase = (bpm=1) => ({
  type: "INCREASE",
  value: bpm
})
const decrease= (bpm=1) => ({
  type: "DECREASE",
  value: bpm
})
const Metronome = () => {
  const [started, setStarted] = useState(false)
  const [autoIncrement, setAutoIncrement] = useState(false)
  const [bpm, setBpm] = useReducer((state, action) => action.type === "INCREASE" ? state + action.value : state - action.value,60)


  useEffect(() => {
    init()
  }, [])


  useEffect(() => {
    if (autoIncrement) {
      let interval = setInterval(() => {
        setBpm(increase(2))
      }, 15 * 1000)
      return () => clearInterval(interval)
    }
  }, [autoIncrement])

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
  const handlers = {INCREASE: () => setBpm(increase()), DECREASE: () => setBpm(decrease())}


  return <div style={{display: 'flex', flexDirection:"column", alignItems: "center"}}>
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={handlers}
    />
    <h3>My Beats</h3>

    <div style={{marginBottom: "5px"}}>
      <button onClick={() => setBpm(increase())}>+</button>
      <span style={{margin: "0 5px"}}>{bpm}</span>
      <button onClick={() => setBpm(decrease())}>-</button>
    </div>

    <button onClick={() => doStart(!started)}>{started ? "stop" : "start"}</button>
    <button onClick={() => setAutoIncrement(!autoIncrement)}>{"autoIncrement"}</button>
  </div>
}

export default Metronome