import React from "react"
import Dialog from "@material-ui/core/Dialog"
import { makeStyles } from "@material-ui/styles"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"

const useStyles = makeStyles({
  dialog: {
  },
  ul: {
    padding: 0,
    margin: 0,
    "& li": {
      listStyleType: "none",
      margin: 0,
      padding: "4px 0px",
    },
    "& li span": {
      fontWeight: "bold",
      border: "1px solid #ccc",
      padding: "1px 5px",
      backgroundColor: "#eee",
    },
    "& li:first-child": {
      paddingTop: 0
    }
  },
})

const Help = ({ open }) => {
  const classes = useStyles()
  return <Dialog open={open}>
    <DialogTitle>Keyboard shortcuts</DialogTitle>
    <DialogContent>
      <div className={classes.dialog}>
        <ul className={classes.ul}>
          <li><span>?</span> show help</li>
          <li><span>-</span> decrease tempo</li>
          <li><span>+</span> increase tempo</li>
          <li><span>space</span> start/stop</li>
          <li><span>up</span> tempo down to prev 5</li>
          <li><span>down</span> tempo up to next 5</li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
}

export default Help