#!/bin/bash

#clone sub repos
if [ ! "$(ls -A hdt)" ]; then ( cd hdt && git clone git@github.com:LaurensRietveld/hdt-cpp.git . > /dev/null); fi
if [ ! "$(ls -A frank)" ]; then ( cd frank && git clone git@github.com:LODLaundry/Frank.git  . > /dev/null); fi

#compile c
( cd hdt/hdt-lib && make > /dev/null);

#install npm dependencies

( cd ldAdoptionExperiments && npm update );

mkdir -p results;
mkdir -p tmp;
