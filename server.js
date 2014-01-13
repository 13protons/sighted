/*

2013 Alan Languirand
@13protons

*/

var express = require('express')
    , lessMiddleware = require('less-middleware')
    , http = require('http')
    , url = require('url')
    , fs = require('fs')
    , path = require('path')
    , ejs = require('ejs')
    , app = express()
    , mde = require('markdown-extra')
    , marked = require('marked')
    , config = require('./config'); //make sure it's pointing in the right direction. config.js doesn't sync w/ git

    
 
    
	app.engine('.html', require('ejs').__express);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'html');
    
    //less is more? 
	app.use(lessMiddleware({
	    src      : __dirname + '/public',
	    compress : true
	  }));
    
	app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

    
    //default page
    app.get('/', function(req, res) {
        var filename = __dirname + "/content/about.md";
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) throw err;
            console.log('OK: ' + filename);
          
            var doc = CreateDocument(data);
            console.log(doc); 
            
            res.render('index', {
                content: doc.content,
                meta: doc.meta
            });
        });
        
        

	});

      /*
	app.locals({
	  table  : function(list) {
	    var template = fs.readFileSync(__dirname + '/views/table.ejs', 'utf-8');
	    return ejs.render(template, list);
	  },
      message: ""
    
	});
*/

function CreateDocument(md){
    var output = {};
    output.text = mde.content(md);
    output.content = marked(output.text);
    output.meta = mde.metadata(md, function(md){
            var retObj = {};
            md.split('\n').forEach(function(line) {
              var data = line.split(':');
              retObj[data[0].trim()] = data[1].trim();
            });
            return retObj;
          });
    if(output.meta.title){output.title = output.meta.title;}
    else {output.title = mde.heading(md);}
    return output;
}

	var port = process.env.PORT || 3000;
	app.listen(port);

	console.log('Listening on port %d', port);

    function getUser(req){
        var user = null;
        if(typeof(req.user) != 'undefined'){ 
            user = req.user ;
        }
        return user;
    }

function log(x){
    console.log(x);
}