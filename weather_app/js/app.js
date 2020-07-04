import {OpenWeatherMap} from './open-weather.js'

const $body = document.querySelector('body');
let $btnClose = document.querySelector('.btn-remove-module');
const btnShowForm = document.querySelector('#add-city');
const addForm = document.querySelector('.module__form');

let cityNameInput = document.querySelector('#search');

//MAIN WEATHER MODULE
const weatherModule = document.querySelector('.module__weather');
const $dayName = document.querySelector('.day__name');
const $cityName = document.querySelector('.city__name');
const $pressure = document.querySelector('.pressure__value');
const $humidity = document.querySelector('.humidity__value');
const $windSpeed = document.querySelector('.wind-speed__value');
const $temperature = document.querySelector('.temperature__value');
const $weatherIcon = document.querySelector('.weather__icon').firstChild;

//FORECAST WEATHER MODULE SECTION
const $daysContent = document.querySelectorAll('.day-content');

const daysWeatherObjArray = [];
const dailyForecastFor5Day = [];

(async () => { 
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat  = position.coords.latitude;
                    const long = position.coords.longitude;
                    getWeekForecast(lat, long)
                },
                function errorCallback(error) {
                    console.error(error);
                },
                { timeout:5000 }
            );
        }
    } catch (error) {
        console.error(error);
    }
})();

function showModule() {
    let isHidden = weatherModule.hasAttribute('hidden');
    if (isHidden) weatherModule.removeAttribute('hidden');
}(loadingPage());

function loadingPage() {
    setTimeout(() => {
        $body.classList.remove('loading');
    }, 900);
}

let weather = new OpenWeatherMap();

function getWeekForecast(lat, lon) {
    weather.getWeekForecastByGeoCoordinates(lat, lon, (weekWeather, err)=>{
        if(err.status !== '200'){
            console.error(err.status);
        }else{
            getDayWeatherHourlyForecast(weekWeather)
            get5DayWeatherObject(daysWeatherObjArray);
            setWeatherModule(dailyForecastFor5Day);
        }
    })
    showModule();
}

function setWeatherModule(daysWeatherForecastArr) {
    let currentDateWeather = daysWeatherForecastArr[0];
    setMainWeatherModule(currentDateWeather);
    setForcastForNextDays(daysWeatherForecastArr);
}

function setMainWeatherModule(currentDayWeather) {
    $dayName.innerHTML = currentDayWeather.day;
    $cityName.innerHTML = currentDayWeather.city;
    $pressure.innerHTML = currentDayWeather.pressure;
    $humidity.innerHTML = currentDayWeather.humidity;
    $windSpeed.innerHTML = currentDayWeather.windSpeed;
    $temperature.innerHTML = currentDayWeather.temp;
    $weatherIcon.src = currentDayWeather.icon;
}

function setForcastForNextDays(weatherDaysArray) {
    function setModuleItem(items) {
        for (let i=0; i<items.length; i++) {
            let item = items[i];
            item.querySelector('.day').innerHTML = weatherDaysArray[i].day;
            item.querySelector('img').src = weatherDaysArray[i].icon;
            item.querySelector('.temperature__value').innerHTML = weatherDaysArray[i].temp
        }
    }
    setModuleItem($daysContent);
}

function get5DayWeatherObject(daysWeatherObjArray) {
    // let weatherDaysArray = new Array();

    for (let i=0; i<daysWeatherObjArray.length; i++) {
        let dailyHourlyForecastArray = daysWeatherObjArray[i].dailyHourlyForecastArray;
        let currentWeather;

        if(i===0){
            currentWeather = dailyHourlyForecastArray[i];
            dailyForecastFor5Day.push(currentWeather);
            continue;
        } else {
            let hour = '15:00:00';
            currentWeather = dailyHourlyForecastArray[0];
            let weatherWithSelectedTime = getDayWeatherByDateAndHour(currentWeather.date, hour, dailyHourlyForecastArray).currentWeather;
            dailyForecastFor5Day.push(weatherWithSelectedTime);
        }
    }
    // return weatherDaysArray;
}

