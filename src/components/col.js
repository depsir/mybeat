import React from "react"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  row: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: "10px"
  }
})

const Col = ({children}) => {
  const classes = useStyles()
  return <div className={classes.row}>
    {children}
  </div>
}

export default Col