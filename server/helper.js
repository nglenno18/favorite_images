fs = require('fs');
const FAVORITES_TAG = '__fvrt_'

printObjectSummary = function(jsonObject){
  Object.keys(jsonObject).forEach(function(key, i){
    console.log(key + ' (' + jsonObject[key].length + ')');
  });
}

swimDirForLoop = function(dirpath, mp, filteredlist){
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
            swimDirForLoop(subpath, mp, filteredlist).then(function(results){
              console.log('Resolving sub-loop...');
              if(i==listlength-1) resolve2(mp);
              else resolve();
            });
          }else {
            // mp[dirpath] = files;
            if(filteredlist){
              if(filteredlist.indexOf(file)>-1){
                if(!mp[dirpath]) mp[dirpath] = [];
                mp[dirpath].push(file);
              }
            }else{
              if(!mp[dirpath]) mp[dirpath] = [];
              mp[dirpath].push(file);
            }

            if(i==listlength-1) {
              console.log('Last File Detected...');
              resolve2(mp);
            }
            else resolve();
          }
        }));
      }
    });

  })
}



updateFavorites = function(directoryMap){
  console.log('*****\nupdateFavorites(directoryMap)\n*****');


  var dirs = Object.keys(directoryMap);
  dirs.forEach(function(pth, i){
    console.log('\nDirectory = ' + pth);
    var files = directoryMap[pth];
    files.forEach(function(name, x){
      // determine if the file is already "Tagged"
      if(name.indexOf(FAVORITES_TAG)==-1){
        var reversename = name.split('').reverse().join('');
        // console.log('\t Rev = ' + reversename);
        var extension = reversename.substring(0,reversename.indexOf('.')+1).split('').reverse().join('');
        // console.log('\t Ext = ' + extension);
        var filename = name.substring(0, name.length-extension.length)
                     + FAVORITES_TAG + extension;
        console.log('\tFile = ' + filename);
        var newpath = pth + '/' + filename;
        var oldpath = pth + '/' + name;
        /*fs.rename(newpath, oldpath, function(err){
          console.log('********** ERROR Renaming file!');
        });*/
      }
    });
    // fs.rename(pth + '/' + filename.lastIndexOf('.'))
  });
}
