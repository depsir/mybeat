import React, { useEffect, useState } from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import { t } from "../lib/utils"
import { Switch } from "@material-ui/core"
import Row from "./row"
import AutoIncrementSettingsIcon from "@material-ui/icons/Schedule"
import Grow from "@material-ui/icons/TrendingUp"
import Lower from "@material-ui/icons/TrendingDown"



const AutoIncrement = ({ started, varyBpm}) => {
  const [autoIncrement, setAutoIncrement] = useState({enabled: false, direction: 1, step:0, period:0});
  const [step, setSteps] = useState(autoIncrement.step || 0)
  const [period, setPeriod] = useState(autoIncrement.period || 0)
  const [enabled, setEnabled] = useState(autoIncrement.enabled)
  const [direction, setDirection] = useState(autoIncrement.direction || 1)
  const [open, setIncrementDialogOpen] = useState(false);

  useEffect(() => {
    if (autoIncrement.enabled && started) {
      const interval = setInterval(() => {
        console.log(autoIncrement.direction)
        varyBpm(autoIncrement.direction * t(autoIncrement.step))
      }, t(autoIncrement.period) * 1000)
      return () => clearInterval(interval)
    }
  }, [autoIncrement.enabled, autoIncrement.step, autoIncrement.period, autoIncrement.direction, started])

  const handleClose = () => setIncrementDialogOpen(false)
  return <Row>
    <span>auto increment</span>
    <Switch checked={autoIncrement.enabled}
            onChange={(e) => {
              setEnabled(e.target.checked)
              setAutoIncrement({ ...autoIncrement, enabled: e.target.checked })
            }}/>
    <AutoIncrementSettingsIcon onClick={() => setIncrementDialogOpen(true)}/>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Auto Increment</DialogTitle>
      <DialogContent>
        <Row>
          <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)}/>
          {direction > 0 ? <Grow onClick={() => setDirection(-1)}/> : <Lower onClick={() => setDirection(1)}/>}
          <input type="range" value={step} min="0" max="25" onChange={e => setSteps(e.target.value)}/>
          <input type="range" value={period} min="0" max="25" onChange={e => setPeriod(e.target.value)}/>
        </Row>
        <div>{`${direction > 0 ? "Increase" : 'Decrease'} ${t(step)} bpm every ${t(period)} seconds`}</div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => {
          setIncrementDialogOpen(false)
          setAutoIncrement({step, enabled, period, direction})
        }}>Ok</Button>
        <Button variant="contained" onClick={handleClose}>Cancel</Button>
      </DialogActions>

    </Dialog>
  </Row>
}

export default AutoIncrement