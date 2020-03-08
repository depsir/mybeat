import React, { useEffect, useState } from "react"
import { getNextNoteTempo } from "../lib/nodeQueue"
import { getConfig } from "../lib/scheduler"

const CurrentBpm = ({started}) => {
  const [bpm, setBpm] =  useState(60);

  useEffect(() => {
      setBpm(getNextNoteTempo() || getConfig().tempo)
      const interval = setInterval( () => setBpm(started ? getNextNoteTempo() || getConfig().tempo : getConfig().tempo), 100)
      return () => clearInterval(interval)
  }, [started, bpm])

  return <span style={{margin: "0 5px"}}>{bpm}</span>

}

export default CurrentBpm