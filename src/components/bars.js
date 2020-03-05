import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/styles"

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
  }
}))

const Bars = ({numberOfBars, started, getCurrentBar}) => {
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
    {bars.map((b, i) => <div key={i} className={classes.bar + " " +  (started && currentBar === i ? classes.current : "")}/>)}
  </div>
}

export default Bars