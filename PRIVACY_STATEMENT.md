# Privacy Statement - Bruiloft Checklist App

## Korte Privacy Statement

**Laatste update**: December 2024

### Data Verzameling

De Bruiloft Checklist app verzamelt **geen persoonlijke gebruikersgegevens**. Alle informatie die je invoert (zoals je trouwdatum en taken) wordt uitsluitend lokaal op je apparaat opgeslagen.

### Third-Party Services

Deze app maakt gebruik van **Google Firebase Realtime Database** uitsluitend voor het ophalen van standaard taken en app-functionaliteit. Er worden geen persoonlijke gegevens naar Firebase verzonden.

### Lokale Opslag

- Je trouwdatum en persoonlijke taken worden lokaal opgeslagen op je apparaat
- Deze gegevens worden niet gedeeld met derden
- Je kunt de app verwijderen om alle lokale gegevens te wissen

### Contact

Voor vragen over privacy kun je contact opnemen via de app store reviews of de ontwikkelaar contacteren.

---

## App Store Privacy Labels

### Voor iOS App Store Connect:

**Data Collection**: No data collected
**Data Types**: None
**Third-party Services**: Firebase (for app functionality only)

### Voor Google Play Console Data Safety:

**Data sharing**: No data shared with third parties
**Data collection**: No data collected
**Data security**: Data is encrypted in transit (Firebase connection)

---

## Uitgebreide Privacy Statement (indien nodig)

### 1. Welke informatie verzamelen we?

Wij verzamelen geen persoonlijke informatie. De app slaat alleen lokaal op:

- Je gekozen trouwdatum
- Taken die je toevoegt of bewerkt
- App instellingen en voorkeuren

### 2. Hoe gebruiken we deze informatie?

Alle informatie wordt uitsluitend gebruikt voor de functionaliteit van de app op jouw apparaat.

### 3. Delen we informatie met derden?

Nee, we delen geen persoonlijke informatie met derden. Firebase wordt alleen gebruikt voor het ophalen van standaard taken.

### 4. Hoe beschermen we je informatie?

- Alle data blijft lokaal op je apparaat
- Firebase verbindingen zijn versleuteld
- Geen accounts of registratie vereist

### 5. Je rechten

- Je kunt alle data verwijderen door de app te deïnstalleren
- Er zijn geen accounts om te verwijderen
- Geen data om te exporteren (alles is lokaal)

### 6. Contact

Voor vragen over deze privacy statement kun je contact opnemen via de app store waar je de app hebt gedownload.

### 7. Wijzigingen

Deze privacy statement kan worden bijgewerkt. Wijzigingen worden gecommuniceerd via app updates.

---

## Technische Details (voor ontwikkelaars)

### Firebase Gebruik:

- **Service**: Firebase Realtime Database
- **Doel**: Ophalen van standaard taken
- **Data**: Alleen app-functionaliteit data, geen gebruikersdata
- **Verbinding**: HTTPS versleuteld

### Lokale Opslag:

- **Methode**: AsyncStorage (React Native)
- **Locatie**: App sandbox op apparaat
- **Versleuteling**: OS-level beveiliging
- **Toegang**: Alleen door de app zelf

### Permissions:

- **iOS**: Geen speciale permissions vereist
- **Android**: Alleen internet voor Firebase (standaard)
- **Geblokkeerd**: Camera, microfoon, locatie, contacten
