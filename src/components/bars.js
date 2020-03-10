import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/styles"
import { BEAT_MODES } from "../lib/domain"

const styles = makeStyles(theme => ({
  bar: {
    width: '30px',
    height: '10px',
    border: '1px solid black',
    margin: '1px 5px',
  },
  current: {
    borderColor: theme.palette.secondary.main,
    borderWidth: "2px",
    margin: "0px 4px"
  },
  [BEAT_MODES.LOW.mode]: {
    backgroundColor: "hsl(99, 40%, 40%)"
  },
  [BEAT_MODES.MIDDLE.mode]: {
    backgroundColor: "hsl(99, 60%, 60%)"
  },
  [BEAT_MODES.HIGH.mode]: {
    backgroundColor: "hsl(99, 90%, 90%)"
  },
  [BEAT_MODES.MUTE.mode]: {
    backgroundColor: "hsl(99, 0%, 20%)"
  }
}))

const Bars = ({numberOfBars, started, getCurrentBar, onClick, beats}) => {
  const classes = styles();
  const bars = Array(numberOfBars).fill(0)
  const [currentBar, setCurrentBar] = useState(0)

  useEffect(() => {
    if (started){
      const interval = setInterval(() => {
        setCurrentBar(getCurrentBar())
      }, 50)
      return () => clearInterval(interval)
    }
    setCurrentBar(0)
  }, [numberOfBars, started, getCurrentBar])


  return <div style={{display: 'flex'}}>
    {bars.map((b, i) => <div onClick={() => onClick(i)} key={i} className={classes.bar + " " + classes[beats[i].mode] + " " +  (started && currentBar === i ? classes.current : "")}/>)}
  </div>
}

export default Bars