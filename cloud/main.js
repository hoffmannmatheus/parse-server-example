var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  apiKey: process.env.MAPS_API_KEY
};
var geocoder = NodeGeocoder(options);


Parse.Cloud.define('resolveAddress', function(req, res) {
  console.log("request:", req);
  geocoder.reverse({lat: req.params.lat, lon: req.params.lon}, function(err, result) {
        console.log(err, result);
        if (!err && result && result.length > 0) {
          res.success(result[0]);
        } else {
          res.error({err, message: "No location found"});
        }
      });
});
