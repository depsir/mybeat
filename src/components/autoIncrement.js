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
import Col from "./col"
import Slider from "@material-ui/core/Slider"

const AutoIncrement = ({ started, varyBpm}) => {
  const [autoIncrement, setAutoIncrement] = useState({enabled: false, direction: 1, step:0, period:0});
  const [step, setSteps] = useState(0)
  const [period, setPeriod] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const [direction, setDirection] = useState(1)
  const [open, setIncrementDialogOpen] = useState(false);

  useEffect(() => {
    if (autoIncrement.enabled && started) {
      const interval = setInterval(() => {
        varyBpm(autoIncrement.direction * t(autoIncrement.step))
      }, t(autoIncrement.period) * 1000)
      return () => clearInterval(interval)
    }
  }, [autoIncrement.enabled, autoIncrement.step, autoIncrement.period, autoIncrement.direction, started])

  useEffect(() => {
      setSteps(autoIncrement.step || 0)
      setPeriod(autoIncrement.period || 0)
      setEnabled(autoIncrement.enabled)
      setDirection(autoIncrement.direction || 1)
  }, [open])

  const handleClose = () => setIncrementDialogOpen(false)
  return <Row>
    <span>Auto increment</span>
    <Switch checked={autoIncrement.enabled}
            onChange={(e) => {
              setAutoIncrement({ ...autoIncrement, enabled: e.target.checked })
            }}/>
    <AutoIncrementSettingsIcon onClick={() => setIncrementDialogOpen(true)}/>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Auto Increment</DialogTitle>
      <DialogContent>
        <Col>
          <Row>
            <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)}/>
            {direction > 0 ? <Grow color="primary" onClick={() => setDirection(-1)}/> : <Lower color="primary" onClick={() => setDirection(1)}/>}
          </Row>
          <Slider value={step} min={0} max={25} onChange={(e, v) => setSteps(v)}/>
          <Slider type="range" value={period} min={0} max={25} onChange={(e, v) => setPeriod(v)}/>
          <div>{`${direction > 0 ? "Increase" : 'Decrease'} ${t(step)} bpm every ${t(period)} seconds`}</div>
        </Col>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => {
          setIncrementDialogOpen(false)
          setAutoIncrement({step, enabled, period, direction})
        }}>Ok</Button>
      </DialogActions>

    </Dialog>
  </Row>
}

export default AutoIncrement