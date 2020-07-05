import {OpenWeatherMap} from './open-weather.js'

const $body = document.querySelector('body');
let $btnClose = document.querySelector('.btn-remove-module');
const btnShowForm = document.querySelector('#add-city');
const addForm = document.querySelector('.module__form');

let cityNameInput = document.querySelector('#search');

//MAIN WEATHER MODULE
const weatherModule = document.querySelector('.module__weather');
const $hour = document.querySelector('.hour');
const $dayName = document.querySelector('.day__name');
const $cityName = document.querySelector('.city__name');
const $pressure = document.querySelector('.pressure__value');
const $humidity = document.querySelector('.humidity__value');
const $windSpeed = document.querySelector('.wind-speed__value');
const $temperature = document.querySelector('.temperature__value');
const $weatherIcon = document.querySelector('.weather__icon').firstChild;
const $minTemp = document.querySelector('.min__temp');
const $maxTemp = document.querySelector('.max__temp');

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
    setMainWeatherModule(daysWeatherForecastArr);
    setForcastForNextDays(daysWeatherForecastArr);
}

function setMainWeatherModule(daysWeatherForecastArr) {
    let currentDayWeather = daysWeatherForecastArr[0];
    setMainHTMLTags(daysWeatherForecastArr, currentDayWeather);
}

function setMainHTMLTags(daysWeatherForecastArr, selectedHourWeather) {
    $hour.innerHTML = selectedHourWeather.hour;
    $dayName.innerHTML = selectedHourWeather.day;
    $cityName.innerHTML = selectedHourWeather.city;
    $pressure.innerHTML = selectedHourWeather.pressure;
    $humidity.innerHTML = selectedHourWeather.humidity;
    $windSpeed.innerHTML = selectedHourWeather.windSpeed;
    $temperature.innerHTML = selectedHourWeather.temp;
    $weatherIcon.src = selectedHourWeather.icon;
    $maxTemp.innerHTML = getMaxTemp(daysWeatherForecastArr);
    $minTemp.innerHTML = getMinTemp(daysWeatherForecastArr);
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
    constructor(day, date, hour, city, pressure, humidity, windSpeed, temp, iconId) {
        this.day = day;
        this.date = date;
        this.hour = hour;
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
            let hourlyWeatherArray = new DayWeatherHourlyForecast(daysWeatherWithSameDate);
            daysWeatherObjArray.push(hourlyWeatherArray);
        }
    }
}


//CONVERTERS
function convertOpenWeatherObjectToDayWeatherObject(openWeatherObjects, cityName) {
    const mainInfo = openWeatherObjects.main;
    let date = new Date(openWeatherObjects.dt_txt);

    let currentDayNum = date.getDay();
    let formattedDate = formatDate(date);
    let hour = formatHourToDisplay(formattedDate);
    let {pressure} = mainInfo;
    let {humidity} = mainInfo;
    let {speed} = openWeatherObjects.wind;
    let {temp} = mainInfo;
    let {id} = openWeatherObjects.weather[0];
    let dayName = convertDayNumToDayName(currentDayNum);
    let newDayWeather = new DayWeather(dayName,formattedDate,hour,cityName,pressure,humidity,speed,temp,id);

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

//TEMPERATURE AMPLITUDE 
function getMaxTemp(dailyHourlyForecastArray) {
    let tempArray = getTempArr(dailyHourlyForecastArray);
    let maxTemp = Math.max(...tempArray);
    return maxTemp;
}

function getMinTemp(dailyHourlyForecastArray) {
    let tempArray = getTempArr(dailyHourlyForecastArray);
    let minTemp = Math.min(...tempArray);
    return minTemp;
}

function getTempArr(dailyHourlyForecastArray) {
    let tempArray = [];
    for (let i=0; i<dailyHourlyForecastArray.length; i++) {
        let currentWeather = dailyHourlyForecastArray[i];
        tempArray.push(currentWeather.temp);
    }
    return tempArray;
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

function formatHourToDisplay(date) {
    let timeFragment = date.slice(11, 16);
    return timeFragment;
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
        let dayName = day.firstElementChild.innerText;
        let selectedDaysWeather = findHourlyForecastByDayName(dayName)
        setMainWeatherModule(selectedDaysWeather);
        manageRightArrow(canScrollRight=true);
        manageLeftArrow(canScrollLeft = false);
    })
})

function findHourlyForecastByDayName(enteredDayName) {
    const daysWeatherArray = [];
    let daysArrayByDayName;
    for (let index=0; index<daysWeatherObjArray.length; index++) {
        daysArrayByDayName = daysWeatherObjArray[index].dailyHourlyForecastArray;
        if (daysArrayByDayName[index].day === enteredDayName) {
            for (let j=0; j<daysArrayByDayName.length; j++) {
                let currentWeather = daysArrayByDayName[j];
                daysWeatherArray.push(currentWeather);
            }
            break;
        }
    } 
    return daysWeatherArray;
}

const $leftArrow = document.querySelector('.left__arrow');
const $rigthArrow = document.querySelector('.right__arrow');

let counter = 0
let canScrollRight = true;
let canScrollLeft = false;

manageLeftArrow(canScrollLeft);

$leftArrow.addEventListener('click', () => {
    let selectedDaysWeather = findHourlyForecastByDayName($dayName.innerHTML);
    if (counter > 0) {
        canScrollLeft = true;
        manageRightArrow(canScrollRight = true);
        --counter;
        setMainHTMLTags(selectedDaysWeather,selectedDaysWeather[counter])
    } else {
        canScrollLeft = false;
    }
    if (counter === 0) 
        manageLeftArrow(canScrollLeft = false);
});

$rigthArrow.addEventListener('click', () => {
    let selectedDaysWeather = findHourlyForecastByDayName($dayName.innerHTML);
    if (counter < selectedDaysWeather.length-1) {
        ++counter;
        if (counter === selectedDaysWeather.length-1) 
            manageRightArrow(canScrollRight = false);
        else manageRightArrow(canScrollRight = true);
        canScrollRight = true;
        manageLeftArrow(canScrollLeft = true);
        setMainHTMLTags(selectedDaysWeather,selectedDaysWeather[counter])
    } else {
        canScrollRight = false;
    }
})

function manageLeftArrow(canScrollLeft) {
    if (canScrollLeft) {
        $leftArrow.removeAttribute('hidden');
    } else {
        $leftArrow.setAttribute('hidden', true);
    }
}

function manageRightArrow(canScrollRight) {
    if (canScrollRight) {
        $rigthArrow.removeAttribute('hidden');
    } else {
        $rigthArrow.setAttribute('hidden', true);
    }
}