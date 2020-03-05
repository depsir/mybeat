import React, { useState } from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import { t } from "../lib/utils"
import { Switch } from "@material-ui/core"
import Row from "./row"
import AutoIncrementSettingsIcon from "@material-ui/icons/Schedule"
import BeatMode from "@material-ui/icons/MusicNote"
import TimeMode from "@material-ui/icons/HourglassEmpty"
import Grow from "@material-ui/icons/TrendingUp"
import Lower from "@material-ui/icons/TrendingDown"
import Col from "./col"
import Slider from "@material-ui/core/Slider"
import { INCREMENT } from "../lib/domain"

const AutoIncrement = ({configure}) => {
  const [autoIncrement, setAutoIncrement] = useState({enabled: false, direction: 1, step:0, period:0, mode: INCREMENT.TIME});
  const [step, setSteps] = useState(0)
  const [period, setPeriod] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const [direction, setDirection] = useState(1)
  const [open, setIncrementDialogOpen] = useState(false);
  const [mode, setMode] = useState(INCREMENT.TIME)

  function openDialog(){
    setSteps(autoIncrement.step || 0)
    setPeriod(autoIncrement.period || 0)
    setEnabled(autoIncrement.enabled)
    setDirection(autoIncrement.direction || 1)
    setMode(INCREMENT.TIME)
    setIncrementDialogOpen(true)
  }

  const handleClose = () => setIncrementDialogOpen(false)
  return <Row>
    <span>Auto increment</span>
    <Switch checked={autoIncrement.enabled}
            onChange={(e) => {
              setAutoIncrement({ ...autoIncrement, enabled: e.target.checked })
              configure({step:t(autoIncrement.step), period:t(autoIncrement.period), direction:autoIncrement.direction, mode:autoIncrement.mode, enabled: e.target.checked })

            }}/>
    <AutoIncrementSettingsIcon onClick={openDialog}/>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
          <span>Auto Increment</span>
          <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)}/>
      </DialogTitle>
      <DialogContent>
        <Col>
          <div style={{minWidth:"230px", textAlign: "center"}}>{`${direction > 0 ? "Increase" : 'Decrease'} ${t(step)} bpm every ${t(period)} ${mode === INCREMENT.TIME ? "seconds" : "beats"}`}</div>
          <Row>
            {direction > 0 ? <Grow color="primary" onClick={() => setDirection(-1)}/> : <Lower color="primary" onClick={() => setDirection(1)}/>}
            {mode === INCREMENT.TIME ? <TimeMode color="primary" onClick={() => setMode(INCREMENT.BEAT)}/> : <BeatMode color="primary" onClick={() => setMode(INCREMENT.TIME)}/>}
          </Row>
          <Slider value={step} min={0} max={25} onChange={(e, v) => setSteps(v)}/>
          <Slider type="range" value={period} min={0} max={25} onChange={(e, v) => setPeriod(v)}/>
        </Col>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => {
          setIncrementDialogOpen(false)
          setAutoIncrement({step, enabled, period, direction, mode})
          configure({step:t(step), enabled, period:t(period), direction, mode})
        }}>Ok</Button>
      </DialogActions>

    </Dialog>
  </Row>
}

export default AutoIncrement