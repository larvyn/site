# Site screenshots

Every image in `src/assets/screens` is a real Larvyn window showing the demo projects from [larvyn/demo](https://github.com/larvyn/demo), never a real project.

## The demo

Clone it into `C:\Sites` so the paths shown in the screenshots stay short and neutral, then prepare it:

```sh
git clone https://github.com/larvyn/demo.git /c/Sites
/c/Sites/scripts/setup.sh
```

`setup.sh` also resets the data (orders, log entries, failed jobs, test report). Larvyn's state for the demo lives in `C:\Sites\.larvyn`, so your own Larvyn settings are never used.

## Capturing

Build Larvyn first (`wails3 build` in the larvyn repo), then:

```sh
scripts/screenshots/capture-all.sh          # everything
scripts/screenshots/shots.sh routes routes  # one view
```

`shots.sh` opens its own window with the demo home, so it never touches a Larvyn you have open. Clicks and typing go through `act.ps1` (`click:x,y;type:text;key:{ENTER};wait:ms`, coordinates relative to the 1440x900 window); `shot.ps1` captures the window with PrintWindow.
