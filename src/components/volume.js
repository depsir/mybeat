import React, { useState } from "react"
import Slider from "@material-ui/core/Slider"
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  container: {
    display: "flex",
    width: "100%",
    maxWidth: "500px"
  },
  control: {
    flexGrow: 1
  }
})

const Volume = ({onChange}) => {
  const [volume, setVolume] = useState(1)

  const classes = useStyles();

  const updateVolume = (volume) => {
    setVolume(volume)
    onChange(volume)
  }

  return <div className={classes.container}>
      <VolumeUpIcon/>
      <Slider className={classes.control} min={0} step={0.01} max={1} onChange={(e,v) => updateVolume(v)} value={volume}/>
    </div>
}

export default Volume