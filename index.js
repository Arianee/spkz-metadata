var fs = require('fs');
var path = require('path');
const { getStrategyHelperFactory } = require('@arianee/spkz-sdk/helpers/getStrategyHelper/getStrategyHelper.helper');
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};
const walkInDir = (roomDir) => {
  return new Promise((resolve,reject)=>{
    walk(roomDir, (err, list) => {
      const paths= list
        .filter(path => path.endsWith('.json'));
      resolve(paths)
    });
  });
};

(async function(){
  try{

  const roomsDir = ['./80001/rooms', './137/rooms',];

  for(var roomDir of roomsDir){
    const roomsPath=await walkInDir(roomDir);
    for(roomPath of roomsPath){
      console.log('# Testing', roomPath);
      const file = fs.readFileSync(roomPath, { encoding: 'utf-8' });
      const json = JSON.parse(file);
      await getStrategyHelperFactory(json);
    }
  }
  console.log('SUCCESS! all working fine');
    process.exit()
  }catch(e){
    console.log("error")
    console.log(e);
    process.exit(1);
  }

})()

