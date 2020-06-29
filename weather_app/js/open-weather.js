import {OW_API_KEY} from '../../api_keys.js';

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

OpenWeatherMap.prototype.getWeatherByTime = function(latitude, longitude, time, callback) {
	const requestURL = `api.openweathermap.org/data/2.5/onecall/timemachine?lat=${parseFloat(latitude)}&lon=${parseFloat(longitude)}
	&dt=${time}&appid=${OW_API_KEY}&units=metric&lang=pl`;
  return fetch(herokuCORS+requestURL).then(resp=>resp.json())
										.then((data, err)=>sendResponse(data, err, callback));
};

OpenWeatherMap.prototype.getWeekForecastByGeoCoordinates = function(latitude, longitude, callback) {
	const requestURL = `api.openweathermap.org/data/2.5/forecast?lat=${parseFloat(latitude)}&lon=${parseFloat(longitude)}&
	exclude=hourly,daily&appid=${OW_API_KEY}&units=metric&lang=pl`;
	return fetch(herokuCORS+requestURL).then(resp=>resp.json())
										.then((data, err)=>sendResponse(data, err, callback));
};

OpenWeatherMap.prototype.getWeekForecastByGeoCoordinates = function(cityName, callback) {
	const requestURL = `api.openweathermap.org/data/2.5/forecast?q=${cityName}&
	exclude=hourly,daily&appid=${OW_API_KEY}&units=metric&lang=pl`;
	return fetch(herokuCORS+requestURL).then(resp=>resp.json())
										.then((data, err)=>sendResponse(data, err, callback));
};

export {OpenWeatherMap};