var N3 = require('n3'),
    fs = require('fs'),
    byline = require('byline'),
    request = require('superagent'),
    zlib = require('zlib');
if (process.stdin.isTTY) {
    console.error("This node script only works with a stream (via bash pipe) of n-quads");
    process.exit(1);
}


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



var subPrefix, predPrefix, objPrefix;
var numDocsDone = 0;
var triplesCount = 0;
function handleDoc() {
    var docNamespaces = {};
    var writer = new require('stream').Writable({ objectMode: true });
    writer._write = function (doc, encoding, done) {
        numDocsDone++;
        var lineStream = byline.createStream();
        var zlibStream = zlib.createGunzip({ encoding: 'utf8' });
        var parser = new  N3.StreamParser();
        var req = request.get(doc)
            .pipe(zlibStream)
            .pipe(lineStream)
            .pipe(parser);
        
        parser.on('data', function(triple) {
            triplesCount++;
            if (subPrefix = getPrefix(triple.subject)) docNamespaces(subPrefix) = true;
            if (predPrefix = getPrefix(triple.predicate)) docNamespaces(predPrefix) = true;
            if (triple.object.charAt(0) !== '"' && (objPrefix = getPrefix(triple.object))) docNamespaces(objPrefix) = true;
        });
        parser.on('end', function() {
            //up counters
            for (var ns in docNamespaces) {
                counters[ns]++;
            }
            
            var msg = "Processed " + numDocsDone + " documents (" + triplesCount + " triples)";
            if (numDocsDone % 1000 === 0) {
                process.stdout.write(msg + "\n");
                writeCounters();
            } else {
                process.stdout.write(msg + "\r");
            }
            done();
        });
        
      };
      return writer;
}


var stream = byline.createStream(process.stdin, { encoding: 'utf8' });
stream.pipe(new handleDoc());
