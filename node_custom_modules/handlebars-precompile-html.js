/**
 * Created by Irhad on 01.11.2017.
 */

/**
 *  requires handlebars
 * @param {{}} obj
 */
var handlebars =require('handlebars');
var fs = require('fs');

exports.compile = function (obj) {

readTemplates(obj.templates,obj.data);

};

function readTemplates(path,data) {

    fs.readdir(path, function (err, items) {
        for (var i = 0; i < items.length; i++) {
            console.log(items[i]);
            var template = fs.readFileSync(path+"\\" +items[i], "utf8");
            var dataToWrite = fs.readFileSync(data, "utf8");
            writeFilesToHtml(template,JSON.parse(dataToWrite),items[i]);

        }
    });
}


function writeFilesToHtml(file,data,filename) {

    var templates = handlebars.compile(file);
    var result = templates(data);
    var fileToWrite = filename.replace(/.hbs/i, '.html');


    fs.writeFile("src\\"+fileToWrite, result, function(err) {
        if (err) {
            return console.log(err);
        }
    });

}

