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

  // CONVERT THIS TO ASYNC


  var dirs = Object.keys(directoryMap);
  for(let d=0, pd=Promise.resolve(); d<dirs.length; d++){
    pd = pd.then(__ => new Promise(resolve2 =>{
      var pth = dirs[d];
      console.log('\nDirectory = ' + pth);
      var files = directoryMap[pth];
      var len = 0;
      if(files) len = files.length;
      for(let i=0, p=Promise.resolve(); i<files.length; i++){
        p = p.then(_ => new Promise(resolve =>{
          var name = files[i];
          if(name.indexOf(FAVORITES_TAG)==-1){
            var reversename = name.split('').reverse().join('');
            // console.log('\t Rev = ' + reversename);
            var extension = reversename.substring(0,reversename.indexOf('.')+1).split('').reverse().join('');
            // console.log('\t Ext = ' + extension);
            var filename = name.substring(0, name.length-extension.length)
                         + FAVORITES_TAG + extension;
            // console.log('\tFile = ' + filename);
            var newpath = pth + '/' + filename;
            var oldpath = pth + '/' + name;
            setTimeout(function(){
              console.log('\tFile (#' + i + ') = ' + filename);
              if(i==files.length-1) resolve2();
              resolve();
            }, Math.floor(Math.random()*500));
            /*fs.rename(newpath, oldpath, function(err){
              console.log('********** ERROR Renaming file!');
            });*/
          }
        }));
      }
    }));

    // fs.rename(pth + '/' + filename.lastIndexOf('.'))
  };
}
