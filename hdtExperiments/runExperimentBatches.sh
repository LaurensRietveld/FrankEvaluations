#!/bin/bash
currentDir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
frank="$currentDir/../frank/frank documents -d"
runCmd="./hdtCompressDocument.sh"
#1m 5m 10 20 30 40
cmd="$frank --minTriples 950000 --maxTriples 1050000 | $runCmd results/1m"
echo "#### Running cmd:    $cmd"
eval $cmd;
cmd="$frank --minTriples 4750000 --maxTriples 5250000 | $runCmd results/5m"
echo "#### Running cmd:    $cmd"
eval $cmd;
cmd="$frank --minTriples 9500000 --maxTriples 10500000 | $runCmd results/10m"
echo "#### Running cmd:    $cmd"
eval $cmd;
cmd="$frank --minTriples 19000000 --maxTriples 21000000 | $runCmd results/20m"
echo "#### Running cmd:    $cmd"
eval $cmd;
cmd="$frank --minTriples 28500000 --maxTriples 31500000 | $runCmd results/30m"
echo "#### Running cmd:    $cmd"
eval $cmd;
cmd="$frank --minTriples 38000000 --maxTriples 42000000 | $runCmd results/40m"
echo "#### Running cmd:    $cmd"
eval $cmd;

cmd="$frank --maxAvgDegree 5 --minTriples 1000000 | head -n 100 | $runCmd results/1m_lowDegree"
echo "#### Running cmd:    $cmd"
eval $cmd;
cmd="$frank --minAvgDegree 5 --maxAvgDegree 10 --minTriples 1000000 | head -n 100 | $runCmd results/1m_mediumDegree"
echo "#### Running cmd:    $cmd"
eval $cmd;
cmd="$frank --minAvgDegree 10 --minTriples 1000000 | head -n 100 | $runCmd results/1m_highDegree"
echo "#### Running cmd:    $cmd"
eval $cmd;
