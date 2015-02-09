var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var fs = require('fs');

// create or use an existing mongodb-native db instance.
// for this example we'll just create one:
var db = new mongo.Db('mydb5', new mongo.Server("127.0.0.1", 27017),{w:1});
function millisecondsToTime(milli)
{
      var milliseconds = milli % 1000;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);

      return minutes + ":" + seconds + "." + milliseconds;
}

var filename = '10g_file';
var filename_out = 'file_out';

// make sure the db instance is open before passing into `Grid`
db.open(function (err) {
    if (err) return handleError(err);
    var gfs = Grid(db, mongo);

    console.log('------gridfs-stream------')

    // Create writestream using gridfs-stream
    var writestream = gfs.createWriteStream({
      filename: filename
    });

    // Open file readstream
    var fileReadStream = fs.createReadStream(filename);

    // Start timeer
    var start = new Date();

    // Pipe
    fileReadStream.pipe(writestream);

    // When store closes and write completed
    writestream.on('close', function(file) {
      console.log('writestream file to GridStore in: '+millisecondsToTime(new Date() - start));
      console.log(file);

      // Create readstream using gridfs-stream from file just uplaoded
      var readstream = gfs.createReadStream({
        filename: filename
      });

      // Open file writestream
      var fileWriteStream = fs.createWriteStream(filename_out);

      // Start timer
      var start2 = new Date();

      // Pipe
      readstream.pipe(fileWriteStream);

      // When store closes stop timer and print results
      readstream.on('close', function() {
        console.log('readstream file from GridStore in: '+millisecondsToTime(new Date() - start2));
        console.log('------end------')
        console.log('------native mongodb streams------')

        // Now lets start with the native streams.
        // Create store
        var store= new mongo.GridStore(db, filename+'_native', 'w');

        // Open file readstream
        var fileReadStream2 = fs.createReadStream(filename);

        //Time needs to start before store opens for comparable results.
        var start3 = new Date();

        // Open store
        store.open(function(err, gs) {

          // Create writestream using native mongo streams
          var writestreamNative = gs.stream();

          // When done
          writestreamNative.on("end", function(err) {

            // Close the store
            store.close(function(err,res){
              console.log('writestream native file to GridStore in: '+millisecondsToTime(new Date() - start3));
              console.log(res);

              // Stream file back using native mongo streams
              var store= new mongo.GridStore(db, filename+'_native', 'r');

              // Open file writestream
              var fileWriteStream2 = fs.createWriteStream(filename_out+'_native');

              // Start timer
              var start4 = new Date();

              // Open store
              store.open(function(err, gs) {

                // Create readstream from mongo native streams
                var readstreamNative = gs.stream();

                // When done.
                fileWriteStream2.on('close', function() {
                  console.log('done readstream native');
                  store.close(function(err){
                    console.log('readstream native file from GridStore in: '+millisecondsToTime(new Date() - start4));
                    console.log('------end------')
                  });

                })
                readstreamNative.pipe(fileWriteStream2);
              })


            });
          });

          fileReadStream2.pipe(writestreamNative);
        });

      })
    })



})
