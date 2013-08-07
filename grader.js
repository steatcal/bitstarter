#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var rest = require('restler');
var sys = require('util');

var program = require('commander');
var cheerio = require('cheerio');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://morning-tor-8846.herokuapp.com/";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkHtmlPage = function(htmlPage, checksfile) {
    $ = cheerio.load(htmlPage);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648

    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-i, --item <item>', 'Path and filename or URL (URL is default)', URL_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);

    //console.log('item:   ', program.item);
    //console.log('checks: ', program.checks);

    //check if file or url    

    var filestr = program.item.toString();
    if(fs.existsSync(filestr)) { //ok, it's a valid file, so proceed as before
	var checkJson = checkHtmlFile(filestr, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    } else { //assume it's meant to be an url, so need to test that, then make that url a file and proceed as before
	rest.get(program.item).on('complete', function(result) {
	    if (result instanceof Error) {
		sys.puts('Sorry, the was an Error: ' + result.message);
		//this.retry(5000); // try again after 5 sec
	    } else {
		//sys.puts(result);
		var checkJson = checkHtmlPage(result, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		console.log(outJson);
	    }
	});
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
