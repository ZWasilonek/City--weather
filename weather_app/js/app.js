import {OpenWeatherMap} from './open-weather.js'

const weatherInfo = document.getElementsByClassName('weather__info');
const weatherCity = document.querySelector('.city');
const $cityName = document.querySelector('.city__name');
const $pressure = document.querySelector('.pressure__value');
const $humidity = document.querySelector('.humidity__value');
const $windSpeed = document.querySelector('.wind-speed__value');
const $temperature = document.querySelector('.temperature__value');
const $weatherIcon = document.querySelector('.weather__icon').firstChild;

const herokuCORS = 'https://cors-anywhere.herokuapp.com/';
const ipApi = 'http://ip-api.com/json/';

class IPinfo {
    constructor(){
        this.city;
        this.lat;
        this.lon;
    }
}
// class IPinfo {
//     constructor(){
//         this.fetchIP();
//         this.city;
//         this.lat;
//         this.lon;
//     }
//     async fetchIP() {
//         const resp = await (await fetch(herokuCORS+ipApi)).json();
//         this.city = resp.city;
//         this.lat = resp.lat;
//         this.lon = resp.lon;
//     }
//     async VisitorInter() {
//         const ip = await this.ipPromise;  // this could potentially hang forever if ipgeolocation.io doesn't feel like answering
//         console.log(ip);
//     }
//     getCity() {
//         console.log('city form obj',this.city)
//         return this.city
//     };
// }

(async () => {
    // let currentIPInfo;
    try {
        let ip = await (await fetch(herokuCORS+ipApi)).json();
        console.log('ip', ip);
        showWeatherContent();
        getCurrentWeather(ip.city); 

        // currentIPInfo = new IPinfo(ip.city, ip.lat, ip.lon);
        // console.log('currentIPInfo', currentIPInfo)
    } catch (error) {
        console.error(error);
    }
    // return currentIPInfo;
})();


function showWeatherContent() {
    const weatherModule = document.querySelector('.module__weather');
    let isHidden = weatherModule.hasAttribute('hidden');
    if (isHidden) weatherModule.removeAttribute('hidden');
}

const btnAddWeatherModule = document.querySelector('#add-city');
btnAddWeatherModule.addEventListener('click', function() {
    const addForm = document.querySelector('.module__form');
    let isHidden = addForm.hasAttribute('hidden');
    if (isHidden) addForm.removeAttribute('hidden');
    else addForm.setAttribute('hidden', true);
})

let weather = new OpenWeatherMap();

function getCurrentWeather(city) {
    weather.getCurrentWeatherByCityName(city,(currentWeather, err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log('currentWeather', currentWeather)
            let {pressure} = currentWeather.main;
            let {humidity} = currentWeather.main;
            let {speed} = currentWeather.wind;
            let {temp} = currentWeather.main;
            let {id} = currentWeather.weather[0];
            console.log(id);
            setWeatherModule(currentWeather.name, pressure, humidity, speed, Math.floor(temp), 300);
        }
    })
}

function setWeatherModule(city, pressure, humidity, speed, temp, iconId) {
    $cityName.innerHTML = city;
    $pressure.innerHTML = pressure;
    $humidity.innerHTML = humidity;
    $windSpeed.innerHTML = speed;
    $temperature.innerHTML = temp;
    setIcon(iconId);

    // latitude.innerHTML = latitude;
    // longitude.innerHTML = longitude;
}

function setIcon(iconId) {
    let id = String(iconId);
    const dirIcon = 'images/icons';
    if (id.startsWith('2')) {
        $weatherIcon['src'] = `${dirIcon}/thunderstorm.svg`;
    } else if (id.startsWith('3')) {
        if (id === '300') {
            $weatherIcon['src'] = `${dirIcon}/rain-4.svg`;
        }
        // $weatherIcon['src'] = `${dirIcon}/rain.svg`;
    } else if (id.startsWith('5')) {
        if (id >= '500' && id <= '504') {
            $weatherIcon['src'] = `${dirIcon}/snowy-1.svg`
        } else if (id === '511') {
            $weatherIcon['src'] = `${dirIcon}/snowy-1.svg`
        }
    }
}

// weather.getCurrentWeatherByGeoCoordinates()

// weatherModule.cloneNode(true);