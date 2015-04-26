var N3 = require('n3'),
    fs = require('fs'),
    parser = N3.Parser();
if (process.stdin.isTTY) {
    console.error("This node script only works with a stream (via bash pipe) of n-quads");
    process.exit(1);
}
//var self = process.stdin;
//self.on('readable', function() {
//    var chunk = this.read();
//    console.log(chunk);
//});
//
//var parser = N3.Parser(),
//rdfStream = fs.createReadStream('cartoons.ttl');
//
//{ subject: 'http:/scratch/lodlaundromat/crawls/12/69e7c7ccdc8f0b373325d5acf3c27b26/dirty',
//    predicate: '%5C%22dc:issued%5C%22',
//    object: '"2010"',
//    graph: 'http://lodlaundromat.org/resource/69e7c7ccdc8f0b373325d5acf3c27b26' }



var prefixCcList = require('./prefixcc.js');
var getPrefix = function(find, startIndex, lastIndex) {
    if (startIndex === undefined) startIndex = 0;
    if (lastIndex === undefined) lastIndex = prefixCcList.length - 1;
    
    //search in middle;
    var checkIndex = lastIndex - (parseInt((lastIndex - startIndex) / 2));
//    console.log(startIndex, lastIndex, checkIndex);
    if (find.indexOf(prefixCcList[checkIndex]) == 0) {
        //found it!
        return prefixCcList[checkIndex];
    } else {
        if (startIndex == lastIndex) {
            //no use searching. could not find it
            return null;
        } else if (lastIndex - startIndex === 1) {
            //just 1 item as offset. Can be because of rounding issue. just try and add 1
            return getPrefix(find, startIndex+1, lastIndex);
        }
        if (find > prefixCcList[checkIndex]) {
            return getPrefix(find, checkIndex, lastIndex);
        } else {
            return getPrefix(find, startIndex, checkIndex);
        }
    }
};


var prevDoc = null;
var numDocsDone = 0;


//init prefix cc counters
var counters = {};
prefixCcList.forEach(function(ns){
   counters[ns] = 0; 
});

var writeCounters = function() {
    console.log('writing to file');
    var wstream = fs.createWriteStream(__dirname + '/results/counts');
    for (var ns in counters) {
        wstream.write(ns + '\t' + counters[ns] + '\n');
    }
    wstream.end();
}
var subPrefix, predPrefix, objPrefix;
parser.parse(process.stdin, function(error, triple, prefixes) {
    if (error) return;//should not happend anyway, considering the formatting of lod laundromat
    //we know the triples are sorted by graph
//    console.log(error, triple, prefixes);
    if (triple.graph !== prevDoc) {
        prevDoc = triple.graph;
        numDocsDone++;
    }
    
//    console.log(triple);
    if (subPrefix = getPrefix(triple.subject)) counters[subPrefix]++;
//    console.log("pred");
    if (predPrefix = getPrefix(triple.predicate)) counters[predPrefix]++;
//    console.log("obj");
    if (triple.object.charAt(0) !== '"' && (subPrefix = getPrefix(triple.subject))) counters[subPrefix]++;
    
//    writeCounters();
    
    if (numDocsDone % 1000 === 0) {
        process.stdout.write("Processed " + numDocsDone + "\n");
        writeCounters();
    } else {
        process.stdout.write("Processed " + numDocsDone + "\r");
    }
});