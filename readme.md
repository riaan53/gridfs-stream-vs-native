This is to compare the performance of the new node v0.10 style streams in https://github.com/aheckmann/gridfs-stream as disscussed in https://github.com/aheckmann/gridfs-stream/pull/47

Note that repetitive runs on native mongodb streams using the same db and filename yields quicker results. I suspect that they do a md5 check before writing the chunks. So change the filename or db name each time that you run the test.

Here are some example runs.. (min:seconds.milliseconds):

Run1 (97.5 MB):
------gridfs-stream------
writestream file to GridStore in: 0:2.445
{ _id: 54d92a55866f89205658910d,
  filename: 'movie2.mov',
  contentType: 'binary/octet-stream',
  length: 97508214,
  chunkSize: 261120,
  uploadDate: Mon Feb 09 2015 23:44:55 GMT+0200 (SAST),
  aliases: undefined,
  metadata: undefined,
  md5: 'c433a8d9da0668d155e471de649ed2e3' }
readstream file from GridStore in: 0:0.529
------end------
------native mongodb streams------
writestream native file to GridStore in: 0:2.657
{ _id: 54d92a58866f892056589285,
  filename: 'movie2.mov_native',
  contentType: 'binary/octet-stream',
  length: 97508214,
  chunkSize: 261120,
  uploadDate: Mon Feb 09 2015 23:44:58 GMT+0200 (SAST),
  aliases: undefined,
  metadata: undefined,
  md5: 'c433a8d9da0668d155e471de649ed2e3' }
done readstream native
readstream native file from GridStore in: 0:0.448
------end------


Run2 (97.5 MB):
------gridfs-stream------
writestream file to GridStore in: 0:2.615
{ _id: 54d92aa9affea531566a56ad,
  filename: 'movie2.mov',
  contentType: 'binary/octet-stream',
  length: 97508214,
  chunkSize: 261120,
  uploadDate: Mon Feb 09 2015 23:46:19 GMT+0200 (SAST),
  aliases: undefined,
  metadata: undefined,
  md5: 'c433a8d9da0668d155e471de649ed2e3' }
readstream file from GridStore in: 0:0.823
------end------
------native mongodb streams------
writestream native file to GridStore in: 0:2.563
{ _id: 54d92aadaffea531566a5825,
  filename: 'movie2.mov_native',
  contentType: 'binary/octet-stream',
  length: 97508214,
  chunkSize: 261120,
  uploadDate: Mon Feb 09 2015 23:46:23 GMT+0200 (SAST),
  aliases: undefined,
  metadata: undefined,
  md5: 'c433a8d9da0668d155e471de649ed2e3' }
done readstream native
readstream native file from GridStore in: 0:0.524
------end------


Run3 (10 GB)
------gridfs-stream------
writestream file to GridStore in: 5:25.578
{ _id: 54d92c13fea64d6656a4ba58,
  filename: '10g_file',
  contentType: 'binary/octet-stream',
  length: 10737418240,
  chunkSize: 261120,
  uploadDate: Mon Feb 09 2015 23:56:18 GMT+0200 (SAST),
  aliases: undefined,
  metadata: undefined,
  md5: '2dd26c4d4799ebd29fa31e48d49e8e53' }
readstream file from GridStore in: 1:58.329
------end------
------native mongodb streams------
writestream native file to GridStore in: 6:55.306
{ _id: 54d92dcefea64d6656a55afb,
  filename: '10g_file_native',
  contentType: 'binary/octet-stream',
  length: 10737418240,
  chunkSize: 261120,
  uploadDate: Tue Feb 10 2015 00:03:31 GMT+0200 (SAST),
  aliases: undefined,
  metadata: undefined,
  md5: '2dd26c4d4799ebd29fa31e48d49e8e53' }
done readstream native
readstream native file from GridStore in: 1:57.978
------end------


PS: Sorry for the code/callback mess - just a quick comparison example :)