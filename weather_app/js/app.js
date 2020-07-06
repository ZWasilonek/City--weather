import {OpenWeatherMap} from './open-weather.js';
import {getCountryName} from './countryCodes.js';

const $body = document.querySelector('body');
const $btnClose = document.querySelector('.btn-remove-module');
const $btnFormClose = document.querySelector('.btn-add-weather-module');
const btnShowForm = document.querySelector('#add-city');
const addForm = document.querySelector('.module__form');
const $leftArrow = document.querySelector('.left__arrow');
const $rigthArrow = document.querySelector('.right__arrow');
const cityNameInput = document.querySelector('#search');

//MAIN WEATHER MODULE
const weatherModule = document.querySelector('.module__weather');
const $hour = document.querySelector('.hour');
const $dayName = document.querySelector('.day__name');
const $cityName = document.querySelector('.city__name');
const $country = document.querySelector('.country');
const $pressure = document.querySelector('.pressure__value');
const $humidity = document.querySelector('.humidity__value');
const $windSpeed = document.querySelector('.wind-speed__value');
const $temperature = document.querySelector('.temperature__value');
const $weatherIcon = document.querySelector('.weather__icon').firstChild;
const $minTemp = document.querySelector('.min__temp');
const $maxTemp = document.querySelector('.max__temp');

//FORECAST WEATHER MODULE SECTION
const $daysContent = document.querySelectorAll('.day-content');

// / const daysWeatherObjArray = [];
// // const dailyForecastFor5Day = [];/
let counter;

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
            let counter;
            const daysWeatherObjArray = [];
            const dailyForecastFor5Day = [];

            getDayWeatherHourlyForecast(weekWeather, daysWeatherObjArray)
            get5DayWeatherObject(daysWeatherObjArray, dailyForecastFor5Day);
            setWeatherModule(dailyForecastFor5Day);
            manageHourlyWeather(daysWeatherObjArray, counter);            
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
    $country.innerHTML = getCountryName(selectedHourWeather.country);
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

function get5DayWeatherObject(daysWeatherObjArray, dailyForecastFor5Day) {
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

//OBJECTS
class DayWeatherHourlyForecast {
    constructor(dailyHourlyForecastArray) {
        this.dailyHourlyForecastArray = dailyHourlyForecastArray;
    }
}

class DayWeather {
    constructor(day, date, hour, city, country, pressure, humidity, windSpeed, temp, iconId) {
        this.day = day;
        this.date = date;
        this.hour = hour;
        this.city = city;
        this.country = country;
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
            else if (id === '511') this.icon = dirIcon+'hail.svg';
        } else if (id.startsWith('6')) {
            if (id === '600' || id === '611' || id === '612' || id === '615' || id === '620') 
                this.icon = dirIcon+'snowy-4.svg';
            else if (id === '601' || id === '613' || id === '616' || id === '621') 
                this.icon = dirIcon+'snowy-5.svg';
            else if (id === '602' || id === '622') this.icon = dirIcon+'snowy-6.svg'
        } else if (id.startsWith('7')) {
            if (id === '781') this.icon = dirIcon+'fog.svg';
            else this.icon = dirIcon+'fog.svg';
        } else if (id === '800') {
            if (this.isItNight) this.icon = dirIcon+'night.svg';
            else this.icon = dirIcon+'clear-day.svg';
        } else if (id.startsWith('8')) {
            if (id === '801') {
                if (this.isItNight()) this.icon = dirIcon+'cloudy-night-1.svg';
                else this.icon = dirIcon+'cloudy-day-1.svg';
            } else if (id === '802') {
                if (this.isItNight()) {
                    this.icon = dirIcon+'cloudy-night-2.svg'
                } else this.icon = dirIcon+'cloudy-day-2.svg';
            } else if (id === '803') {
                if (this.isItNight()) this.icon = dirIcon+'cloudy-night-3.svg';
                else this.icon = dirIcon+'cloudy-day-3.svg';
            } else if (id === '804') this.icon = dirIcon+'cloudy-4.svg';
        }
        return this.icon;
    }

    isItNight() {
        return this.hour === '00:00' || this.hour === '03:00' || this.hour === '21:00';
    }
    // https://openweathermap.org/weather-conditions
}

