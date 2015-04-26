var N3 = require('n3'), fs = require('fs'), LineByLineReader = require('line-by-line');

var fs = require('fs');
var docDirs = fs.readdirSync(process.env['METRIC_DIR']);



var prefixCcList = require('./prefixcc.js');
var getPrefix = function(find, startIndex, lastIndex) {
    if (startIndex === undefined)
        startIndex = 0;
    if (lastIndex === undefined)
        lastIndex = prefixCcList.length - 1;

    // search in middle;
    var checkIndex = lastIndex - (parseInt((lastIndex - startIndex) / 2));
    // console.log(startIndex, lastIndex, checkIndex);
    if (find.indexOf(prefixCcList[checkIndex]) == 0) {
        // found it!
        return prefixCcList[checkIndex];
    } else {
        if (startIndex == lastIndex) {
            // no use searching. could not find it
            return null;
        } else if (lastIndex - startIndex === 1) {
            // just 1 item as offset. Can be because of rounding issue. just try
            // and add 1
            return getPrefix(find, startIndex + 1, lastIndex);
        }
        if (find > prefixCcList[checkIndex]) {
            return getPrefix(find, checkIndex, lastIndex);
        } else {
            return getPrefix(find, startIndex, checkIndex);
        }
    }
};

// init prefix cc counters
var counters = {};
prefixCcList.forEach(function(ns) {
    counters[ns] = 0;
});

var writeCounters = function() {
    console.log('writing to file');
    var wstream = fs.createWriteStream(__dirname + '/results.tsv');
    for ( var ns in counters) {
        wstream.write(ns + '\t' + counters[ns] + '\n');
    }
    wstream.end();
}






var ns, numDocsDone = 0, triplesCounts = 0;
var doDir = function() {
    if (docDirs.length == 0) {
        //we're done
        console.log("");
        writeCounters();
        return;
    }
    var docDir = docDirs.pop();
//    console.log(docDir);
    var docNamespaces = {};
    numDocsDone++;
    var nsFile = process.env['METRIC_DIR'] + "/" + docDir + "/namespaceCounts";
    if (fs.existsSync(nsFile)) {
        var lr = new LineByLineReader(nsFile);
        lr.on('error', function(err) {
            console.error(err);
        });

        lr.on('line', function(line) {
            triplesCounts++;
            var fromFile = line.split('\t')[0];
            //append # or /, as we removed this in clod
            if (ns = getPrefix(fromFile + '#')) {
                console.log(ns);
                docNamespaces[ns] = true;
            } else if (ns = getPrefix(fromFile + '/')){
                console.log(ns);
                docNamespaces[ns] = true;
            }
        });

        lr.on('end', function() {
            // up counters
            for ( var ns in docNamespaces) {
                counters[ns]++;
            }

            var msg = "Processed " + numDocsDone + " documents (" + triplesCounts + " triples)";
            if (numDocsDone % 100 === 0) {
                process.stdout.write(msg + "\n");
                writeCounters();
            } else {
                process.stdout.write(msg + "\r");
            }
            doDir();
        });
    } else {
        console.error(nsFile + " does not exist");
        doDir();
    }

}

doDir();

