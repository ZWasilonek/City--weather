import {OW_API_KEY} from '../../api_keys.js';

// const openWeatherApi =`http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=${OW_API_KEY}`
const herokuCORS = 'https://cors-anywhere.herokuapp.com/';

class OpenWeatherMap {};

function sendResponse(data, err, callback){
	let error = null;

	error = err;
	if(data){
		if(typeof data === 'undefined'){
			error = new Error(JSON.parse(data));
			error.status = e.cod;
		} 
	}
	callback(data, error);
}

OpenWeatherMap.prototype.getCurrentWeatherByCityName = function (cityName, callback) {
	const requestURL = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OW_API_KEY}&units=metric&lang=pl`;
  return fetch(herokuCORS+requestURL).then(resp => resp.json())
										.then((data, err)=>{sendResponse(data, err, callback)})
										.catch((data, err)=>{sendResponse(data, err, callback)});    
}

OpenWeatherMap.prototype.getCurrentWeatherByGeoCoordinates = function(latitude, longitude, callback) {
	const requestURL = `api.openweathermap.org/data/2.5/weather?lat=${parseFloat(latitude)}&lon=${parseFloat(longitude)}&appid=${OW_API_KEY}&units=metric&lang=pl`;
	return fetch(herokuCORS+requestURL).then(resp=>resp.json())
										.then((data, err)=>sendResponse(data, err, callback));
};




OpenWeatherMap.prototype.getThreeHourForecastByCityName = function(cityName, callback) {
	const requestURL = `api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${OW_API_KEY}&units=metric&lang=pl`;
	return fetch(herokuCORS+requestURL).then(resp=>resp.json())
	  								.then((data, err)=>sendResponse(data, err, callback));
};


OpenWeatherMap.prototype.getThreeHourForecastByGeoCoordinates = function(latitude, longitude, callback) {
	const requestURL = `api.openweathermap.org/data/2.5/forecast?lat=${parseFloat(latitude)}&lon=${parseFloat(longitude)}&appid=${OW_API_KEY}&units=metric&lang=pl`;
	return fetch(herokuCORS+requestURL).then(resp=>resp.json())
										.then((data, err)=>sendResponse(data, err, callback));
};

// OpenWeatherMap.prototype.getCurrentWeatherByIP = function (lat, callback) {
// 	const weatherByIp = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.api_key}`
// }

// let weather = new OpenWeatherMap();
// weather.getCurrentWeatherByCityName('Warszawa',(currentWeather, err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log('currentWeather', currentWeather);
//     }
// })

export {OpenWeatherMap};