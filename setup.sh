#!/bin/bash

#clone sub repos
if [ ! "$(ls -A hdt)" ]; then ( cd hdt && git clone git@github.com:LaurensRietveld/hdt-cpp.git . ); fi
if [ ! "$(ls -A frank)" ]; then ( cd frank && git clone git@github.com:LODLaundry/Frank.git  . ); fi

#compile c
( cd hdt/hdt-lib && make );



mkdir -p results;
mkdir -p tmp;
