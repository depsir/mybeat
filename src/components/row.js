import React from "react"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px"
  }
})

const Row = ({children}) => {
  const classes = useStyles()
  return <div className={classes.row}>
    {children}
  </div>
}

export default Row