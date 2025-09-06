# Android Build Configuratie voor Bruiloft Checklist

## Huidige Android Configuratie (app.json)

### Package Name

- **Productie**: `com.superabraham.bruiloftchecklist`
- **Consistent**: Gebruikt in alle build profielen

### Build Settings

- **Version Code**: Automatisch increment via EAS
- **Version Name**: 1.0.0 (eerste release)
- **Target SDK**: Latest (via Expo SDK 53)
- **Min SDK**: 21 (Android 5.0+)

### Permissions & Security

- **Permissions**: Minimaal (geen onnodige permissions)
- **Blocked Permissions**: Camera, microfoon, locatie
- **Internet**: Alleen voor Firebase (default toegestaan)
- **Storage**: AsyncStorage (geen external storage)

### Adaptive Icon

- **Foreground**: ./assets/images/adaptive-icon.png
- **Background**: #ffffff (wit)
- **Safe Zone**: Belangrijk voor verschillende launcher shapes

## EAS Build Configuratie

### Production Build

```json
{
  "resourceClass": "medium",
  "buildType": "apk",
  "gradleCommand": ":app:assembleRelease"
}
```

### Build Commands

```bash
# Production build maken
eas build --platform android --profile production

# Build status checken
eas build:list --platform android

# Build downloaden (voor lokale testing)
eas build:download [build-id]
```

## Pre-Build Checklist

### Vereisten:

- [ ] Google Play Developer Account actief ($25 eenmalig)
- [ ] Package name gereserveerd in Play Console
- [ ] Play Console app aangemaakt
- [ ] Upload key via EAS (automatisch)
- [ ] App icons geüpload naar assets/images/

### Configuratie Verificatie:

- [ ] Package name correct: `com.superabraham.bruiloftchecklist`
- [ ] App naam correct: "Bruiloft Checklist"
- [ ] Version code en name ingesteld
- [ ] Firebase configuratie werkend
- [ ] Adaptive icon correct geconfigureerd
- [ ] Permissions minimaal

## Build Process

### Stap 1: Lokale Test

```bash
# Lokaal testen voor Android
npm run android
# of
expo start --android
```

### Stap 2: Preview Build (Optioneel)

```bash
# Preview build voor testing
eas build --platform android --profile preview
```

### Stap 3: Production Build

```bash
# Production build voor Play Store
eas build --platform android --profile production
```

### Stap 4: Submit naar Play Store

```bash
# Automatisch submitten (na configuratie)
eas submit --platform android --profile production

# Of handmatig via Play Console
```

## Google Play Console Setup

### App Bundle vs APK

- **Huidige configuratie**: APK (assembleRelease)
- **Aanbeveling**: Overweeg App Bundle voor betere optimalisatie
- **Play Store**: Accepteert beide formaten

### Upload Process:

1. **Upload**: Build naar Play Console
2. **Review**: Google's automated review (meestal binnen uren)
3. **Testing**: Internal testing track eerst
4. **Production**: Na testing naar production track
5. **Release**: Geleidelijke uitrol mogelijk

## Metadata Configuratie

### Play Store Listing:

- **App naam**: "Bruiloft Checklist"
- **Korte beschrijving**: "Organiseer je perfecte bruiloft"
- **Volledige beschrijving**: Nederlandse beschrijving
- **Categorie**: Lifestyle
- **Content rating**: Everyone (geen gevoelige content)
- **Target audience**: 18+ (bruiloft planning)

### Data Safety (Belangrijk!):

- **Data collection**: "No data collected"
- **Data sharing**: "No data shared with third parties"
- **Data security**: "Data is encrypted in transit"
- **Firebase**: Vermeld als third-party service

## Performance Optimalisatie

### Build Optimalisaties:

- **Hermes Engine**: Enabled voor betere performance
- **ProGuard**: Automatische code obfuscation
- **Asset Optimization**: Automatische resource optimization
- **Bundle Size**: Minimaal door blocked permissions

### Android Specific:

- **Material Design**: Native Android UI components
- **Adaptive Icons**: Werkt met alle launcher styles
- **Dark Mode**: Automatisch via userInterfaceStyle
- **Gesture Navigation**: Compatible met Android 10+ gestures

## Troubleshooting

### Veelvoorkomende Issues:

1. **Signing Issues**: EAS handelt key management af
2. **Package Name Conflicts**: Zorg dat package name uniek is
3. **Permission Issues**: Check blocked permissions lijst
4. **Build Failures**: Check Gradle logs via EAS

### Debug Commands:

```bash
# Build logs bekijken
eas build:view [build-id]

# Build lijst
eas build:list --platform android --limit 10

# Project credentials
eas credentials --platform android
```

## Google Play Policies

### Compliance Checklist:

- [ ] **Target API Level**: Latest (automatisch via Expo)
- [ ] **64-bit Support**: Included (via React Native)
- [ ] **App Bundle**: Overweeg voor optimalisatie
- [ ] **Privacy Policy**: Niet vereist (geen data collection)
- [ ] **Permissions**: Minimaal en gerechtvaardigd
- [ ] **Content Rating**: Correct ingesteld

### Store Listing Requirements:

- [ ] **Screenshots**: Minimaal 2, maximaal 8
- [ ] **Feature Graphic**: 1024x500px (verplicht)
- [ ] **App Icon**: 512x512px
- [ ] **Descriptions**: Nederlandse tekst
- [ ] **Category**: Lifestyle
- [ ] **Content Rating**: Everyone

## Testing Strategy

### Pre-Release Testing:

1. **Internal Testing**: Upload naar internal track
2. **Device Testing**: Test op verschillende Android versies
3. **Performance**: Check memory usage en battery drain
4. **Offline**: Verify offline functionality
5. **Firebase**: Test Firebase connectivity

### Release Tracks:

- **Internal**: Voor team testing
- **Alpha**: Voor uitgebreide testing (optioneel)
- **Beta**: Voor public beta (optioneel)
- **Production**: Voor live release
