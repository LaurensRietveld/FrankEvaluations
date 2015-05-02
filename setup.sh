#!/bin/bash


command -v npm >/dev/null 2>&1 || echo "npm is not installed. Running the ld adoption experiments is not possible"
command -v node >/dev/null 2>&1 || echo "node is not installed. Running the ld adoption experiments is not possible"


#clone sub repos
echo "Cloning the HDT repository"
if [ ! "$(ls -A hdt)" ]; then ( cd hdt && git clone git@github.com:LaurensRietveld/hdt-cpp.git . > /dev/null); fi
[ ! $? -eq 0 ] && echo "Failed to clone HDT"
echo "Cloning the frank repository"
if [ ! "$(ls -A frank)" ]; then ( cd frank && git clone git@github.com:LODLaundry/Frank.git  . > /dev/null); fi
[ ! $? -eq 0 ] && echo "Failed to clone frank"

#compile c
echo "Compiling the HDT library"
( cd hdt/hdt-lib && make > compileLog.log 2> compileLog.err);
[ ! $? -eq 0 ] && echo "Failed to compile HDT. Check out the compile log (hdt/compileLog.[log|err] on what went wrong. For the list of hdt dependencies, see https://github.com/rdfhdt/hdt-cpp/tree/master/hdt-lib"




#install npm dependencies
echo "Initializing the NodeJs code for running LD adoption experiments"
( cd ldAdoptionExperiments && npm update > npmUpdateLog.log 2> npmUpdateLog.err);
[ ! $? -eq 0 ] && echo "Failed to update npm code. Check out the logs (ldAdoptionExperiments/npmUpdateLog.[log|err] on what went wrong."

