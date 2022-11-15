# Piggy

Celem pracy było zaprojektowanie i zbudowanie aplikacji pomagającej w oszczędzaniu.

Aplikacja może być przydatna dla osób, które chciałyby zakupić wybrany przez siebie produkt i oczekują pomocy w zarządzeniu budżetem. Pomoże również w zakupie droższych produktów, poprzez podzielenie ich na wygodne raty.

Aby korzystać z aplikacji, użytkownik musi utworzyć konto. Po utworzeniu konta i zalogowaniu, użytkownik dodaje nowy produkt na który chce oszczędzać. W Formularzu podaje dane odnośnie produktu takie jak:  

- Nazwa produktu
- Cena produktu
- Czas planowanego zakupu

W odpowiedzi serwer zwróci ile dziennie powinien odkładać i będzie nadzorował czy kwota ta jest odkładana. Dzienna rata może zmieniać się w zależności od odkładanej kwoty. Jeżeli użytkownik pewnego dnia odłoży mniejszą kwotę niż jest wymagana, liczba do odłożenia w następne dni powiększy się. Jeżeli użytkownik odda więcej niż dzienna wartość raty, będzie odkładać mniej w kolejnych dniach. Użytkownik będzie mógł oszczędzać na wiele produktów naraz, a także przeglądać historie swoich zakupów.

## Diagram ERD Bazy danych

![Diagram ERD](./Diagram%20ERD.png)

## Instalacja

aby zainstalować program należy pobrać repozytorium, a następnie w folderze ``Piggy/Serwer`` uruchomić:

```
npm install
```

następnie aby uruchomić serwer w wersji deweloperskiej należy wpisać:

```
npm start
```
