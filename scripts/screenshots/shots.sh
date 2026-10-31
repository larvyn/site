#!/bin/bash
# Usage: [ACT=...] [RUN=...] [AGENT=...] [WAIT=9] [AFTER=2] shots.sh <name> <view> [palette text]
#
# Opens a separate Larvyn window on the demo home (C:\Sites\.larvyn), optionally clicks and
# types (see act.ps1), saves a screenshot to src/assets/screens/<name>.png and closes only
# that window. Other Larvyn windows you have open are never touched.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
EXE=${LARVYN_EXE:-/c/Users/AHMAD/Documents/proyectos/laral/larvyn/bin/larvyn.exe}
HOME_DIR=${DEMO_HOME:-'C:\Sites\.larvyn'}
OUT=${OUT:-$HERE/../../src/assets/screens}
mkdir -p "$OUT"
name=$1; view=$2; pal=$3

before=$(powershell -NoProfile -Command "(Get-Process larvyn -ErrorAction SilentlyContinue | % Id) -join ','" | tr -d '\r')
# Run Larvyn like a person would: without an agent's environment variables, which switch
# Laravel's output to a compact agent format.
unset_args=$(env | grep -o -E '^(CLAUDE[A-Z_]*|ORCA[A-Z_]*|AI_AGENT|CODEX[A-Z_]*|CURSOR_AGENT)=' | tr -d = | sed 's/^/-u /' | tr '\n' ' ' || true)
(env $unset_args LARVYN_HOME="$HOME_DIR" LARVYN_VIEW="$view" LARVYN_PALETTE="$pal" LARVYN_RUN="$RUN" LARVYN_AGENT="$AGENT" "$EXE" >/dev/null 2>&1 &)
sleep 2
pid=$(powershell -NoProfile -Command "\$b='$before'.Split(','); (Get-Process larvyn | ? { \$b -notcontains [string]\$_.Id } | Select -First 1).Id" | tr -d '\r')
sleep "${WAIT:-9}"
if [ -n "$ACT" ]; then
  powershell -NoProfile -File "$(cygpath -w "$HERE/act.ps1")" -ProcId "$pid" -Actions "$ACT"
  sleep "${AFTER:-2}"
fi
powershell -NoProfile -File "$(cygpath -w "$HERE/shot.ps1")" -Out "$(cygpath -w "$OUT/$name.png")" -ProcId "$pid" >/dev/null
taskkill //PID "$pid" //T //F >/dev/null 2>&1 || true
echo "captured $name"
