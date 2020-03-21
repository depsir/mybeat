import React, { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"

const getElapsed = startTime => (new Date()).getTime() - startTime || 0

const Stopwatch = ({started, startTime, elapsed=0}) => {
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if(started) {
      setTimer(getElapsed( startTime))
      const interval = setInterval(() => {
        setTimer(getElapsed( startTime))
      }, 100)
      return () => {
        clearInterval(interval)
      }
    }
  }, [started, startTime])


  const currentTimer = !elapsed || started ? timer : 0;

  const millis = Math.round((currentTimer + elapsed) / 100) * 100

  const date = parseISO(new Date(millis).toISOString().replace("Z", ""))
  return <div>{format(date, "H:mm:ss.S")}</div>
}

export default Stopwatch
