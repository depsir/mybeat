import React from "react"
import { INCREMENT, INCREMENT_UNIT } from "../lib/domain"
import Row from "./row"
import Grow from "@material-ui/icons/TrendingUp"
import Lower from "@material-ui/icons/TrendingDown"
import TimeMode from "@material-ui/icons/HourglassEmpty"
import BeatMode from "@material-ui/icons/MusicNote"
import Col from "./col"
import { Input } from '@material-ui/core';
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  numberInput: {
    width: '35px'
  },
  spaced: {
    '& span':{
      margin: "0 5px"
    },
    '& div':{
      margin: "0 5px"
    }
  }
})

const IncrementSelector = (props) => {
  const { delta, period, direction, mode, unit } = props.auto
  const setDelta = s => s > 0 && props.setAuto({...props.auto, delta: s})
  const setUnit = s => props.setAuto({...props.auto, unit: s})
  const setPeriod = s => s > 0 && props.setAuto({...props.auto, period: s})
  const setDirection = s => props.setAuto({...props.auto, direction: s})
  const setMode = s => props.setAuto({ ...props.auto, mode: s })
  const classes = useStyles()

  return <Col>
    <div style={{minWidth:"230px", textAlign: "center"}}>{`${direction > 0 ? "Increase" : 'Decrease'} ${delta} ${unit} after ${period} ${mode === INCREMENT.TIME ? "seconds" : "measures"}`}</div>
    <Row className={classes.spaced}>
      {direction > 0 ? <Grow color="primary" onClick={() => setDirection(-1)}/> : <Lower color="primary" onClick={() => setDirection(1)}/>}
      <Input className={classes.numberInput} value={delta} onChange={e => setDelta(parseInt(e.target.value, 10))} type={"number"}/>
      {unit === INCREMENT_UNIT.BPM ? <span onClick={()=>setUnit(INCREMENT_UNIT.PERCENT)}>b</span>:<span onClick={()=>setUnit(INCREMENT_UNIT.BPM)}>%</span>}
      <span>after</span>
      <Input className={classes.numberInput} value={period} onChange={e => setPeriod(parseInt(e.target.value))} type={"number"}/>
      {mode === INCREMENT.TIME ? <TimeMode color="primary" onClick={() => setMode(INCREMENT.BEAT)}/> : <BeatMode color="primary" onClick={() => setMode(INCREMENT.TIME)}/>}
    </Row>
  </Col>
}

export default IncrementSelector