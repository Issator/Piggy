# Piggy

Celem pracy było zaprojektowanie i zbudowanie aplikacji pomagającej w oszczędzaniu.

Aplikacja może być przydatna dla osób, które chciałyby zakupić wybrany przez siebie produkt i oczekują pomocy w zarządzeniu budżetem. Pomoże również w zakupie droższych produktów, poprzez podzielenie ich na wygodne raty.

Aby korzystać z aplikacji, użytkownik musi utworzyć konto. Po utworzeniu konta i zalogowaniu, użytkownik dodaje nowy produkt na który chce oszczędzać. W Formularzu podaje dane odnośnie produktu na jaki takie jak:  

- Nazwa produktu
- Cena produktu
- Czas planowanego zakupu

W odpowiedzi serwer zwróci ile dziennie powinien odkładać i będzie nadzorował czy kwota ta jest odkładana. Dzienna rata może zmienić się w zależności od odkładanej kwoty. Jeżeli użytkownik pewnego dnia odłoży mniejszą kwotę niż jest wymagana, liczba do odłożenia w następne dni powiększy się. Jeżeli użytkownik odda więcej niż dzienna wartość raty, będzie odkładać mniej w kolejnych dniach. Użytkownik będzie mógł oszczędzać na wiele produktów naraz, a także przeglądać historie swoich zakupów.

## Diagram ERD Bazy danych

![Diagram ERD](./Diagram%20ERD.png)

## Diagram Przypadków Użycia

![Diagram Przypadków użycia](./Diagram%20PU.png)

## Instalacja

<b>Uwaga!</b> Do uruchomienia aplikacji wymagany jest nodeJS w wersji 16.14.2. lub nowszej! 
<br/>
Aby zainstalować program należy pobrać repozytorium, a następnie w folderze ``Piggy/Serwer`` uruchomić:

```
npm install
```

Następnie w pliku ``.env/mongo.js`` powinien zostać podany klucz dostępu do bazy danych mongoDB. Aby uruchomić serwer w wersji deweloperskiej należy wpisać do konsoli komendę:

```
npm start
```

W celu uruchomienia testów jednostkowych dostępna jest komenda:
```
npm test
```

Jeżeli serwer zostanie uruchomiony oraz pomyślnie połączy się z bazą danych zostanie wyświetlony komunikat:

```
Mongo connected!
Listening on port 4200
```

Po poprawnym uruchomieniu serwera można przejść do klienta aplikacji. Należy wejść do folderu ``Piggy/Client`` gdzie, aby zainstalować wymagane moduły a następnie uruchomić program, należy wpisać komendy:

```
npm install
npm start
```

