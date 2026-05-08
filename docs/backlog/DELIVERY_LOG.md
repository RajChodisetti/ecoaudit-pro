# Delivery Log

This document contains features that have been implemented and smoke tested by development, but still need user testing.

When the user accepts an item, move the whole entry to [TESTED_LOG.md](TESTED_LOG.md), then strike the backlog item in its phase document.

## Ready For User Testing

---

### EA-P1-015 + EA-P1-016 + EA-P1-017 — PDF Reports, Admin Panel, Storage, Phase 1 RC

Status: Partially tested — 2026-05-08
Delivered date: 2026-05-08
Phase: Phase 1
Developer: Claude Code
Branch or commit: main (commit a19a26c, 30bb94d)
Version: 0.3.0, build 7

---

#### What was added

**EA-P1-015 — MVP Offline PDF Save and Share:**
- `expo-print` + `expo-sharing` installed
- `src/pdf/generateAuditPdf.ts` — builds an HTML audit report:
  - Site meta grid (name, address, inspector, date)
  - Summary stat pills (zones, switchboards, HVAC, lighting counts)
  - Per-zone blocks with all equipment items
  - All photos per item embedded as base64 thumbnails with labels (matching web app):
    - Switchboard: main photo + extra photos
    - HVAC: unit photo, nameplate, controller, indoor unit nameplate, extra photos
    - Lighting: fixture, fixtures installed, mounting/access, switches/sensors, switchboard, extra photos
    - Zone: all zone photos
  - Amber "Observations for Energy Improvement" and green "Additional Notes" callout boxes
- Share button (top-right of Audit Review screen) → builds PDF → Android share sheet
- PDF saved to `documentDirectory` as `audit_report_{id}.pdf`

**EA-P1-016 — Settings, Admin, Storage:**
- `SettingsScreen.tsx`:
  - Storage section: async directory walk, shows Photos and PDF Reports sizes (KB/MB)
  - Administration section: User Management row + Sync (coming soon, greyed out)
  - Developer tools (DB Diagnostics, Scaffold) now **hidden for inspector role**
- `AdminScreen.tsx`: list all users, add inspector/admin via bottom-sheet modal, deactivate/reactivate with confirmation
- Admin PIN gate: non-admin tapping User Management is prompted for admin PIN before entering
- `authRepository.ts`: `verifyAdminPin()` added

**EA-P1-017 — Phase 1 Release Candidate:**
- Version bumped to 0.3.0 build 7
- `PHASE_LABEL` = "Phase 1 Complete · Increments 001–017"

---

#### How to test (remaining items)

**EA-P1-015 (PDF — partially tested):**
1. ✅ Open an audit with zones + equipment → Audit Review → tap share button → PDF generates → share sheet opens — **CONFIRMED 2026-05-08**
2. Verify PDF content: all equipment types appear, photos are embedded with labels, site name/inspector/date are correct
3. Share to a recipient — verify the PDF opens correctly on their device
4. Re-generate PDF for same audit — verify it overwrites cleanly, no error

**EA-P1-016 (Admin/Settings — not yet tested):**
5. Settings → Storage section → should show KB/MB values for Photos and PDF Reports
6. Settings → User Management → tap → add a new inspector (name, username, password) → confirm they appear in the list
7. Tap Deactivate on the new inspector → confirm → status shows Inactive
8. Log out, try to log in as the deactivated inspector → expected: "This account has been deactivated" error
9. Log back in as admin, reactivate inspector
10. Log out, log in as the inspector account → Settings → User Management → expected: Admin PIN prompt appears
11. Enter correct admin PIN → expected: enters User Management
12. Enter wrong PIN → expected: "Incorrect PIN" error, field clears

**EA-P1-017 (RC cleanup — not yet tested):**
13. Log in as admin → Settings → should see Database Diagnostics and Scaffold Info
14. Log in as inspector → Settings → Database Diagnostics and Scaffold Info should NOT appear

---

User testing result:
- EA-P1-015: ✅ PDF generation and sharing confirmed 2026-05-08.
- EA-P1-016: ✅ Admin PIN gate confirmed. ✅ Storage usage section visible. **Bug found + fixed:** Photos showed 0 — storage walk was scanning `zone_photos/` but photos are stored under `ecoaudit/zones/`. Fixed to scan `ecoaudit/` directory. Also deactivate/reactivate user, developer tools hidden for inspector — all confirmed.
- EA-P1-017: ✅ Developer tools hidden from inspector confirmed 2026-05-08.
- **Bug fix (same build):** HVAC Packaged/Split toggle now uses `LayoutAnimation.easeInEaseOut` so the indoor unit section slides in/out visibly when the type changes.

---

### EA-P1-010 + EA-P1-011 + EA-P1-012 + EA-P1-013 + EA-P1-014 — Equipment Framework, 3 Capture Forms, and Audit Review

Status: Partially tested — 2026-05-08
Delivered date: 2026-05-08
Phase: Phase 1
Developer: Claude Code
Branch or commit: main (commit 7525a67)
Version: 0.2.0, build 6

