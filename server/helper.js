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
              // Check if DIR file matches FavoritesCopy
              if(file.indexOf(FAVORITES_TAG)>-1) console.log('Check source-file against filteredList = ' + file);
              if(filteredlist.indexOf(file)>-1 || filteredlist.indexOf(file.replace(FAVORITES_TAG+'.', '.'))>-1){
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


parsePathNames = function(name, pth){
  var reversename = name.split('').reverse().join('');
  // console.log('\t Rev = ' + reversename);
  var extension = reversename.substring(0,reversename.indexOf('.')+1).split('').reverse().join('');
  // console.log('\t Ext = ' + extension);
  var filename = name;
  if(name.indexOf(FAVORITES_TAG)==-1){
    filename = name.substring(0, name.length-extension.length)
                 + FAVORITES_TAG + extension;
  }
  // console.log('\tFile = ' + filename);
  var newpath = pth + '/' + filename;
  var oldpath = pth + '/' + name;

  return {favpath:newpath, srcpath:oldpath, filename};
}


addFavorites = function(name, pth, callback){
  var paths = parsePathNames(name, pth);
  var newpath = paths.favpath;
  var oldpath = paths.srcpath;
  fs.rename(oldpath, newpath, function(err){
    if(err) console.log('********** ERROR Renaming file!\n'+ err);
    else callback(name)
  });
}


/**
  FavoriteCopies directory will not have the "FAVORITES_TAG"

*/
removeFavorites = function(name, pth, callback){
  console.log('\n\n***REMOVING FAVORITES ***');
  var paths = parsePathNames(name, pth);
  var oldpath = paths.srcpath;
  var newpath = oldpath.replace(FAVORITES_TAG, '');
  console.log(newpath);
  fs.rename(oldpath, newpath, function(err){
    if(err) console.log('********** ERROR Renaming file!\n'+ err);
    else callback(name)
  });
}

updateDirectory = function(directoryMap, addremove){
  console.log('*****\nupdateDirectory(directoryMap)\n*****');
  return new Promise(function(finalResolve, reject) {
    var dirs = Object.keys(directoryMap);
    // Loop DIRs
    for(let d=0, pd=Promise.resolve(); d<dirs.length; d++){
      pd = pd.then(__ => new Promise(resolve2 =>{
        var pth = dirs[d];
        console.log('\nDirectory = ' + pth);
        var files = directoryMap[pth];
        var len = 0;
        if(files) len = files.length;
        else {
          console.log('No Files found in this directory');
          if(d==dirs.length-1) return finalResolve();
        }
        console.log('FileLength = ' + files.length);
        // LOOP FILES
        for(let i=0, p=Promise.resolve(); i<files.length; i++){
          p = p.then(_ => new Promise(resolve =>{
            var name = files[i];
            returnFilePromise = function(filename){
                console.log('\tFile (#' + i + ') = ' + filename);
                if(i==files.length-1) {
                  if(d==dirs.length-1) finalResolve();
                  else resolve2();
                }
                resolve();
              }

            if(name.indexOf(FAVORITES_TAG)==-1 && addremove == 'ADD'){
              addFavorites(name, pth, returnFilePromise);
            }else if(name.indexOf(FAVORITES_TAG)>-1 && addremove =='ADD'){
              returnFilePromise(name);
            }else if(name.indexOf(FAVORITES_TAG)>-1 && addremove =='REMOVE'){
              removeFavorites(name, pth, returnFilePromise);
            }else if(name.indexOf(FAVORITES_TAG)==-1 && addremove =='REMOVE'){
              returnFilePromise(name);
            }
          }));
        }
      }));
    }
  });


    // fs.rename(pth + '/' + filename.lastIndexOf('.'))
}
