import React, { useEffect, useState } from "react"
import {format, parseISO} from 'date-fns'

const Stopwatch = ({started, startTime, elapsed=0, showWhenStopped = true}) => {
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if(started) {
      setTimer(((new Date()).getTime() - startTime) || 0)
      const interval = setInterval(() => {
        setTimer(((new Date()).getTime() - startTime) || 0)
      }, 100)
      return () => {
        clearInterval(interval)
      }
    }
  }, [started, startTime])

  const millis = Math.round(((started || showWhenStopped ? timer : 0) + elapsed) / 100) * 100

  const date = parseISO(new Date(millis).toISOString().replace("Z", ""))
  return <div>{format(date, "H:mm:ss.S")}</div>
}

export default Stopwatch