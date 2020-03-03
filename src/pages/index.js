import React, { useState } from "react"
import Metronome from "../components/metronome"
import { GlobalHotKeys } from "react-hotkeys"
import Help from "../components/help"
import { createMuiTheme } from "@material-ui/core"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

const theme = createMuiTheme({
  // palette: {
  //   primary: {
  //     main: "#660000"
  //   },
  //   secondary: {
  //     main: "#f44336",
  //   },
  // },
})

export default () => {

  const [showHelp, setShowHelp] = useState(false)

  const keyMap = {
    SHOW_HELP: { sequence: "shift+?", action: "keydown" },
    HIDE_HELP: { sequence: "shift+?", action: "keyup" },
  }
  const handlers = {
    SHOW_HELP: () => { setShowHelp(true) }, HIDE_HELP: () => { setShowHelp(false) },
  }
  return <ThemeProvider theme={theme}>
    <div>
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
      />
      {<Help open={showHelp} onClose={() => setShowHelp(false)}/>}
      <Metronome/>
    </div>
  </ThemeProvider>
}
