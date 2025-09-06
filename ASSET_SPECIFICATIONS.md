# Asset Specificaties voor Bruiloft Checklist App

## App Icons

### iOS App Store Icon

- **Afmetingen**: 1024x1024 pixels
- **Formaat**: PNG (geen transparantie toegestaan)
- **Kleurdiepte**: 24-bit RGB of 32-bit RGBA
- **Bestandsgrootte**: Max 1MB
- **Design vereisten**:
  - Geen transparante achtergrond
  - Geen tekst in het icon (wordt vaak onleesbaar)
  - Herkenbaar op kleine formaten (20x20px)
  - Consistent met app branding (#DA6F57 kleurenschema)

### Android Play Store Icon

- **Afmetingen**: 512x512 pixels
- **Formaat**: PNG (transparantie toegestaan)
- **Kleurdiepte**: 32-bit RGBA aanbevolen
- **Bestandsgrootte**: Max 1MB
- **Design vereisten**:
  - Kan transparante elementen bevatten
  - Werkt goed met adaptive icon system
  - Herkenbaar op verschillende achtergronden
  - Consistent met app branding (#DA6F57 kleurenschema)

### Android Adaptive Icon (Aanvullend)

- **Foreground**: 512x512 pixels PNG
- **Background**: Effen kleur (#FFF9F6) of 512x512 pixels PNG
- **Safe zone**: Houd belangrijke elementen binnen 264x264 pixels centrum
- **Design vereisten**:
  - Foreground kan transparantie hebben
  - Background vult hele 512x512 area
  - Icon werkt in verschillende vormen (cirkel, vierkant, rounded square)

## Design Guidelines voor Icons

### Kleurenschema (uit colortheme.txt):

- **Primair**: #DA6F57 (buttons/accent)
- **Achtergrond 1**: #FFF9F6 (lichte achtergrond)
- **Achtergrond 2**: #FFFFFF (wit)
- **Achtergrond 3**: #F7F9FC (details)
- **Tekst**: #333333 (donkergrijs)

### Stijl Aanbevelingen:

- Gebruik het Girls of Honour logo als basis
- Integreer bruiloft/checklist elementen subtiel
- Houd het simpel en herkenbaar
- Test op verschillende schermformaten
- Zorg voor goede contrast

### Technische Vereisten:

- **Geen** gradients die niet goed schalen
- **Geen** dunne lijnen (< 2px op 1024x1024)
- **Geen** kleine tekst
- **Wel** duidelijke vormen en contrasten
- **Wel** consistent met app's visuele identiteit

## Bestandsnamen:

- iOS: `app-icon-ios-1024x1024.png`
- Android: `app-icon-android-512x512.png`
- Android Adaptive Foreground: `adaptive-icon-foreground-512x512.png`

## iOS App Store Screenshots

### iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max)

- **Afmetingen**: 1290x2796 pixels (portrait)
- **Formaat**: PNG of JPEG (PNG aanbevolen)
- **Aantal**: 3-10 screenshots (minimum 3 aanbevolen)
- **Bestandsgrootte**: Max 8MB per screenshot

### iPhone 6.5" (iPhone 11 Pro Max, 12 Pro Max, 13 Pro Max)

- **Afmetingen**: 1242x2688 pixels (portrait)
- **Formaat**: PNG of JPEG (PNG aanbevolen)
- **Aantal**: 3-10 screenshots (optioneel, maar aanbevolen voor compatibility)
- **Bestandsgrootte**: Max 8MB per screenshot

### Screenshot Content Vereisten:

#### Screenshot 1: Hoofdscherm/Checklist Overzicht

- **Toon**: De hoofdchecklist met verschillende categorieën
- **Highlight**: Duidelijke maandindeling en voortgang
- **Status**: Mix van completed/uncompleted taken voor realisme
- **Datum**: Toon een realistische trouwdatum (bijv. 6 maanden vooruit)

#### Screenshot 2: Taak Details/Interactie

- **Toon**: Een taak die wordt afgevinkt of bewerkt
- **Highlight**: Datum functionaliteit en taak management
- **Interactie**: Toon de gebruiksvriendelijke interface
- **Features**: Deadline toevoegen, taak bewerken functionaliteit

#### Screenshot 3: App in Actie/Overzicht

- **Toon**: Volledig ingevulde checklist of settings scherm
- **Highlight**: App's volledigheid en professionaliteit
- **Context**: Laat zien hoe de app helpt bij bruiloft planning

### Design Guidelines voor Screenshots:

- **Gebruik realistische data** (geen "Lorem ipsum" of test data)
- **Toon de app in gebruik** (niet lege schermen)
- **Consistent kleurenschema** met app branding
- **Nederlandse tekst** (target audience)
- **Goede belichting** en contrast
- **Geen persoonlijke informatie** in screenshots

### Technische Vereisten:

- **Status bar**: Toon een schone status bar (vol batterij, goede signaal)
- **Tijd**: Gebruik een neutrale tijd (bijv. 9:41 AM)
- **Notificaties**: Geen notificatie badges of pop-ups
- **Orientatie**: Portrait mode alleen
- **Kwaliteit**: Retina kwaliteit, scherpe tekst

## Bestandsnamen:

- `ios-screenshot-1-main-1290x2796.png`
- `ios-screenshot-2-interaction-1290x2796.png`
- `ios-screenshot-3-overview-1290x2796.png`
- `ios-screenshot-1-main-1242x2688.png` (optioneel)
- `ios-screenshot-2-interaction-1242x2688.png` (optioneel)
- `ios-screenshot-3-overview-1242x2688.png` (optioneel)

## Google Play Store Screenshots

### Android Phone Screenshots

- **Afmetingen**: Minimum 1080x1920 pixels (portrait)
- **Aanbevolen**: 1080x2340 pixels (moderne Android phones)
- **Formaat**: PNG of JPEG (PNG aanbevolen voor kwaliteit)
- **Aantal**: 2-8 screenshots (minimum 2, aanbevolen 3-4)
- **Bestandsgrootte**: Max 8MB per screenshot
- **Aspect ratio**: 16:9 tot 19.5:9

### Screenshot Content Vereisten:

#### Screenshot 1: Hoofdscherm/Checklist Overzicht

- **Toon**: De hoofdchecklist met verschillende maanden/categorieën
- **Highlight**: Duidelijke organisatie en overzicht
- **Status**: Realistische mix van completed/uncompleted taken
- **UI**: Android Material Design elementen zichtbaar

#### Screenshot 2: Taak Interactie/Management

- **Toon**: Taak wordt afgevinkt, bewerkt of datum toegevoegd
- **Highlight**: Gebruiksvriendelijke interactie
- **Features**: Datum picker, taak editing, checkbox interactie
- **Context**: Laat zien hoe makkelijk de app te gebruiken is

#### Screenshot 3: App Functionaliteit (Optioneel)

- **Toon**: Settings, datum instelling, of volledig overzicht
- **Highlight**: Volledigheid van de app
- **Professional**: Laat zien dat de app compleet en betrouwbaar is

### Android Specific Guidelines:

- **Material Design**: Zorg dat Android UI elementen goed zichtbaar zijn
- **Navigation**: Toon Android navigation patterns
- **Adaptive**: Screenshots moeten goed werken op verschillende schermformaten
- **Status bar**: Android status bar styling
- **Back button**: Respecteer Android navigation patterns

### Design Guidelines voor Android Screenshots:

- **Realistische data** (Nederlandse tekst en realistische trouwdata)
- **Consistent branding** met app kleuren
- **Goede contrast** en leesbaarheid
- **Geen persoonlijke informatie**
- **Professional appearance**

### Technische Vereisten:

- **Status bar**: Schone Android status bar
- **Tijd**: Neutrale tijd weergave
- **Batterij**: Volle batterij indicator
- **Signaal**: Goede signaal sterkte
- **Notificaties**: Geen storende notificaties
- **Orientatie**: Portrait mode

## Bestandsnamen:

- `android-screenshot-1-main-1080x2340.png`
- `android-screenshot-2-interaction-1080x2340.png`
- `android-screenshot-3-overview-1080x2340.png` (optioneel)

## Google Play Store Feature Graphic

### Feature Graphic Specificaties

- **Afmetingen**: 1024x500 pixels (exact)
- **Formaat**: PNG of JPEG (PNG aanbevolen)
- **Bestandsgrootte**: Max 1MB
- **Aspect ratio**: Exact 2.048:1 (1024:500)
- **Kleurdiepte**: 24-bit RGB minimum

### Design Vereisten:

#### Content Guidelines:

- **App naam**: "Bruiloft Checklist" prominent zichtbaar
- **Tagline**: Korte beschrijving zoals "Organiseer je perfecte bruiloft"
- **Visual elements**: Bruiloft/checklist gerelateerde graphics
- **Branding**: Girls of Honour logo indien gewenst
- **Call-to-action**: Subtiel, zoals "Download nu" (optioneel)

#### Kleurenschema (uit colortheme.txt):

- **Primair**: #DA6F57 (accent kleur)
- **Achtergrond**: #FFF9F6 of #FFFFFF
- **Details**: #F7F9FC voor subtiele elementen
- **Tekst**: #333333 voor leesbaarheid
- **Contrast**: Zorg voor goede leesbaarheid op alle devices

#### Visual Style:

- **Modern en clean** design
- **Bruiloft thema**: Subtiele bruiloft elementen (ringen, bloemen, checklist items)
- **Professional**: Geen amateur graphics
- **Readable**: Tekst moet leesbaar zijn op kleine schermen
- **Consistent**: Met app icon en overall branding

### Layout Aanbevelingen:

- **Links**: App icon of logo
- **Centrum**: App naam en tagline
- **Rechts**: Visual elements of screenshot preview
- **Background**: Gradient of pattern met brand kleuren
- **Typography**: Duidelijke, moderne fonts

### Technische Vereisten:

- **Geen transparantie** (wordt niet ondersteund)
- **RGB kleurruimte** (geen CMYK)
- **Hoge resolutie** voor scherpe weergave
- **Geen tekst kleiner dan 12pt** equivalent
- **Safe margins**: Houd belangrijke elementen 50px van de randen

### Content Restricties:

- **Geen misleidende claims**
- **Geen screenshots** van andere apps
- **Geen contact informatie** (email, telefoon)
- **Geen prijsinformatie** (gratis apps)
- **Geen "Download" buttons** (Google voegt deze toe)

### Inspiratie Elementen:

- Checklist items met vinkjes
- Elegante bruiloft iconen
- Kalender/datum elementen
- Moderne typografie
- Zachte gradients in brand kleuren

## Bestandsnaam:

- `google-play-feature-graphic-1024x500.png`

### Design Brief voor Klant:

"Creëer een moderne, elegante feature graphic die de app positioneert als dé bruiloft planning tool. Gebruik de brand kleuren, integreer subtiele bruiloft elementen, en zorg dat 'Bruiloft Checklist' duidelijk leesbaar is. De graphic moet professioneel ogen en vertrouwen wekken bij potentiële gebruikers."

## Splash Screen Specificaties

### iOS Splash Screen

- **Afmetingen**: 1170x2532 pixels (iPhone X en nieuwer)
- **Alternatief**: 1125x2436 pixels (iPhone X, XS)
- **Formaat**: PNG (transparantie toegestaan)
- **Achtergrond**: #FFF9F6 (zoals geconfigureerd in app.json)
- **Bestandsgrootte**: Max 1MB

### Android Splash Screen

- **Afmetingen**: 1080x1920 pixels (basis)
- **Hoge resolutie**: 1440x2560 pixels (voor xxhdpi)
- **Formaat**: PNG (transparantie toegestaan)
- **Achtergrond**: #FFF9F6 (consistent met iOS)
- **Bestandsgrootte**: Max 1MB per variant

### Design Specificaties:

#### Logo/Image Element:

- **Bron**: Girls of Honour logo (zoals nu gebruikt)
- **Afmetingen**: 200px breed (zoals geconfigureerd)
- **Positie**: Gecentreerd
- **Resize mode**: Contain (behoudt aspect ratio)
- **Kleur**: Originele logo kleuren

#### Achtergrond:

- **Kleur**: #FFF9F6 (brand achtergrond kleur 1)
- **Style**: Effen kleur (geen gradients voor splash screen)
- **Consistent**: Met app's algemene kleurenschema

#### Layout Guidelines:

- **Minimalistisch**: Alleen logo, geen extra tekst
- **Gecentreerd**: Logo perfect gecentreerd op scherm
- **Breathing room**: Voldoende witruimte rondom logo
- **Fast loading**: Simpel design voor snelle laadtijd

### Technische Vereisten:

#### iOS Specifiek:

- **Launch Screen**: Werkt met iOS Launch Screen systeem
- **Adaptive**: Werkt op alle iPhone schermformaten
- **Performance**: Optimaal voor snelle app launch
- **Consistency**: Matcht met app's eerste scherm

#### Android Specifiek:

- **Adaptive**: Werkt met Android's adaptive splash system
- **Multiple densities**: Verschillende resoluties voor verschillende devices
- **Material Design**: Consistent met Android design principles
- **Performance**: Geoptimaliseerd voor Android launch sequence

### Bestandsnamen:

- `ios-splash-screen-1170x2532.png`
- `android-splash-screen-1080x1920.png`
- `android-splash-screen-1440x2560.png` (xxhdpi variant)

### Huidige Configuratie:

De splash screen is al geconfigureerd in `app.json`:

```json
{
  "image": "./assets/images/GirlsofhonourLogo.png",
  "imageWidth": 200,
  "resizeMode": "contain",
  "backgroundColor": "#FFF9F6"
}
```

### Actie Vereist:

- **Controleer**: Of het huidige Girls of Honour logo geschikt is voor splash screen
- **Optimaliseer**: Logo voor verschillende schermformaten indien nodig
- **Test**: Splash screen op verschillende devices
- **Backup**: Zorg voor fallback als logo niet optimaal is

### Design Brief voor Klant:

"De splash screen gebruikt het bestaande Girls of Honour logo op een zachte achtergrond (#FFF9F6). Controleer of het logo scherp en professioneel oogt op verschillende schermformaten. Indien nodig, lever een geoptimaliseerde versie aan die goed werkt als splash screen element."
