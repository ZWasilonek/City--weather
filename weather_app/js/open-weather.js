const OW_API_KEY = process.env.OW_API_KEY;

class OpenWeatherMap {};

function sendResponse(data, err, callback){
	let error = null;

	error = err;
	if(data){
		if(typeof data !== 'undefined'){
			error = new Error(data);
			error.status = data.cod;
		} 
	}
	callback(data, error);
}

OpenWeatherMap.prototype.getWeekForecastByGeoCoordinates = async function(latitude, longitude, callback) {
	const requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${parseFloat(latitude)}&lon=${parseFloat(longitude)}&
	exclude=hourly,daily&appid=${OW_API_KEY}&units=metric&lang=pl`;
	return await fetch(requestURL).then(resp=>resp.json())
	.then((data, err)=>sendResponse(data, err, callback));
};

OpenWeatherMap.prototype.getWeekForecastByCityName = async function(cityName, callback) {
	const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&
	exclude=hourly,daily&appid=${OW_API_KEY}&units=metric&lang=pl`;
	return await fetch(requestURL).then(resp=>resp.json())
	.then((data, err)=>sendResponse(data, err, callback));
};

export {OpenWeatherMap};