**Combined delivery note:** Items 010–014 form one equipment capture workflow and are delivered together. Also includes two bug fixes from 007-009 testing.

---

#### Bug fixes included in this build

- **ZoneScreen stale photo counts** — `ZoneScreen` now uses `useFocusEffect` instead of `useEffect`. Photo counts in zone cards update immediately when you return from ZoneWorkspace.
- **AuditScreen missing Manage Zones** — Edit mode now shows "Manage Zones →" and "Review Audit" buttons below Save Changes. Reopening an existing audit and continuing to zones now works.

---

#### What was added

**EA-P1-010 — Equipment Framework:**
- `ZoneWorkspace.tsx` fully refactored: 3 Phase 1 equipment sections (Main Switchboard, HVAC, Lighting) each with item list, per-item edit/delete, and "+ Add" button
- 6 Phase 2 types shown as locked rows with "Phase 2" badge (Additional Switchboards, Solar PV, Forklift Chargers, Hot Water, General Water, General Electricity)
- Total equipment count shown in section header; items show name + sub-label (make · model for HVAC, type · area × qty for Lighting)
- `useFocusEffect` in ZoneWorkspace so the list refreshes on return from a form

**EA-P1-011 — Main Switchboard Capture:**
- `mainSwitchboardRepository.ts` — CRUD + `getMainSwitchboardsByAudit()`
- `MainSwitchboardFormScreen.tsx` — create/edit form:
  - Required: Name
  - Optional: Location, GPS/Map Locator, Site NMI
  - Primary photo (SinglePhotoField)
  - Sub-circuits description, comments, extra notes (multiline)
  - Extra photos (PhotoGrid)
  - Delete button in edit mode

**EA-P1-012 — HVAC Unit Capture:**
- `hvacRepository.ts` — CRUD + `getHVACUnitsByAudit()`
- `HVACFormScreen.tsx` — create/edit form:
  - Required: Unit Name
  - Packaged / Split toggle — indoor unit section only shown for Split type
  - Spec fields: make, model, serial, heating kW, cooling kW, power supply phase
  - Photos: main unit, nameplate, indoor nameplate (Split only), controller
  - Controller section: type, model
  - Additional: temp sensor type, system coverage, energy improvement observations
  - Extra notes + extra photos

**EA-P1-013 — Lighting System Capture:**
- `lightingRepository.ts` — CRUD + `getLightingSystemsByAudit()`
- `LightingFormScreen.tsx` — create/edit form:
  - Required: Light Type
  - Spec fields: brand/model, rated wattage, quantity, area/location, controls type, operating hours, mounting height
  - Photos: primary, fixtures, mounting constraints, sensors/controls
  - Notes: fixtures installed, circuit grouping, access limitations, switchboard notes, energy observations, extra notes
  - Extra photos

**EA-P1-014 — Internal Audit Review:**
- `AuditReviewScreen.tsx` — reachable via "Review Audit" button on AuditScreen edit mode
  - Audit header card: address, inspector, date
  - Summary stat pills: zone count, switchboard count, HVAC count, lighting count
  - **By Zone tab**: each zone as a card with its equipment items listed below
  - **By Equipment tab**: MS, HVAC, Lighting each grouped with all items across zones
  - Empty states for both tabs

**New shared component:**
- `photo/SinglePhotoField.tsx` — tap-to-capture single photo. Shows placeholder when empty; tap existing photo to change or remove.

---

#### How to test (EA-P1-010 through EA-P1-014)

**Setup:** Open an existing audit or create a new one. Navigate to a zone.

**EA-P1-010 (Equipment framework):**
1. Open Zone Workspace — expected: 3 Phase 1 sections (Main Switchboard, HVAC, Lighting) and 6 Phase 2 rows with lock icon + "Phase 2" badge.
2. Tap a Phase 2 row — expected: nothing happens (no navigation).

**EA-P1-011 (Main Switchboard):**
3. Tap "+ Add Main Switchboard" — expected: form opens titled "New Switchboard".
4. Tap Save without name — expected: save blocked, "Name is required" error shown.
5. Enter name, add location, NMI, primary photo, extra photo, sub-circuit notes → Save.
6. Expected: item appears in Main Switchboard section with name as label.
7. Tap pencil icon on item — expected: form opens in edit mode with all saved values.
8. Change name → Save — expected: updated name shown in list.
9. Close and reopen app, navigate back to zone — expected: item still present.
10. Tap trash icon → confirm — expected: item removed.

**EA-P1-012 (HVAC):**
11. Tap "+ Add HVAC Units" → form opens.
12. Save without unit name — expected: blocked.
13. Enter unit name, tap "Split" type — expected: indoor unit section appears.
14. Fill make, model, cooling kW, take nameplate photo → Save.
15. Expected: item in HVAC section with unit name and make · model sub-label.
16. Edit cooling kW → Save, reopen app — expected: value persists.
17. Delete item — expected: removed.

