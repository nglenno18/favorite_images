const port = process.env.PORT || 3002;
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// App-specific dependencies
var fs = require('fs');
var ExifImage = require('exif').ExifImage;

// Variables to be converted to input
var favorites_dir = 'C:/Users/glenn/Pictures/PhonePictures';
var favorites_dir = 'C:/Users/glenn/Pictures';

app.listen(port, function(){
  console.log('App listening on port %s', this.address().port, '\n');

  /*
      Version 1

        [Function 1] Export FileNames of Favorites
        - Provide a Directory (isolated library of favorites)
        - Store all filenames in the given Directory (favorites_list)

        [Function 2]
        - Provided list of filenames (favorites_list)
        - Provided a "Source" directory
        - Search for the favorites_list (by filename) in the "Source" directory
        - Track the new file_locations in a new map 

        [Function 3]
        - Verify the output of Function 2
   */


   var stringresult = '';
   forLoopPromises = function(x, sub){
     console.log('\nforLoopPromises('+x+')');
     return new Promise(function(resolve2, reject2) {
       for(let i = 1, p=Promise.resolve(); i<=x; i++){
         p = p.then(_ => new Promise(resolve=>{
           setTimeout(function(){
             console.log(x+' = ' + i);
             stringresult+=' ('+x+'.'+i+')';
             if(i == 4) forLoopPromises(3, true).then(function(results){
               console.log('\nResolving sub-loop...');
               resolve();
             });
             else{
               if(i == x-1) resolve2(stringresult);
               else resolve();
             }

           }, Math.random() * 500)
         }));
       }
     });

   }

   /*forLoopPromises(10).then(function(results){
     console.log('\nForLoopPromises... completed');
     console.log('RESULTS : ' + results);
   });*/


   var directoryMap = {};

    swimDirForLoop = function(dirpath){
      console.log('\n\nforLoopSwimming');

      return new Promise(function(resolve2, reject2){
        fs.readdir(dirpath, function(err, files){
          var listlength = files.length;
          var filesNotDirs = files;
          if(listlength <= 0) resolve2();
          for(let i=0, p=Promise.resolve(); i<listlength; i++){
            p = p.then(_ => new Promise(resolve =>{
              var file = files[i];
              var isDir = fs.statSync(dirpath +'/'+file).isDirectory();
              if(isDir){
                console.log('**SubDirectory Found!**');
                var subpath = dirpath +'/' +file;
                console.log(subpath);
                swimDirForLoop(subpath).then(function(results){
                  console.log('Resolving sub-loop...');
                  if(i==listlength-1) resolve2(directoryMap);
                  else resolve();
                });
              }else {
                // directoryMap[dirpath] = files;
                if(!directoryMap[dirpath]) directoryMap[dirpath] = [];
                directoryMap[dirpath].push(file);

                if(i==listlength-1) {
                  console.log('Last File Detected...');
                  resolve2(directoryMap);
                }
                else resolve();
              }
            }));
          }
        });

      })
    }

    swimDirForLoop(favorites_dir).then(function(results){
      console.log('\nForLoopPromises... completed');
      console.log('RESULTS : ' + Object.keys(results));
      Object.keys(results).forEach(function(key, i){
        console.log(key + ' (' + results[key].length + ')');
      });

      // Test ExifImage
      try{
        var test_path = Object.keys(results)[0];
        var test_image = test_path + '/' + '20201216_110428.jpg';
        var test_image = 'E:/DCIM/Camera' + '/20201216_110428.jpg';
        console.log('Test Image....'+ test_image);
        new ExifImage({image:test_image}, function(error, exifData){
          if(error)
            console.log('Error: '+ error.message);
          else {
            console.log(exifData);
          }
        });
      }catch(error){
        console.log('Error : ' + error.message);
      }
    });



   /*
      Version 2

        [Version_1.Function2]
          - update each file, rather than copy
          - Need to specify actual meta-data updates
   */


   /*
      Version 3

        [Version_1.Function1]
        - should eliminate the need for a pre-defined "favorites directory"
        - Will depend on the ability to identify Samsung_Gallery "Favorites" tag on the file metadata
            - What type of data do I need to be reading? EXIF? IPTC? XMP?

   */


});
