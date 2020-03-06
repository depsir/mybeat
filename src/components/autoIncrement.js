import React, { useReducer, useState } from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Switch } from "@material-ui/core"
import Row from "./row"
import AutoIncrementSettingsIcon from "@material-ui/icons/Schedule"
import { INCREMENT, INCREMENT_UNIT } from "../lib/domain"
import IncrementSelector from "./incrementSelector"
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/styles"
const initial = () => ({direction: 1, delta:1, period:1, mode: INCREMENT.TIME, unit: INCREMENT_UNIT.BPM})

const useStyles = makeStyles({
  hidden: {
    visibility: "hidden"
  },
  hover: {
    '&&:hover svg.delete':{
      visibility: "visible"
    }
  },
})

const AutoIncrement = ({configure}) => {
  const [autoIncrement, setAutoIncrement] = useState({enabled:false, auto: [initial()]});
  const [auto, setAuto] = useState([initial()])
  const [enabled, setEnabled] = useState(false)
  const [open, setIncrementDialogOpen] = useState(false);

  const classes = useStyles()

  function openDialog(){
    setEnabled(autoIncrement.enabled)
    setIncrementDialogOpen(true)
    setAuto(autoIncrement.auto)
  }

  const canRemove = auto.length > 1

  function removeRow(idx) {
    if (!canRemove) return;

    const rows = [...auto]
    rows.splice(idx, 1)
    setAuto(rows)
  }

  const handleClose = () => setIncrementDialogOpen(false)
  return <Row>
    <span>Auto increment</span>
    <Switch checked={autoIncrement.enabled}
            onChange={(e) => {
              setAutoIncrement({ ...autoIncrement, enabled: e.target.checked })
              configure({enabled: e.target.checked, auto: autoIncrement.auto})

            }}/>
    <AutoIncrementSettingsIcon onClick={openDialog}/>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
          <span>Auto Increment</span>
          <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)}/>
          <AddIcon onClick={() => setAuto([...auto, initial()])}/>
      </DialogTitle>
      <DialogContent>
        {auto.map((a, i) => <Row className={classes.hover} key={i}>
          <DeleteIcon className={classes.hidden} />
          <IncrementSelector
            auto={a}
            setAuto={(x) => {
              const copy = [...auto]
              copy.splice(i, 1, x)
              setAuto(copy)
            }}
          />
         <DeleteIcon onClick={() => removeRow(i)} className={(canRemove ? "delete " : "") + classes.hidden} color={"primary"}/>
          </Row>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => {
          setIncrementDialogOpen(false)
          setAutoIncrement({enabled, auto})
          configure({enabled, auto})
        }}>Ok</Button>
      </DialogActions>

    </Dialog>
  </Row>
}

export default AutoIncrement