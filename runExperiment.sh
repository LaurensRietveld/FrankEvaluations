#!/bin/bash

frank=frank/frank
rdf2hdt=hdt/hdt-lib/tools/rdf2hdt
hdtLoad=hdt/hdt-lib/examples/load
resultsDir=results
tmpDir=tmp;

#clean previous results
rm -rf $resultsDir/*
skipped=0;
count=1;
#get all documents from frank
while read -r downloadLink; do
    rm -rf $tmpDir/*
    if curl -I -s -X HEAD $downloadLink | grep --quiet .nq.gz ; then
        echo "skipping quad file $downloadLink ($skipped)";
        (( skipped++ ));
        continue;
    fi
    resultForDoc=$resultsDir/`basename $downloadLink` && mkdir -p $resultForDoc;
    echo "Processing $downloadLink ($count)";
    #download zip file, measure zipped file size, uncompress, and measure uncompressed file size
    echo " - Downloading and uncompressing";
    curl -s $downloadLink \
        | tee >(wc -c > $resultForDoc/gzippedFileSize) \
        | zcat \
        | tee >(wc -c > $resultForDoc/uncompressedFileSize) >(wc -l > $resultForDoc/numTriples) > $tmpDir/unpacked;
        
    #build hdt file from uncompressed file. Measure hdt file size, and build time
    echo " - Building HDT file";
    $rdf2hdt $tmpDir/unpacked $tmpDir/hdt.hdt > $resultForDoc/hdtBuildTime;
    wc -c $tmpDir/hdt.hdt > $resultForDoc/hdtFileSize;
    
    #testing load time
    echo " - Testing load time"
    $hdtLoad $tmpDir/hdt.hdt > $resultForDoc/hdtLoadTime;
    (( count++ ));
    
    
done;


