const port = process.env.PORT || 3002;
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
// Load Local Helper File
require('./helper.js');

// App-specific dependencies
var ExifImage = require('exif').ExifImage;

// FileNames of the Favorites_Dir will be tracked in a list
var favorites_dir = 'C:/Users/glenn/Pictures/PhonePictures';
var favorites_dir = 'C:/Users/glenn/Documents/FavoritesCopies';
// Contents of the gallery_dir will be updated as "Favorites"
var gallery_dir = 'C:/Users/glenn/Pictures';

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
        - Print to File

        [Function 3]
        - Verify the output of Function 2
   */

   var directoryMap = {};
   var favoritesMap = {};

    /* [ FUNCTION_1 ]
        Export Favorites (filenames) from given directory
    */
    var fs1 = fs;
    swimDirForLoop(favorites_dir, favoritesMap).then(function(results){
      console.log('\nFavoritesDirectory... swim completed');
      console.log('\nPrint FavoritesMap Summary...');
      // results returned have already been stored in favoritesMap var
      printObjectSummary(favoritesMap);

      // initialize an array to be used to filter the return result of the Source-Dir swim
      var favoritesList = [];
      Object.keys(favoritesMap).forEach(function(k, name){
        console.log(favoritesMap[k]);
        favoritesList = favoritesList.concat(favoritesMap[k]);
      });
      console.log('Favorites List ... ' + favoritesList.length);


      swimDirForLoop(gallery_dir, directoryMap, favoritesList).then(function(gall_results){
        console.log('\nGalleryDirectory... swim completed');
        console.log('\nPrint Gallery/DirectoryMap Summary...');
        // results returned have already been stored in directoryMap var
        printObjectSummary(directoryMap);

        // Write JSON Directory to File
        // (This is the list of Actual File Locations that should be tagged as Favorites according to the favoritesDirectory input)
        fs1.writeFileSync('source_favorites.json', JSON.stringify(directoryMap,null, 2));
      });
      return;

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

        [Function 3]
          - Using the favoritesList, create the favorites in the source directory
          - Need to specify actual meta-data updates, update to filename?
   */


   /*
      Version 3

        [Version_2.Function 3]
        - should eliminate the need for a pre-defined "favorites directory"
        - Will depend on the ability to identify Samsung_Gallery "Favorites" tag on the file metadata
            - What type of data do I need to be reading? EXIF? IPTC? XMP?

        - Look into SwiftTags app on GooglePlay.
          (If tags can be applied on the source, Function_1 can be re-written to assemble the favorites list from those tags)

   */


});
