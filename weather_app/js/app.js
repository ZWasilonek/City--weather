const weatherModule = document.querySelector('.module module__weather');
const weatherInfo = document.getElementsByClassName('weather__info');
const weatherCity = document.querySelector('.city');
console.log(weatherCity.children);
const cityName = document.querySelector('.city__name');
let cityNameVal = cityName.innerHTML;
console.log(cityNameVal);


const btnAddWeatherModule = document.querySelector('#add-city');
btnAddWeatherModule.addEventListener('click', function() {
    const addForm = document.querySelector('.module__form');
    let isHidden = addForm.hasAttribute('hidden');
    if (isHidden) addForm.removeAttribute('hidden');
    else addForm.setAttribute('hidden', true);
})

// weatherModule.cloneNode(true);