**EA-P1-013 (Lighting):**
18. Tap "+ Add Lighting Systems" → form opens.
19. Save without light type — expected: blocked.
20. Enter "LED Highbay", wattage=100, quantity=24, area="Warehouse", take primary photo → Save.
21. Expected: item in Lighting section, sub-label shows area × quantity.
22. Edit quantity → Save, reopen app — expected: value persists.
23. Delete item — expected: removed.

**EA-P1-014 (Review):**
24. From AuditScreen (edit mode), tap "Review Audit" — expected: review screen opens.
25. By Zone tab — expected: zones listed, equipment items shown under each zone.
26. By Equipment tab — expected: MS, HVAC, Lighting groups with all items.
27. Press Back — expected: returns to AuditScreen.

**Bug fix verification:**
28. Add a photo to a zone in ZoneWorkspace, press Back to ZoneScreen — expected: photo count on zone card now shows correct count (not 0).
29. Close app completely, reopen, log in, tap audit card — expected: AuditScreen opens in edit mode with "Manage Zones →" button visible. Tap it — expected: navigates to zones.

---

User testing result:
- ✅ Equipment add, edit, delete confirmed (all 3 types) 2026-05-08.
- ✅ Form validation confirmed (save blocked on empty required fields).
- ✅ Equipment edit confirmed.
- ✅ App restart persistence confirmed.
- ✅ Offline mode confirmed.
- ✅ Mark as Completed confirmed (status changes, button hides).
- HVAC Split/Packaged indoor unit section: visible but no animation — fixed (LayoutAnimation added, see EA-P1-015/016/017 entry).
- Pending: Phase 2 rows locked (minor, cosmetic).

---

### EA-P1-007 + EA-P1-008 + EA-P1-009 — Audit Form, Zone Management, and Photo Capture

Status: Partially tested — 2026-05-08
Delivered date: 2026-05-08
Phase: Phase 1
Developer: Claude Code
Branch or commit: main

**Combined delivery note:** Items 007–009 are delivered together (v0.1.5, build 5) because they form one continuous workflow: create an audit → add zones → capture photos in each zone. Testing them in one install session is more efficient than three separate APK installs.

---

#### What was added

**EA-P1-007 — Audit Create / Edit / Delete / Complete:**
- `auditRepository.ts` extended: `createAudit()`, `getAudit(id)`, `updateAudit()`, `markAuditComplete()`
- `AuditScreen.tsx` — unified create/edit screen:
  - Route params: `{ auditId?: string; mode: 'create' | 'edit' }`
  - Fields: Site Name *, Site Address *, Inspector *, Audit Date (custom modal date picker, no extra dependencies)
  - Per-field inline validation errors; save blocked until all required fields are filled
  - Create mode: saves audit → `navigation.replace('ZoneScreen', ...)` (no back to half-created state)
  - Edit mode: loads existing audit, saves changes, returns to Dashboard
  - "Mark as Completed" button (shown on Draft audits in edit mode only) → confirmation → status badge updates
  - "Delete Audit" button (edit mode only) → confirmation → cascade delete → returns to Dashboard
  - Status badge (Draft = amber, Completed = green) shown in edit mode header
- `DashboardScreen.tsx` wired:
  - Audit card tap → `navigation.navigate('AuditScreen', { auditId, mode: 'edit' })`
  - (+) header button → `navigation.navigate('AuditScreen', { mode: 'create' })`
  - "Start New Site Audit" empty-state CTA → same navigation

**EA-P1-008 — Zone Management:**
- `zoneRepository.ts` — `getZone(id)`, `getZones(auditId)`, `createZone()`, `deleteZone()` (cascades 9 equipment tables), `updateZonePhotos()`
- `ZoneScreen.tsx` — zone list for an audit:
  - Shows all zones with name, description, photo count, chevron
  - Pull-to-refresh
  - Delete button per zone → confirmation → cascade delete → optimistic list update
  - "Add Zone" bottom-sheet modal: zone name (required), description (optional)
  - After adding zone → immediately navigates to ZoneWorkspace for that zone
  - Empty state with "Add First Zone" CTA
- `ZoneWorkspace.tsx` — zone detail screen:
  - Zone name in header, description card below (if set)
  - Zone Photos section with live photo count
  - Equipment list (9 types) shown as placeholder rows with "Coming soon" badges

**EA-P1-009 — Camera / Gallery Photo Capture:**
- `photo/PhotoGrid.tsx` — reusable horizontal scrolling photo component:
  - Horizontal FlatList: existing photo thumbnails (90×90 px) + "Add" tile at end
  - Tap "Add" → Alert sheet: Camera / Photo Library / Cancel
  - Camera path: requests `CAMERA` permission → `launchCameraAsync({ mediaTypes: 'images', quality: 0.85 })`
  - Gallery path: requests `READ_MEDIA_IMAGES` permission → `launchImageLibraryAsync({ allowsMultipleSelection: true, selectionLimit: 10 })`
  - Photos copied to `documentDirectory/ecoaudit/zones/{zoneId}/photo_{timestamp}.jpg` via `expo-file-system/legacy`
  - Permission denial handled with `Alert` explaining what is needed
  - X button on each thumbnail → confirmation → deletes file from filesystem + removes from list
  - Integrated into `ZoneWorkspace.tsx` with `updateZonePhotos()` persistence on every change