function getDayWeatherByDateAndHour(date, hour, dayWeatherHourlyArray) {
    let formattedDate = formatDateWithHour(date, hour);

    for (let index=0; index<dayWeatherHourlyArray.length; index++) {
        let currentWeather = dayWeatherHourlyArray[index];
        let dateOfDayWeather = currentWeather.date;
        if(dateOfDayWeather === formattedDate) {
            return {currentWeather, index}
        }
    }
}

class DayWeatherHourlyForecast {
    constructor(dailyHourlyForecastArray) {
        this.dailyHourlyForecastArray = dailyHourlyForecastArray;
    }
}

class DayWeather {
    constructor(day, date, city, pressure, humidity, windSpeed, temp, iconId) {
        this.day = day;
        this.date = date;
        this.city = city;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.temp = Math.floor(temp);
        this.icon = this.setIcon(iconId);
    }
    setIcon(iconId) {
        let id = String(iconId);
        const dirIcon = `images/icons/`;
        if (id.startsWith('2')) {
            this.icon = dirIcon+'thunder.svg';
        } else if (id.startsWith('3')) {
            if (id === '300' || id === '310') this.icon = dirIcon+'rainy-2.svg';
            else if (id === '301' || id === '311') this.icon = dirIcon+'rainy-1.svg';
            else if (id === '302' || id === '321') this.icon = dirIcon+'rainy-3.svg';
            else if (id === '313' || id === '314' || id === '312') this.icon = dirIcon+'rainy-4.svg';
        } else if (id.startsWith('5')) {
            if (id === '500' || id === '520') this.icon = dirIcon+'rainy-4.svg';
            else if (id === '501' || id === '502' || id === '521') this.icon = dirIcon+'rainy-5.svg';
            else if (id === '503' || id === '504' || id === '531' || id === '522') this.icon = dirIcon+'rainy-6.svg';
            else if (id === '511') this.icon = dirIcon+'rainy-7.svg';
        } else if (id.startsWith('6')) {
            if (id === '600' || id === '611' || id === '612' || id === '615' || id === '620') 
                this.icon = dirIcon+'snowy-4.svg';
            else if (id === '601' || id === '613' || id === '616' || id === '621') 
                this.icon = dirIcon+'snowy-5.svg';
            else if (id === '602' || id === '622') this.icon = dirIcon+'snowy-6.svg'
        } else if (id.startsWith('7')) {
            if (id === '781') this.icon = dirIcon+'tornado.svg';
            else this.icon = dirIcon+'fog.svg';
        } else if (id === '800') {
            this.icon = dirIcon+'clear-day.svg';
        } else if (id.startsWith('8')) {
            if (id === '801') this.icon = dirIcon+'cloudy-day-1.svg';
            else if (id === '802') this.icon = dirIcon+'cloudy-day-2.svg'
            else if (id === '803') this.icon = dirIcon+'cloudy-day-3.svg'
            else if (id === '804') this.icon = dirIcon+'hail.svg';
        }
        return this.icon;
    }
    // https://openweathermap.org/weather-conditions
}

function getDayWeatherHourlyForecast(weatherForecast) {

    let enteredDay = setCurrentDate(weatherForecast).getDate();
    let historyForecast = weatherForecast.list;
    const city = weatherForecast.city.name;
    let objCounter = 0;

    for (let i=objCounter; i<historyForecast.length; i++) {
        let daysWeatherWithSameDate = [];
        let isSameDay = true;

        while (isSameDay) {
            let currentWeather = historyForecast[objCounter];
            let dateWeather = currentWeather.dt_txt;
            let dayNumWeatherIndex = new Date(dateWeather).getDate();

            if (objCounter === historyForecast.length-1) {
                break;
            } 
            else if (dayNumWeatherIndex !== enteredDay) {
                isSameDay = false;
                enteredDay = dayNumWeatherIndex;
            } else {
                let dayWeather = convertOpenWeatherObjectToDayWeatherObject(currentWeather, city);
                daysWeatherWithSameDate.push(dayWeather);
                objCounter++;
            }
        }
        if (objCounter < historyForecast.length-1) {
            daysWeatherObjArray.push(new DayWeatherHourlyForecast(daysWeatherWithSameDate));
        }
    }
}


