import React, { useState } from "react"
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { GlobalHotKeys } from "react-hotkeys"

const averageWidth = 2

const TapTempo = ({onChange}) => {
  const [taps, setTaps] = useState([]);

  const tap = () => {
    setTaps(t => {
      const lastTempoTimes = [...t.slice(Math.max(0, t.length - averageWidth)), new Date().getTime()]
      if (lastTempoTimes.length === averageWidth + 1){
        // calculate average and call callback
        const sumOfDifferences = lastTempoTimes
          .map((t, i, a) => i < a.length-1 ? a[i+1] - t : 0)
          .reduce((a,b) => a+b)
        const average = sumOfDifferences / (lastTempoTimes.length-1)
        const bpm = Math.round(60000 / average)
        onChange(bpm)
      }
      return lastTempoTimes
    })
  }
  const keyMap = {
    TAP: "t"
  }
  const handlers = {
    TAP: tap
  }

  return <>
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={handlers}
    />

    <TouchAppIcon onClick={tap}/>
    </>
}

export default TapTempo