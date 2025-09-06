# iOS Build Configuratie voor Bruiloft Checklist

## Huidige iOS Configuratie (app.json)

### Bundle Identifier

- **Productie**: `com.superabraham.bruiloftchecklist`
- **Consistent**: Gebruikt in alle build profielen

### Build Settings

- **Build Number**: Automatisch increment via EAS
- **Version**: 1.0.0 (eerste release)
- **Orientation**: Portrait only (geschikt voor checklist app)
- **Tablet Support**: Enabled (iPad compatibility)

### Security & Privacy

- **App Transport Security**: Geconfigureerd voor Firebase
- **Encryption**: ITSAppUsesNonExemptEncryption = false
- **Firebase Domain**: Toegevoegd aan NSExceptionDomains

### App Store Configuratie

- **Category**: Lifestyle/Productivity
- **Age Rating**: 4+ (geen gevoelige content)
- **Pricing**: Gratis
- **Availability**: Wereldwijd

## EAS Build Configuratie

### Production Build

```json
{
  "resourceClass": "m-medium",
  "buildConfiguration": "Release"
}
```

### Build Commands

```bash
# Production build maken
eas build --platform ios --profile production

# Build status checken
eas build:list --platform ios

# Build downloaden (voor lokale testing)
eas build:download [build-id]
```

## Pre-Build Checklist

### Vereisten:

- [ ] Apple Developer Account actief
- [ ] Bundle identifier gereserveerd in App Store Connect
- [ ] App Store Connect app aangemaakt
- [ ] Certificates en provisioning profiles via EAS
- [ ] App icons geüpload naar assets/images/

### Configuratie Verificatie:

- [ ] Bundle identifier correct: `com.superabraham.bruiloftchecklist`
- [ ] App naam correct: "Bruiloft Checklist"
- [ ] Version en build number ingesteld
- [ ] Firebase configuratie werkend
- [ ] Splash screen correct geconfigureerd

## Build Process

### Stap 1: Lokale Test

```bash
# Lokaal testen voor iOS
npm run ios
# of
expo start --ios
```

### Stap 2: Preview Build (Optioneel)

```bash
# Preview build voor testing
eas build --platform ios --profile preview
```

### Stap 3: Production Build

```bash
# Production build voor App Store
eas build --platform ios --profile production
```

### Stap 4: Submit naar App Store

```bash
# Automatisch submitten (na configuratie)
eas submit --platform ios --profile production

# Of handmatig via App Store Connect
```

## Troubleshooting

### Veelvoorkomende Issues:

1. **Certificate Issues**: EAS handelt dit automatisch af
2. **Bundle ID Conflicts**: Zorg dat bundle ID uniek is
3. **Build Failures**: Check logs via `eas build:view [build-id]`
4. **App Store Rejection**: Volg Apple's review guidelines

### Debug Commands:

```bash
# Build logs bekijken
eas build:view [build-id]

# Build lijst
eas build:list --platform ios --limit 10

# Project status
eas project:info
```

## App Store Connect Setup

### Na Successful Build:

1. **Upload**: Build wordt automatisch geüpload naar App Store Connect
2. **Processing**: Apple verwerkt de build (kan 30-60 minuten duren)
3. **TestFlight**: Build beschikbaar voor internal testing
4. **Review**: Submit voor App Store review
5. **Release**: Na approval beschikbaar in App Store

### Metadata Vereist:

- App naam: "Bruiloft Checklist"
- Subtitle: "Organiseer je perfecte bruiloft"
- Keywords: "bruiloft,wedding,checklist,planner,organisatie,trouwen"
- Description: Nederlandse beschrijving
- Screenshots: Volgens ASSET_SPECIFICATIONS.md
- Privacy Policy: Niet vereist (geen data collection)

## Performance Optimalisatie

### Build Optimalisaties:

- **Hermes Engine**: Enabled voor betere performance
- **New Architecture**: Enabled voor toekomstbestendigheid
- **Bundle Size**: Geoptimaliseerd door unused code elimination
- **Asset Optimization**: Automatische image compression

### Runtime Optimalisaties:

- **AsyncStorage**: Geoptimaliseerd voor lokale data
- **FlatList**: Gebruikt voor grote lijsten (taken)
- **Memory Management**: Efficient state management
- **Offline Support**: App werkt volledig offline
