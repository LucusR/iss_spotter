const { nextISSTimesForMyLocation, } = require('./iss');

const printPassTimes  = function(passTimes) {
  for (let pass of passTimes) {
    let datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    let duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});