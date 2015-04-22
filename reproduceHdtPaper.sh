#!/bin/bash

frank="frank/frank documents -d"

#1m 5m 10 20 30 40
$frank --minTriples 950000 --maxTriples 1050000 | ./runExperiment.sh results/1m
$frank --minTriples 4750000 --maxTriples 5250000 | ./runExperiment.sh results/5m
$frank --minTriples 9500000 --maxTriples 10500000 | ./runExperiment.sh results/10m
$frank --minTriples 19000000 --maxTriples 21000000 | ./runExperiment.sh results/20m
$frank --minTriples 28500000 --maxTriples 31500000 | ./runExperiment.sh results/30m
$frank --minTriples 38000000 --maxTriples 42000000 | ./runExperiment.sh results/40m