- `app.json` updated: `CAMERA`, `READ_MEDIA_IMAGES`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` permissions added; versionCode bumped to 5

**Navigation wired:**
- `MainTabNavigator.tsx` — `HomeStackParamList` extended with `AuditScreen`, `ZoneScreen`, `ZoneWorkspace` routes; all three screens registered in `HomeStack.Navigator`

---

#### How to build

```bash
cd ecoaudit-pro/mobile
npm install --legacy-peer-deps
npm run build:apk
# Rename: EcoAuditPro-P1-007-008-009-audit-zone-photo-v0.1.5.apk
```

---

#### How to test (phone smoke tests)

**EA-P1-007 — Audit Create/Edit/Delete/Complete:**

1. On the Dashboard, tap the (+) button in the top-right header.
   Expected: "New Audit" form opens.

2. Tap "Create Audit & Add Zones →" without filling any fields.
   Expected: save is blocked; inline errors appear under each required field.

3. Fill in: Site Name = "Collins St Office", Site Address = "142 Collins St, Melbourne VIC 3000", Inspector = "Jane Smith". Tap the Audit Date row.
   Expected: date picker modal opens with year/month/day inputs.

4. Set a date and tap "Set Date". Tap "Create Audit & Add Zones →".
   Expected: audit is saved and the app navigates to the Zone list for this new audit. No "Back" option to the empty form.

5. Press back to return to Dashboard.
   Expected: "Collins St Office" card appears with "Draft" badge.

6. Tap the audit card.
   Expected: "Edit Audit" screen opens with all fields pre-filled.

7. Change the site address and tap "Save Changes".
   Expected: returns to Dashboard with updated address visible.

8. Force-close the app and reopen. Tap the audit card.
   Expected: edited address persists.

9. Re-open the audit in edit mode. Tap "Mark as Completed".
   Expected: confirmation dialog. Confirm → status badge changes to "Completed" (green).

10. Force-close and reopen. Tap the audit.
    Expected: status shows "Completed". "Mark as Completed" button is gone.

11. In edit mode, tap "Delete Audit". Confirm.
    Expected: returns to Dashboard and the audit card is gone.

**EA-P1-008 — Zone Management:**

12. Create a new audit (see step 3–4). On the Zone list screen, tap the (+) button in the header.
    Expected: "Add Zone" bottom sheet slides up.

13. Tap "Add Zone" without entering a name.
    Expected: "Zone name is required" error appears.

14. Enter Zone Name = "Ground Floor", Description = "Main office level". Tap "Add Zone".
    Expected: navigates directly to "Ground Floor" Zone Workspace.

15. Press back. Expected: Zone list showing "Ground Floor" with 0 photos.

16. Add a second zone: "Rooftop". Expected: two zones in the list.

17. Long-press or tap the trash icon on "Rooftop". Confirm delete.
    Expected: "Rooftop" disappears. Force-close and reopen the audit — only "Ground Floor" remains.

18. Tap "Ground Floor". Expected: Zone Workspace opens showing zone name, description card, "Zone Photos" section (0 photos), and equipment list rows.

**EA-P1-009 — Camera/Gallery Photo Capture:**

19. In the Zone Workspace for "Ground Floor", tap the dashed "Add" camera tile.
    Expected: alert sheet with "Camera", "Photo Library", "Cancel".

20. Tap "Camera". If permission dialog appears, allow it.
    Expected: camera opens. Take a photo. Photo thumbnail appears in the grid.

21. Tap "Add" again → "Photo Library". Select 2–3 photos.
    Expected: all selected photos appear as thumbnails in the grid.

22. Press back, then re-open "Ground Floor" zone.
    Expected: all photos still displayed (photo count on zone card updated on zone list).

23. Force-close app and reopen. Navigate to "Ground Floor".
    Expected: photos persist — they are stored in app-local filesystem, not the camera roll.

24. Tap the X on a photo thumbnail → confirm.
    Expected: photo removed from grid immediately.

25. Turn on airplane mode. Add another photo via Camera.
    Expected: photo capture works fully offline.

26. Deny camera permission (Android Settings → Apps → EcoAudit Pro → Permissions → Camera → Deny). Return to app and tap "Add" → "Camera".
    Expected: app shows "Permission Required — Camera access is needed to take photos." alert. Does not crash.

---

#### Smoke tests run by developer

- TypeScript typecheck: `npx tsc --noEmit` — **PASSED, zero errors**
- `expo-file-system/legacy` used for filesystem operations (v19 new API uses class-based approach; legacy import maintains proven API)
- All new packages already installed in previous increment (`expo-image-picker ~16.0.0`, `expo-file-system`)
- Navigation types verified: all route params match across AuditScreen, ZoneScreen, ZoneWorkspace

---

#### Known gaps and follow-ups

- Equipment rows in ZoneWorkspace show "Coming soon" — full capture forms come in EA-P1-010 to EA-P1-013.
- Photos are stored in raw format only; compressed copies for PDF generation are deferred to EA-P1-015.
- No photo full-screen preview yet — tapping a thumbnail does nothing (viewer comes in EA-P1-009 polish or EA-P1-014).
- Gallery/camera permissions on Android 13+ use `READ_MEDIA_IMAGES`; older Android uses `READ_EXTERNAL_STORAGE` — both declared in `app.json`.
- Zone edit (rename/re-describe) not yet implemented; delete + re-add as workaround for Phase 1.

---

User testing result:
- ✅ Zone delete confirmed 2026-05-08.
- ✅ Photo capture (camera + library) and photo delete confirmed.
- ✅ Mark as Completed confirmed.
- ✅ Offline / airplane mode confirmed.
- ✅ App restart persistence confirmed.

---

### EA-P1-005 + EA-P1-006 — App Shell / Theme / Navigation + Dashboard

Status: Ready for user testing
Delivered date: 2026-05-07
Phase: Phase 1
Developer: Claude Code
Branch or commit: main

**Combined delivery note:** EA-P1-005 and EA-P1-006 are delivered together (v0.1.4, build 4). Navigation shell and theme are invisible without real screens, and the Dashboard is the first real screen.

---

#### What was added

**Theme & color overhaul (across all screens):**
- App primary background changed from dark navy (#162A4E) to **white (#FFFFFF)**
- Navy blue (#162A4E) used as primary brand color (buttons, headers, active states)
- Light card surfaces (#F4F6FA), light borders (#DDE4EE)
- Dark mode remains available (original navy palette)
- `src/theme/colors.ts` — LIGHT and DARK palettes
- `src/theme/ThemeContext.tsx` — ThemeProvider + useTheme hook; preference persisted in SecureStore
- All existing screens (Setup, Login, Scaffold, Diagnostics) updated to use theme

**EA-P1-005 — App Shell, Navigation, Theme, Safe Area:**
- `react-native-safe-area-context` applied: `SafeAreaProvider` wraps entire app; DashboardScreen and SettingsScreen use `SafeAreaView` with `edges={['top']}`
- `@react-navigation/bottom-tabs` installed and wired
- `MainTabNavigator.tsx` — bottom tab bar with **Home** (house icon) and **Settings** (gear icon)
- Active/inactive tab colors match theme; tab bar respects safe area bottom inset
- `SettingsScreen.tsx` — theme toggle (Light / Dark / System), account info, developer tools (Diagnostics, Scaffold Info), app version, logout button
- Stack-within-tab for Settings: Settings → Diagnostics and Settings → Scaffold Info both have back button
- Screen transitions: `slide_from_right` animation

**EA-P1-006 — Dashboard:**
- `auditRepository.ts` — `getAudits()` (sorted newest first, excludes soft-deleted), `deleteAudit()` (cascade across all 10 equipment tables), `formatAuditDate()`
- `DashboardScreen.tsx`:
  - Loads all local audits from SQLite on mount
  - FlatList with pull-to-refresh (RefreshControl)
  - Loading spinner on initial load
  - Audit cards: site name, address (location icon), inspector (person icon), date (calendar icon), status badge (Draft = amber, Completed = green)
  - Real-time search: filters by site name OR inspector name, case-insensitive
  - Clear (×) button on search bar when text is present
  - Delete button on each card → confirmation dialog → cascade delete → card removed from list
  - Empty state (no audits): clipboard icon + "No audits yet" + CTA button
  - No-results state (search): search icon + "No results" message
  - "New Audit" (+) button in header — placeholder alert for EA-P1-007

---

#### How to build

```bash
cd ecoaudit-pro/mobile
npm install --legacy-peer-deps
npm run build:apk
# Rename: EcoAuditPro-P1-005-006-shell-dashboard-v0.1.4.apk
```

---

#### How to test (phone smoke tests)

**Theme smoke tests:**
1. Log in → app is now white/light background. Open Diagnostics, Setup flow, Login — all white.
2. Go to Settings tab → Appearance section → tap "Dark".
   Expected: all screens immediately switch to dark navy theme.
3. Close app completely, reopen.
   Expected: dark theme persists.
4. Tap "System" — theme follows device dark/light mode setting.

**Navigation smoke tests:**
5. After login, bottom tab bar is visible with "Home" and "Settings" tabs.
   Expected: active tab is highlighted navy, inactive is gray.
6. Tap Settings tab. Expected: Settings screen. Tap Home tab. Expected: Dashboard.
7. In Settings, tap "Database Diagnostics".
   Expected: Diagnostics screen opens with back button labelled "Settings".
8. Tap back. Expected: returns to Settings.
9. Tap "Scaffold Info". Expected: Scaffold screen with DB status and back button.

**Dashboard smoke tests:**
10. Open app with seed data already loaded (from previous testing).
    Expected: Dashboard shows audit cards for "City Office Complex" (Draft) and "Warehouse Distribution Centre" (Completed).
11. Cards show: site name (bold), address with location icon, inspector with person icon, date, status badge.
12. Search for "city". Expected: only "City Office Complex" card remains.
13. Search for "mark". Expected: only "Warehouse Distribution Centre" (inspector: Mark Johnson).
14. Clear search. Expected: both cards reappear.
15. Pull the list down. Expected: pull-to-refresh spinner, list reloads.
16. Tap "Delete" on one card → confirm.
    Expected: card disappears immediately. Close and reopen app — card stays gone.
17. Delete second card. Expected: empty state shown (clipboard icon + message + CTA button).
18. Seed data again from Diagnostics (Settings → Database Diagnostics → Seed Sample Data).
    Return to Home tab. Expected: cards reload after pull-to-refresh.

---

#### Smoke tests run by developer

- TypeScript typecheck: `./node_modules/.bin/tsc --noEmit` — **PASSED, zero errors**
- All new packages installed: @react-navigation/bottom-tabs

---

#### Known gaps and follow-ups

- "Start New Site Audit" button and (+) button show a placeholder alert (EA-P1-007).
- Audit card tap does not navigate anywhere yet (EA-P1-007).
- Safe area bottom inset not yet applied to screens inside tab stacks — tab bar itself handles bottom inset.
- Scaffold screen remains accessible under Settings → Scaffold Info; it will be removed in EA-P1-017.

---

User testing result:
- ✅ Navigation confirmed 2026-05-08.
- ✅ Dark mode toggle and persistence confirmed.
- ✅ Dashboard search confirmed.

---

### EA-P1-003 + EA-P1-004 — First-Run Setup, Offline Login, Session Restore, and Logout

Status: ~~User tested and accepted — moved to TESTED_LOG.md~~
Delivered date: 2026-05-05
Phase: Phase 1
Developer: Claude Code
Branch or commit: main

**Combined delivery note:** EA-P1-003 and EA-P1-004 are delivered together (v0.1.3, build 3) because login is only testable after setup creates the first user. Both items also share the same auth infrastructure (authRepository, SecureStore session, SHA-256 password hashing).

---

#### What was added

**Fixes:**
- React version downgraded from 19.1.6 to 19.1.4 to match `react-native-renderer` (fixes blank screen crash on all devices)
- Added `expo-crypto`, `expo-secure-store`, `expo-local-authentication` packages

**EA-P1-003 — First-Run Admin and Inspector Setup:**
- `admin_config` SQLite table (migration v2) stores: `admin_pin_hash`, `setup_complete`
- `authRepository.ts`: `isSetupComplete()`, `completeSetup()`, `addUser()`, `setUserActive()`, `getUsers()`
- `SetupScreen.tsx` — two-step first-run wizard:
  - Step 1: Set Admin PIN (4–6 digits, confirmed, SHA-256 hashed)
  - Step 2: Create first admin account (full name, username, password with show/hide toggle)
  - Validation on every field before advancing
  - Auto-creates session and navigates directly to app on finish
- Credential distribution choice: manual setup (Admin PIN + first user on-device)

**EA-P1-004 — Offline Login, Session Restore, and Logout:**
- `LoginScreen.tsx` — username + password form with show/hide toggle
  - Error: "Incorrect username or password" on wrong credentials
  - Error: "This account has been deactivated" on inactive account
  - Biometric button auto-shown if hardware enrolled and previous user cached
  - Zero network calls — 100% local SQLite validation
- Session stored as JSON in SecureStore (`ecoaudit_session_v1`), expires 30 days from last login
- Last user cached in SecureStore (`ecoaudit_last_user_v1`) — survives session expiry for biometric pre-fill
- Biometric: tap "Use Biometric" on login screen → system biometric prompt → new 30-day session if verified
- `logout()` clears session token from SecureStore; local data is not deleted
- Logout confirmation dialog on scaffold screen ("Are you sure?")
- `RootNavigator` manages auth state machine: `checking → setup_needed | login_needed | authenticated`
- Session restored on app reopen without any re-entry (navigate directly to scaffold)
- `ScaffoldScreen` updated: shows signed-in user name + role, "Log Out" button

---

#### How to build the APK

```bash
cd ecoaudit-pro/mobile
npm install --legacy-peer-deps
npm run build:apk
# Rename APK: EcoAuditPro-P1-003-004-auth-v0.1.3.apk
```

**Alternative — Expo Go (development preview):**
```bash
npm start
# Scan QR with Expo Go on Android phone
```

---

#### How to test (phone smoke tests)

Install the APK fresh (clear data or uninstall previous) on an Android phone, then follow each step.

**EA-P1-003 smoke tests:**

1. Open app for the first time (fresh install).
   Expected: First-run setup wizard appears. Scaffold screen does NOT appear.

2. On Step 1, leave PIN empty and tap "Next".
   Expected: Button is disabled (cannot tap). No crash.

3. Enter a 3-digit PIN and tap "Next".
   Expected: Error "PIN must be 4–6 digits".

4. Enter mismatched PINs (e.g. "1234" / "1235") and tap "Next".
   Expected: Error "PINs do not match".

5. Enter valid matching PIN (e.g. "1234" / "1234") and tap "Next".
   Expected: Advances to Step 2. Step indicator reads "Step 2 of 2".

6. On Step 2, leave fields empty and tap "Finish Setup".
   Expected: Error shown ("Full name is required" or similar).

7. Enter mismatched passwords and tap "Finish Setup".
   Expected: Error "Passwords do not match".

8. Fill all fields correctly and tap "Finish Setup".
   Expected: Spinner appears briefly, then scaffold screen appears showing the user's name.

9. Close app completely (remove from recents) and reopen.
   Expected: Setup wizard does NOT appear again. Session restored — scaffold shown directly.

10. Clear app data (Android Settings → Apps → EcoAudit Pro → Clear Data) and reopen.
    Expected: Setup wizard appears again for a fresh device state.

**EA-P1-004 smoke tests:**

11. After fresh setup, close the app and reopen.
    Expected: Session is restored — scaffold screen appears without login prompt.

12. From scaffold, tap "Log Out" → confirm.
    Expected: Login screen appears. Data in Diagnostics is NOT cleared.

13. On login screen, enter wrong username or password.
    Expected: Error "Incorrect username or password".

14. Enter correct credentials.
    Expected: Scaffold screen appears showing user name and role.

15. Turn on airplane mode, log out, and log back in.
    Expected: Login succeeds — no network required.

16. Close and reopen app 5+ times.
    Expected: Session restored each time without re-login.

17. If device has biometric enrolled: log out, then tap "Use Biometric" on login screen.
    Expected: System biometric prompt appears. On success, app opens. On cancel/failure, error shown.

---

#### Smoke tests run by developer

- TypeScript typecheck: `./node_modules/.bin/tsc --noEmit` — **PASSED, zero errors**
- React version mismatch resolved: `react@19.1.4` matches `react-native-renderer@19.1.4`
- All new packages installed: expo-crypto, expo-secure-store, expo-local-authentication

---

#### Known gaps and follow-ups

- Admin PIN is stored and hashed but the Admin Panel UI (EA-P1-016) for viewing/managing users is not yet built.
- Password hashing uses SHA-256 (expo-crypto) rather than bcrypt. Acceptable for Phase 1 offline use; upgrade path is documented for Phase 3 hardening.
- Biometric "disable in settings" option comes in EA-P1-016.
- Biometric 3-failure fallback uses the OS default (system biometric dialog handles retry limits).
- `expo-local-authentication` biometric prompt will show "Use Password" fallback to the OS device PIN/password — this is expected behaviour.

---

User testing result:
- **Confirmed 2026-05-08:** Login, session restore, logout, and biometric login confirmed working in earlier testing session (2026-05-07). Admin PIN UI now delivered in EA-P1-016. See TESTED_LOG.md for full acceptance record.

---

### EA-P1-001 + EA-P1-002 — Scaffold APK & Local Database with Diagnostics

Status: ~~User tested and accepted — moved to TESTED_LOG.md~~
Delivered date: 2026-05-04
Phase: Phase 1
Developer: Claude Code
Branch or commit: main

**Combined delivery note:** EA-P1-001 and EA-P1-002 are delivered as a single APK (v0.1.1, build 2) because the database foundation is invisible without the diagnostics screen, and the diagnostics screen is meaningless without the scaffold. You test both together in one install.

---

#### What was added

**EA-P1-001 — Scaffold:**
- New React Native + Expo (SDK 52) TypeScript project at `mobile/`
- Package ID: `com.ecoauditpro.mobile`, version `0.1.1`, build `2`
- `app.json`, `eas.json`, `babel.config.js`, `tsconfig.json`, `package.json`
- Full baseline folder structure: `screens/`, `components/`, `database/`, `repositories/`, `photo/`, `pdf/templates/`, `tests/`
- Scaffold screen: app name, tagline, phase label, version/build, database status badge
- Entry point via `registerRootComponent` (Expo standard)
- React Navigation (native stack) wired up

**EA-P1-002 — Database:**
- `expo-sqlite` + `drizzle-orm` for typed offline SQLite
- Single-transaction migration runner with version tracking in `_meta` table
- **All 11 entity tables** from `docs/DATA_MODELS.md`:
  `audits`, `zones`, `main_switchboards`, `additional_switchboards`, `hvac_units`,
  `lighting_systems`, `solar_pv`, `forklift_chargers`, `hot_water_systems`,
  `general_water`, `general_electricity`
- Sync infrastructure tables: `sync_queue`, `photo_upload_queue` (deferred to Phase 4, schema exists now)
- Auth table: `local_users` (used by EA-P1-003)
- Every entity table carries sync metadata columns: `server_id`, `sync_status`, `updated_at`, `deleted_at`
- Diagnostics screen accessible from scaffold:
  - DB file name, migration version, OK/Error status
  - Row count for every table
  - **Seed sample data** action (2 audits, 3 zones with realistic AU addresses)
  - **Clear sample data** action (with confirmation dialog)
  - Refresh button

---

#### How to build the APK

**Prerequisites:**
- Node.js 18+ installed
- Expo CLI: `npm install -g eas-cli`
- An Expo account (free): [expo.dev](https://expo.dev)

**Steps:**

```bash
# 1. Navigate to the mobile project
cd ecoaudit-pro/mobile

