<img src="http://coderslab.pl/img/coderslab-logo.png" align="right" width="400"/>

# Projekt

## Przygotowanie
> Zmodyfikuj plik `webpack.config.js` tak, aby:
> - zmienna `entryPath` wskazywała na `1_Zadania/Tydzien_1_Dzien_6_2/1_Projekt`
> - zmienna `entryFile` wskazywała na plik, nad którym aktualnie pracujesz, np. `app.js`
>
> **Pamiętaj aby po każdej zmianie w pliku `webpack.config.js` przerwać działanie Webpacka (`CTRL+C`) a następnie włączyć go z powrotem (`npm start`).**

Celem warsztatu, jest przygotowanie aplikacji pogodowej, pozyskującej dane z ogólnodostępnych API. Pierwszym krokiem powinno być zapoznanie się ze strukturą projektu, układem plików, dokumentacjami API a także plikiem HTML.

![](screenshot.png)

### Struktura projektu:

```
css
  -- style.css (plik ze stylami)
js
  app.js (plik główny)

images
  -- icons (ikony dla projektu)

index.html (plik główny aplikacji)
```



## Założenia
W aplikacji powinniśmy mieć możliwość odnalezienia współrzędnych konkretnego miejsca i na podstawie tych danych, wyświetlić aktualną i prognozowaną pogodę. Chcemy wyświetlać wszystkie niezbędne informacje:

- Aktualna temperatura
- Wilgotność
- Ciśnienie
- Prędkość wiatru
- Prognoza pogody na 5 dni w przód


W warsztacie tym należy korzystać z wszystkich udogodnień ES6, takich jak deklaracje zmiennych przez `const`, `let`, klasowość `class`, funkcje strzałkowe, `import/export`, `async/await`, `fetch` itd.

## Zasady działania

### Wejście na stronę
Po wejściu na stronę, powinniśmy wysłać zapytanie do api `IPLocating` aby pobrać aktualną lokalizację ze względu na nasz adres IP. Jeżeli się uda, to należy wysłać kolejne zapytanie ale tym razem do serwisu `DarkSky` aby pobrać aktualną pogodę i wyświetlić ją użytkownikowi.

![](weather-app-1.gif)


### Dodanie nowego miasta
Na stronie znajduje się przycisk "Dodaj miasto". Po jego kliknięciu, powinniśmy wyświetlić ukryta sekcję z formularzem. Po wpisaniu przez użytkownika miasta czy całego adresu, należy wykonać zapytania do `GeoLocating` API aby pobrać długość i szerokość geograficzną. Jeżeli się to uda, należy wysłać kolejne zapytanie ale tym razem do serwisu `DarkSky` aby pobrać aktualną pogodę i wyświetlić ją użytkownikowi. Po pobraniu danych, formularz powinien zniknąć.

![](weather-app-2.gif)


### Ukrywanie/Usuwanie modułu
Po kliknięciu w przycisk "x" w prawym górnym rogu każdego modułu, powinniśmy go ukryć. Jeżeli jest to moduł pogodowy, możemy go usunąć ze struktury HTML.

![](weather-app-3.gif)


## Przydatne informacje

### CORS
Niektóre z serwisów API (DarkSky) korzystają z [CORS](https://www.codecademy.com/articles/what-is-cors), które uniemożliwia nam wysłanie zapytania kiedy jesteśmy na nieszyfrowanym `localhost`. Aby to ominąć, musimy posłużyć się:

``` 
https://cors-anywhere.herokuapp.com/
```

Adres ten, należy umieścić przed całym adresem URL do którego chcemy się dostać. Np.

```
https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/123-456-789/17.123,52.312?units=si&lang=pl
```

### Efekt ładowania strony
Wystarczy, że dodacie do elementu `body` klasę `loading` a pojawi się na całym ekranie spinner który możecie zauważyć na nagraniach wyżej. Aby się go pozbyć, wystarczy usunąć klasę `loading` z elementu `body`.


### Ikony
W projekcie mamy zainstalowane ikony pogodowe które znajdziecie w folderze `images/icons`.  

Dodatkowo możecie używać ikon Material-Icons. Listę tych ikon możecie znaleźć tutaj: https://material.io/tools/icons.  
Używamy ich za pomocą:

```html
<i class="material-icons">nazwa_ikony</i>
```

## API

### IPLocating
Serwis http://ip-api.com/ pozwala na uzyskanie aktualnej lokalizacji na podstawie naszego adresu IP. Co ciekawe sami nie musimy go znać. Wystarczy wysłać zapytanie `GET` pod `http://ip-api.com/json/` a w odpowiedzi dostaniemy obiekt `JSON` danymi o naszej lokalizacji. 

```json
{
  "query": "84.258.81.242",
  "status": "success",
  "country": "Poland",
  "countryCode": "PL",
  "region": "WP",
  "regionName": "Greater Poland",
  "city": "Ostrów Wielkopolski",
  "zip": "63-400",
  "lat": 51.6468,
  "lon": 17.8108,
  "timezone": "Europe/Warsaw",
  "isp": "Przedsiebiorstwo Promax Sp. J.",
  "org": "",
  "as": "PROMAX"
}
```


### GeoLocating
**Wymagany jest klucz API.**

API to pozwala nam wyciągnąć informację o szerokości i długości geograficznej na podstawie wpisanego parametru, np. "Wrocław". Dostaniemy wtedy zwrot informacji który widzisz poniżej. 

Należy się zarejestrować, a następnie w zakładce "Api Keys" wygenerować swój klucz i zapisać go w projekcie.

[GraphHopper Directions API with Route Optimization](https://graphhopper.com)  
Pobranie lokalizacji dla konkretnego adresu: https://graphhopper.com/api/1/geocode?key=wasz_klucz&q=wroclaw

Pod wartość `wroclaw` podstawiamy to co użytkownik wpisał w polu tekstowym naszej aplikacji. 

Response:
```json
{
    "hits": [
        {
            "osm_id": 2805690,
            "osm_type": "R",
            "extent": [
                16.8073393,
                51.2100604,
                17.1762192,
                51.0426686
            ],
            "country": "Poland",
            "osm_key": "place",
            "osm_value": "city",
            "name": "Wroclaw",
            "state": "Lower Silesian Voivodeship",
            "point": {
                "lng": 17.0326689,
                "lat": 51.1089776
            }
        }
	  ]
}
```

### Darksky
**Wymagany jest klucz API.**

API odpowiedzialne za dostarczenie nam aktualnej i prognozowanej pogody.

Należy się zarejestrować, wygenerować swój klucz i zapisać go w projekcie.

Pobranie klucza: https://darksky.net/dev  
Pobranie prognozy pogody: https://api.darksky.net/forecast/key/latitude,longitude?units=si&lang=pl

- Pod wartość `key` podstawiamy nasz klucz wygenerowany przez DarkSky
- Pod wartość `latitude` podstawiamy wartość `lat` pobraną z GraphHopper czy IP-API
- Pod wartość `longitude` podstawiamy wartość `lng` pobraną z GraphHopper czy IP-API


