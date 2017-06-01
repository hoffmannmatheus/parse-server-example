
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
require('dotenv').config()

if (!process.env.DATABASE_URI || !process.env.MASTER_KEY) {
  console.log('Please configure the .env first.');
  return;
}

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
  liveQuery: {
    classNames: ["SpotReview"]
  },
  filesAdapter: {
    module: "parse-server-s3-adapter",
    options: {
      bucket: process.env.S3_BUCKET,
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
      bucketPrefix: '',
      directAccess: false,
      baseUrl: null,
      baseUrlDirect: false,
      signatureVersion: 'v4',
      globalCacheControl: null,
      ServerSideEncryption: 'AES256|aws:kms'
    }
  }
});

var app = express();
app.use('/public', express.static(path.join(__dirname, '/public')));

var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.');
});

var port = process.env.SERVER_PORT;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('ppg-spots-server running on port ' + port + '.');
});
ParseServer.createLiveQueryServer(httpServer);
