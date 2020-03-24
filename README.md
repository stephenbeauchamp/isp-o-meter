# ISP-O-METER

Quick and Drity internet speed data collection and graphing (speedtest-cli wrapper)

## References

A list of test server IDs is available here:  
https://www.speedtestserver.com/

Or buy running  
```
$ speedtest --list
```

CSV output headers, from:  
https://github.com/sivel/speedtest-cli/blob/master/speedtest.py, line 1041
```
row = ['Server ID', 'Sponsor', 'Server Name', 'Timestamp', 'Distance',
              'Ping', 'Download', 'Upload', 'Share', 'IP Address']
```

## Prerequisites
speedtest-cli must be installed on your computer.
