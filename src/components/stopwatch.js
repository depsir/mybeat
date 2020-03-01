import React, { useEffect, useState } from "react"

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

  return <div>{(Math.round(((started || showWhenStopped ? timer : 0)+elapsed)/100)/10).toFixed(1)}</div>
}

export default Stopwatch