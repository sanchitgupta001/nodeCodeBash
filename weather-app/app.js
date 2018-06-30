/**
 * Created by sanchitgupta001 on 01/07/18.
 */
const yargs = require('yargs');
const axios = require('axios');
const keys = require('../keys/keys');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true,
    },
  })
  .help()
  .alias('help', 'h')
  .argv;

const encodedAddress = encodeURIComponent(argv.address);
const geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geoCodeUrl).then(response => {
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Unable to Find the mentioned address');
  } else if (response.data.status === 'OK') {
    const responseDataResult = response.data.results[0];
    const address = responseDataResult.formatted_address;
    const latitude = responseDataResult.geometry.location.lat;
    const longitude = responseDataResult.geometry.location.lng;
    const weatherUrl = `https://api.darksky.net/forecast/${keys.darkSkyApiKey}/${latitude},${longitude}?units=si`;
    console.log(`Address: ${address}`);
    return axios.get(weatherUrl);
  } else {
    throw new Error('Something went Wrong');
  }
})
  .then(response => {
    if (response.status === 200) {
      console.log(`It's currently: ${response.data.currently.temperature} degrees Celsius`);
      console.log(`It feels like: ${response.data.currently.apparentTemperature} degrees Celsius`);
    } else {
      throw new Error('Something went Wrong!');
    }
  })
  .catch(e => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to API Servers');
  } else {
    console.log(e.message);
  }
});