# 2. Install dependencies (first time only)
npm install --legacy-peer-deps

# 3. Log in to Expo (first time only)
eas login

# 4. Build the APK (cloud build — no Android Studio needed)
npm run build:apk
# This runs: eas build --platform android --profile preview
# Build takes ~5–10 minutes on EAS cloud servers
# Download the APK from the EAS dashboard when complete
```

**APK naming:** Rename the downloaded file to `EcoAuditPro-P1-001-002-scaffold-db-v0.1.1.apk` before sharing.

**Alternative — local build (requires Android Studio + SDK):**
```bash
npm run android
# or: npx expo run:android
```

**Alternative — Expo Go (development preview, not a real APK):**
```bash
npm start
# Scan the QR code with the Expo Go app on your Android phone
# Note: Expo Go has limitations; use EAS Build for the real APK smoke test
```

---

#### How to test (phone smoke tests)

Install the APK on an Android phone, then follow each step.

**EA-P1-001 smoke tests:**

1. Transfer APK to the phone and tap to install.
   Expected: Android prompts to allow install from unknown sources; app installs and appears as "EcoAudit Pro" in the app list.

2. Open the app.
   Expected: A brief "Initialising database…" splash appears, then the scaffold screen loads showing:
   - "EcoAudit Pro" heading
   - "Energy Audit Tool" subtitle in green
   - Phase label: "Phase 1 · Increments 001 + 002"
   - Version: "0.1.1 (Build 2)"
   - Database: "Ready · Migration v1" with a green dot
   - Green "Open Diagnostics →" button

3. Close the app (remove from recent apps) and reopen.
   Expected: App opens again; scaffold screen shows "Ready" status, no crash.

**EA-P1-002 smoke tests:**

4. Tap "Open Diagnostics →".
   Expected: Diagnostics screen opens with header back button. Shows DB file `ecoaudit.db`, migration version `v1`, status `OK`. All 14 tables listed with count `0`.

5. Tap "Seed Sample Data".
   Expected: Row counts update. `audits` shows 2, `zones` shows 3, all others stay 0.

6. Close the app completely (remove from recent apps) and reopen; navigate back to Diagnostics.
   Expected: Counts are identical — `audits` 2, `zones` 3. Data persisted across app kill.

7. Tap "Clear Sample Data" and confirm.
   Expected: Confirmation dialog appears. After confirming, all counts return to 0.

8. Close and reopen the app. Open Diagnostics again.
   Expected: All counts are still 0. Database initialises cleanly without re-running migrations.

---

#### Smoke tests run by developer

- TypeScript typecheck: `./node_modules/.bin/tsc --noEmit` — **PASSED, zero errors**
- Dependencies install: `npm install --legacy-peer-deps` — **PASSED**
- All source files created and verified
- Migration SQL covers all 11 DATA_MODELS.md tables plus sync infrastructure
- Drizzle schema matches migration SQL column-for-column

---

#### Known gaps and follow-ups

- App icon and splash screen use Expo defaults — custom branding deferred to EA-P1-017 (release candidate polish).
- `react-native-safe-area-context` not yet applied to screens — safe-area handling comes in EA-P1-005.
- No biometric or session logic yet — that is EA-P1-003 and EA-P1-004.
- `legacy-peer-deps` required for install due to React Navigation peer dependency resolution — this is cosmetic and does not affect the build or runtime.

---

User testing result:
- Pending

## Entry Template

Copy this template for every delivered backlog item.

```markdown
### EA-PX-### - Feature Name

Status: Ready for user testing
Delivered date: YYYY-MM-DD
Phase: Phase X
Developer:
Branch or commit:

What changed:
- 

What was added:
- 

Why it was added:
- 

How it is relevant:
- 

Functionality:
- 

How to test:
1. 
2. 
3. 

Expected result:
- 

Smoke tests run by developer:
- 

Known gaps or follow-ups:
- 

User testing result:
- Pending
```

## Rejection Handling

If the user rejects the delivered item:

- Keep the item in this file.
- Add the exact feedback under `User testing result`.
- Move the phase backlog item from `[D] Delivered for user testing` back to `[~] In progress`.
- Add follow-up work under the same backlog item unless the feedback is a separate new feature.

