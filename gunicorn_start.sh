#!/bin/sh

mkdir -p /var/log/gunicorn
LOG_FILE=/var/log/gunicorn/augry_error.log
PID_FILE=/var/log/gunicorn/gunicorn.pid

sudo -E gunicorn \
--log-file $LOG_FILE \
--pid $PID_FILE \
-c "gunicorn_config.py" \
"app:config_app()" &

# Output log written by gunicorn to stdout
if $DEBUGGING; then
    sudo tail -f -n 0 $LOG_FILE | grep -v "\[DEBUG\] [0-9]\+ workers$"
else
    sudo tail -f -n 0 $LOG_FILE
fi
