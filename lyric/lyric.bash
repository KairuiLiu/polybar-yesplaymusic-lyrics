#!/bin/bash

PROC=$(pgrep -a "yesplaymusic")
if [ ${#PROC} -eq 0 ]; then
  echo ''
else
  node ~/.config/polybar/scripts/lyric/app.js
fi
