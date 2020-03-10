import React, { useEffect, useState } from "react"
import { getCurrentAndNext } from "../lib/nodeQueue"
import { getConfig } from "../lib/scheduler"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  bpm: {
    fontSize: "60px",
    backgroundColor: props => props.aboutToChange ? "hsla(219,100%,50%,0.45)" : "inherit",
    margin: "0 5px",
    padding: "5px",
    textAlign: "center",
  }
})

const CurrentBpm = ({started, onChange}) => {
  const [bpm, setBpm] =  useState(60);
  const [aboutToChange, setAboutToChange] = useState(false)

  const classes = useStyles({aboutToChange})

  useEffect(() => {
    const senseBpm = () => {
      const {current, next} = getCurrentAndNext()
      if (next){
        setAboutToChange((current.tempo) !== (next.tempo))
      }

      const tempo = next && next.tempo || getConfig().tempo
      setBpm(tempo)
      if (tempo !== bpm) {
        onChange(tempo)
      }
    }
      senseBpm()
      const interval = setInterval( senseBpm, 100)
      return () => clearInterval(interval)
  }, [started, bpm])

  return <span className={classes.bpm} >{bpm}</span>

}

export default CurrentBpm