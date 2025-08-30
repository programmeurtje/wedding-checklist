# Firebase Setup Guide voor Wedding Checklist Admin

## Stap 1: Firebase Project Aanmaken

1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Klik op "Add project" of "Create a project"
3. Geef je project een naam (bijv. "wedding-checklist-admin")
4. Schakel Google Analytics uit (niet nodig voor dit project)
5. Klik "Create project"

## Stap 2: Realtime Database Instellen

1. In je Firebase project, ga naar "Realtime Database" in het linker menu
2. Klik "Create Database"
3. Kies een locatie (bijv. europe-west1 voor Europa)
4. Start in "Test mode" (we passen de regels later aan)
5. Klik "Done"

## Stap 3: Database URL Ophalen

1. In de Realtime Database sectie, zie je de database URL bovenaan
2. Het ziet er uit als: `https://your-project-id-default-rtdb.firebaseio.com/`
3. Kopieer deze URL

## Stap 4: App Configureren

1. Open `services/taskService.ts`
2. Vervang `'https://your-project-id-default-rtdb.firebaseio.com'` met jouw database URL
3. Pas eventueel het admin wachtwoord aan (regel met `girlsofhonour2024`)

## Stap 5: Database Regels Instellen

1. Ga naar "Realtime Database" → "Rules" tab
2. Vervang de regels met:

```json
{
  "rules": {
    "defaultTasks": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Klik "Publish"

## Stap 6: Initiële Data Toevoegen

1. Ga naar "Realtime Database" → "Data" tab
2. Klik op de "+" naast de root
3. Voeg een nieuwe child toe met naam: `defaultTasks`
4. Kopieer de JSON data uit `data/defaultTasks.ts` (de array met taken)
5. Plak dit als waarde voor `defaultTasks`
6. Klik "Add"

## Stap 7: Testen

1. Start de app
2. Ga naar Settings → "Admin: Beheer Default Taken"
3. Voer het admin wachtwoord in
4. Je zou nu de taken moeten zien die je in Firebase hebt toegevoegd

## Beveiliging (Productie)

Voor productie gebruik, vervang de database regels met:

```json
{
  "rules": {
    "defaultTasks": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

En implementeer Firebase Authentication voor echte admin beveiliging.

## Admin Wachtwoord Wijzigen

1. Open `services/taskService.ts`
2. Zoek naar `girlsofhonour2024`
3. Vervang dit met je gewenste wachtwoord op beide plekken:
   - In `updateDefaultTasks` functie
   - In `verifyAdminPassword` functie

## Troubleshooting

### "Permission denied" error

- Controleer of de database regels correct zijn ingesteld
- Zorg dat `.read` en `.write` op `true` staan voor `defaultTasks`

### "Network error"

- Controleer of de database URL correct is
- Zorg dat je internet verbinding hebt
- Controleer of de Firebase project actief is

### Taken laden niet

- Controleer of er data in de `defaultTasks` node staat in Firebase
- Kijk in de console logs voor error berichten
- Test of de fallback taken wel laden (dan is het een Firebase connectie probleem)

## Kosten

Firebase Realtime Database heeft een gratis tier die ruim voldoende is voor deze use case:

- 1GB opslag gratis
- 10GB/maand data transfer gratis
- Voor een wedding checklist app is dit meer dan genoeg

## Voordelen van deze Setup

✅ **Real-time updates**: Wijzigingen zijn direct zichtbaar voor alle gebruikers  
✅ **Offline fallback**: App werkt ook zonder internet  
✅ **Eenvoudig**: Geen complexe backend nodig  
✅ **Schaalbaar**: Firebase schaalt automatisch mee  
✅ **Betrouwbaar**: Google's infrastructuur  
✅ **Gratis**: Voor kleine apps geen kosten