//CONVERTERS
function convertOpenWeatherObjectToDayWeatherObject(openWeatherObjects, cityName) {
    const mainInfo = openWeatherObjects.main;
    let date = new Date(openWeatherObjects.dt_txt);

    let currentDayNum = date.getDay();
    let formattedDate = formatDate(date);
    let {pressure} = mainInfo;
    let {humidity} = mainInfo;
    let {speed} = openWeatherObjects.wind;
    let {temp} = mainInfo;
    let {id} = openWeatherObjects.weather[0];
    let dayName = convertDayNumToDayName(currentDayNum);
    let newDayWeather = new DayWeather(dayName,formattedDate,cityName,pressure,humidity,speed,temp,id);

    return newDayWeather;
}

function convertDayNumToDayName(dayNum) {
    switch(dayNum) {
        case 0:
            return 'Niedziela';
        case 1: 
            return 'Poniedziałek';
        case 2: 
            return 'Wtorek';
        case 3:
            return 'Środa';
        case 4:
            return 'Czwartek';
        case 5:
            return 'Piątek';
        case 6:
            return 'Sobota';
    }
}

//TIME FUNCTIONS
function setCurrentDate(weatherForecast) {
    let currentWeather = weatherForecast.list[0];
    let {dt_txt} = currentWeather;
    const currentDate = new Date(dt_txt);
    return currentDate;
}

function formatDate(date) {
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let options = {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }
    let d = date.toLocaleString('pl-PL', options);
    return d.replace(/\./, '-').replace(/\./, '-').replace(/,/, '');
}

function formatDateWithHour(date, hour) {
    return date.replace(/\d{2}:\d{2}:\d{2}/, hour);
}


//SHOW ADDING FORM
btnShowForm.addEventListener('click', function() {
    showAddForm();
})

function showAddForm() {
    cityNameInput.style.background = 'white';
    cityNameInput.value = '';
    cityNameInput.placeholder = 'np. Wrocław';

    let isHidden = addForm.hasAttribute('hidden');
    if (isHidden) addForm.removeAttribute('hidden');
    else addForm.setAttribute('hidden', true);
}

//ADDING THE NEW MODULE
function getWeatherByCityName(cityName) {
    $body.className += 'loading';
    weather.getWeekForecastByCityName(cityName, (weatherForecast, error)=> {
        if (error.status !== '200') {
            console.error(error.status);
            setNotFoundError();
        } else {
            let newModule = weatherModule.cloneNode(true);
            document.querySelector('#app').appendChild(newModule);
            newModule.querySelector('.btn--close').addEventListener('click', function () {
                this.parentElement.style.display = 'none';
            });
            let arr = getDayWeatherArray(weatherForecast);
            setWeatherModule(arr);
            $body.classList.remove('loading');
            showAddForm();
            showModule();
        }
    })
    loadingPage();
};

const form = document.querySelector('.find-city');
form.addEventListener('submit', function() {
    event.preventDefault();
    let city = cityNameInput.value;
    if (validate(city)) {
        getWeatherByCityName(city);
    }
})

//VALIDATION ADD
function validate(cityValue) {
    let cityName = cityValue.trim();
    if (cityName === '' || cityName === null) {
        cityNameInput.style.background = '#ffe0b3';
        cityNameInput.value = '';
        cityNameInput.placeholder = 'pole nie może być puste';
        return false;
    }
    if (cityName.match(/^\d+$/)) {
        cityNameInput.style.background = '#ffe0b3';
        cityNameInput.value = '';
        cityNameInput.placeholder = 'nie ma takiego miasta';
        return false;
    }
    return true;
}

function setNotFoundError() {
    cityNameInput.style.background = '#ffe0b3';
    cityNameInput.value = '';
    cityNameInput.placeholder = 'nie ma takiego miasta';
}

//REMOVE MODULE
$btnClose.addEventListener("click", function() {
    this.parentElement.setAttribute('hidden',true);
})

//SHOW SELECTED DAY DETAILS
$daysContent.forEach(day => {
    day.addEventListener('click', function() {
        let dayName = day.firstElementChild.innerText
        let selectedDayWeather = findWeatherByDayName(dayName)
        setMainWeatherModule(selectedDayWeather);
    })
})

function findWeatherByDayName(enteredDayName) {
    for (let index=0; index<dailyForecastFor5Day.length; index++) {
        let currentWeather = dailyForecastFor5Day[index];
        let dayName = currentWeather.day;
        if(enteredDayName === dayName)
            return currentWeather
    } 
}
