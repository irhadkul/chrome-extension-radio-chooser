/**
 * Created by Irhad on 01.11.2017.
 */

/**
 *  requires handlebars
 * @param {{}} obj
 */
var handlebars =require('handlebars');
var fs = require('fs');
var through = require('through2');
var StringDecoder = require('string_decoder').StringDecoder;

exports.compile = function (options) {


    return through.obj(function(file, encoding, callback) {
        var decoder = new StringDecoder('utf8');
        // decode buffer contents
        var template = decoder.write(file.contents);
        // read data for the files
        var dataToWrite = fs.readFileSync(options.data, "utf8");
        // replace file extension
        file.history[0] =file.history[0].substr(0, file.history[0].lastIndexOf(".")) + ".html";
        // write contents back to buffer
        file.contents = Buffer.from(writeFilesToHtml(template,JSON.parse(dataToWrite)),'utf8');
        this.push(file);

        callback();
    });


};


function writeFilesToHtml(file,data) {
    var templates = handlebars.compile(file);
   return templates(data);

}

