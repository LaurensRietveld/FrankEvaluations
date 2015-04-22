#!/bin/bash

#clone sub repos
( cd hdt && git clone git@github.com:LaurensRietveld/hdt-cpp.git . )
( cd frank && git clone git@github.com:LODLaundry/Frank.git . )

( cd hdt/hdt-lib && make );



mkdir -p results;
mkdir -p tmp;
