import React, { useState } from "react"
import Metronome from '../components/metronome'
import { GlobalHotKeys} from "react-hotkeys"
import Help from "../components/help"

export default () => {

    const [showHelp, setShowHelp] = useState(false)

    const keyMap = { SHOW_HELP: { sequence: "shift+?", action: "keydown" }, HIDE_HELP: { sequence: "shift+?", action: "keyup" } }
    const handlers = {SHOW_HELP: () => {setShowHelp(true)}, HIDE_HELP: () => {
        setShowHelp(false)
      }}
    return <div>
        <GlobalHotKeys
  keyMap={keyMap}
  handlers={handlers}
  />
        {<Help open={showHelp} onClose={() => setShowHelp(false)}/>}
            <Metronome/>
    </div>
}