function getDayWeatherHourlyForecast(weatherForecast, daysWeatherObjArray) {
    let enteredDay = setCurrentDate(weatherForecast).getDate();
    let historyForecast = weatherForecast.list;
    const {city} = weatherForecast;
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
function convertOpenWeatherObjectToDayWeatherObject(openWeatherObjects, cityListInfo) {
    const mainInfo = openWeatherObjects.main;
    let date = new Date(openWeatherObjects.dt_txt);

    let currentDayNum = date.getDay();
    let formattedDate = formatDate(date);
    let hour = formatHourToDisplay(formattedDate);
    let city = cityListInfo.name;
    let country = cityListInfo.country;
    let {pressure} = mainInfo;
    let {humidity} = mainInfo;
    let {speed} = openWeatherObjects.wind;
    let {temp} = mainInfo;
    let {id} = openWeatherObjects.weather[0];
    let dayName = convertDayNumToDayName(currentDayNum);
    let newDayWeather = new DayWeather(dayName,formattedDate,hour,city,country,pressure,humidity,speed,temp,id);

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

//CLOSE ADDING FORM
$btnFormClose.addEventListener('click', function() {
    showAddForm();
})

//ADDING THE NEW MODULE
function getWeatherByCityName(cityName) {
    $body.className += 'loading';
    weather.getWeekForecastByCityName(cityName, (weatherForecast, error)=> {
        if (error.status !== '200') {
            console.error(error.status);
            setNotFoundError();
        } else {
            $leftArrow.setAttribute('hidden', true);
            $rigthArrow.setAttribute('hidden', true);
            let newModule = weatherModule.cloneNode(true);
            document.querySelector('#app').appendChild(newModule);

            //REMOVE MODULE
            newModule.querySelector('.btn--close').addEventListener('click', function () {
                this.parentElement.style.display = 'none';
            });

            let daysWeatherObjArray = [];
            let dailyForecastFor5Day = [];
            getDayWeatherHourlyForecast(weatherForecast, daysWeatherObjArray)
            get5DayWeatherObject(daysWeatherObjArray, dailyForecastFor5Day);
            setWeatherModule(dailyForecastFor5Day);
            manageHourlyWeather(daysWeatherObjArray, counter)
            showAddForm();
            showModule();
        }
        $body.classList.remove('loading');
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
function manageHourlyWeather(daysWeatherObjArray, counter) {
    setArrows();

    function setArrows() {
        let selectedDaysWeather = findHourlyForecastByDayName($dayName.innerHTML);
        let date = selectedDaysWeather[0].date;
        counter = getIndexOfDailyHourlyWeatherArrayByDate(date,selectedDaysWeather);
        manageLeftArrow(counter);
        manageRightArrow(counter,selectedDaysWeather);
    }

    $daysContent.forEach(day => {
        day.addEventListener('click', function() {
            let dayName = day.firstElementChild.innerText;
            let selectedDaysWeather = findHourlyForecastByDayName(dayName)
            setMainWeatherModule(selectedDaysWeather);
            setArrows();
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

    $leftArrow.addEventListener('click', () => {
        let selectedDaysWeather = findHourlyForecastByDayName($dayName.innerHTML);
        if (counter > 0) {
            --counter;
            setMainHTMLTags(selectedDaysWeather,selectedDaysWeather[counter])
        }
        manageLeftArrow(counter);
        manageRightArrow(counter,selectedDaysWeather);
    });

    $rigthArrow.addEventListener('click', () => {
        let selectedDaysWeather = findHourlyForecastByDayName($dayName.innerHTML);
        if (counter < selectedDaysWeather.length-1) {
            ++counter;
            manageLeftArrow(counter);
        }
        manageRightArrow(counter,selectedDaysWeather);
        setMainHTMLTags(selectedDaysWeather,selectedDaysWeather[counter])
    })

    function manageLeftArrow(counter) {
        const $leftArrow = document.querySelector('.left__arrow');
        if (counter === 0) {
            $leftArrow.setAttribute('hidden', true);
        } else {
            $leftArrow.removeAttribute('hidden');
        }
    }

    function manageRightArrow(counter, selectedDaysWeather) {
        const $rigthArrow = document.querySelector('.right__arrow');
        if (counter === selectedDaysWeather.length-1) { 
            $rigthArrow.setAttribute('hidden', true);
        } else {
            $rigthArrow.removeAttribute('hidden');
        }
    }

    function getIndexOfDailyHourlyWeatherArrayByDate(date, dayWeatherHourlyArray) {
        for (let index=0; index<dayWeatherHourlyArray.length; index++) {
            let currentWeather = dayWeatherHourlyArray[index];
            let dateOfDayWeather = currentWeather.date;
            if(dateOfDayWeather === date) {
                return index;
            }
        }
    }
}