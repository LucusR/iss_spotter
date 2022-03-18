const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response ${body}`));
      return;
    } 
    const ip = JSON.parse(body).ip;
    callback(null, ip); 
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    
    console.log("Test")

    const {latitude, longitude} = JSON.parse(body);
    callback(null, {latitude, longitude});
  });
};
  
const fetchISSFlyOverTimes = function(coords, callback){
  console.log("fetchISSFlyOverTimes")
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    console.log("FetchISSFlyOverTimes");
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null)
    }

  fetchCoordsByIP(ip, (error, loc) => {
    if (error) {
      return callback(error, null)
    }

  fetchISSFlyOverTimes(loc, (error, nextPasses) => {
    if (error) {
      return callback(error, null)
    }
    callback(null, nextPasses);
  });
  });
  });
};

module.exports = { nextISSTimesForMyLocation };