# Phase 1 Backlog - APK-Testable MVP Increments

Goal: deliver Phase 1 as a sequence of small Android APKs that can be shared, installed on a phone, and tested after every backlog item.

Phase 1 still targets the same MVP: offline login, local audit/zone capture, photos, Main Switchboard, HVAC, Lighting, internal review, and MVP PDF. The difference is delivery discipline: every item below must end with a buildable APK and phone smoke test.

Any web feature not delivered in Phase 1 remains tracked in [PHASE_2_FULL_WEB_PARITY.md](PHASE_2_FULL_WEB_PARITY.md). Overall parity is tracked in [FEATURE_PARITY_MATRIX.md](FEATURE_PARITY_MATRIX.md).

## Phase 1 APK Delivery Rule

Every Phase 1 item is an installable increment.

Before an item can move to `[D] Delivered for user testing`:

- A debug or internal-test APK must be built.
- The APK must install on an Android phone.
- The app must open without crashing.
- The item-specific phone smoke tests must pass.
- A delivery entry must be added to [DELIVERY_LOG.md](DELIVERY_LOG.md).
- The delivery entry must include APK filename/path, build number, install instructions, what changed, how to test, and expected results.

Recommended APK naming:

```text
EcoAuditPro-P1-001-scaffold-v0.1.0.apk
EcoAuditPro-P1-002-local-db-v0.1.1.apk
EcoAuditPro-P1-003-admin-setup-v0.1.2.apk
```

## Increment Order

| Increment | Item | Phone-testable result |
|---|---|---|
| 1 | `EA-P1-001` | App installs and opens to a visible scaffold screen |
| 2 | `EA-P1-002` | Local database initializes and diagnostics prove persistence |
| 3 | `EA-P1-003` | First-run admin/inspector setup works offline |
| 4 | `EA-P1-004` | Login, session restore, and logout work offline |
| 5 | `EA-P1-005` | App shell, navigation, safe areas, and theme work |
| 6 | `EA-P1-006` | Dashboard list/search/delete works with local data |
| 7 | `EA-P1-007` | Audit create/edit/delete/complete works |
| 8 | `EA-P1-008` | Zone add/delete/workspace works |
| 9 | `EA-P1-009` | Camera/gallery photo capture and local storage work |
| 10 | `EA-P1-010` | Equipment grid/list/dialog framework works |
| 11 | `EA-P1-011` | Main Switchboard capture works |
| 12 | `EA-P1-012` | HVAC capture works |
| 13 | `EA-P1-013` | Lighting capture works |
| 14 | `EA-P1-014` | Internal audit review works for Phase 1 equipment |
| 15 | `EA-P1-015` | MVP PDF generates, saves, and shares |
| 16 | `EA-P1-016` | Settings, admin access, storage usage, and housekeeping work |
| 17 | `EA-P1-017` | Phase 1 release-candidate APK passes full smoke test |

## Phase 1 Exit Criteria

- Every Phase 1 item has produced an installable APK increment.
- Inspector can log in offline.
- Admin can manage local inspectors.
- Inspector can create, edit, delete, and complete an audit.
- Inspector can add/delete zones and attach zone photos.
- Inspector can capture Main Switchboard, HVAC, and Lighting equipment with photos.
- Data and photos persist after closing and reopening the app.
- MVP PDF generates on-device with Phase 1 audit data.
- PDF can be saved and shared from Android.
- Delivery log contains every completed item awaiting user testing.
- Tested log contains every user-accepted item.
- No Phase 1 item is marked complete until it is user tested.

---

## ~~EA-P1-001 - Installable App Scaffold APK~~

Status: `[x] User tested`

APK increment result:

- User can install the first APK and open a simple EcoAudit Pro shell screen.

Requirements:

- Create the Android-first React Native/Expo project using TypeScript.
- Configure app name, package ID placeholder, version/build number, lint/typecheck commands, and Android build command.
- Add the baseline folder structure for screens, components, database, repositories, photo storage, PDF templates, and tests.
- Add a visible scaffold screen showing app name, build version, and "Phase 1 Increment 1".

Expectations:

- The APK proves that the project can build and run on a real phone.
- No database, auth, or audit features are expected yet.

Use cases:

- Product owner installs the first APK and confirms the app opens.
- Developer verifies the build/share/install loop before feature work begins.

Phone smoke tests:

1. Build APK.
   Expected: APK is created with the agreed filename.
2. Share APK to phone and install it.
   Expected: Android allows install and shows EcoAudit Pro in the app list.
3. Open app.
   Expected: scaffold screen appears with app name and build version.
4. Close and reopen app.
   Expected: app opens again without crashing.

Delivery log requirement:

- Include APK filename/path, build command, tested phone model, Android version, and scaffold screenshot or observation.

---

## ~~EA-P1-002 - Local Database and Diagnostics APK~~

Status: `[x] User tested`

APK increment result:

- User can install the APK, open a diagnostics screen, initialize local storage, seed sample records, close the app, reopen it, and see that records persisted.

Requirements:

- Implement SQLite with typed migrations.
- Create local tables for Audit, Zone, MainSwitchboard, AdditionalSwitchboard, HVACUnit, LightingSystem, SolarPV, ForkliftCharger, HotWaterSystem, GeneralWater, and GeneralElectricity.
- Include all fields documented in `docs/DATA_MODELS.md`, even if the user-facing form arrives in Phase 2.
- Add local metadata fields for IDs, timestamps, soft deletion where needed, and future sync status.
- Add a temporary diagnostics screen available from the scaffold or Settings route.
- Diagnostics must show migration status, table status, database version, sample record count, seed sample data action, and clear local test data action.

Expectations:

- This increment makes an internal foundation testable from the phone.
- Phase 2 equipment tables exist early, but their full forms remain deferred.

Use cases:

- Product owner verifies that offline storage exists.
- Developer verifies database persistence before building UI flows.

Phone smoke tests:

1. Install APK and open diagnostics.
   Expected: database status shows OK and current migration version.
2. Tap seed sample data.
   Expected: sample audit/zone/equipment counts appear.
3. Close and reopen app.
   Expected: sample counts remain.
4. Tap clear local test data.
   Expected: counts return to zero.
5. Reopen app again.
   Expected: database still initializes cleanly.

Delivery log requirement:

- Include APK details, migration version, diagnostics results, and seed/clear behavior.

---

## ~~EA-P1-003 - First-Run Admin and Inspector Setup APK~~

Status: `[x] User tested`

Credential distribution chosen: Admin PIN manual setup (on-device, no QR or pre-seeded build for Phase 1).

APK increment result:

- User can install a fresh APK and complete first-run setup without internet.

Requirements:

- Store users locally in SQLite.
- Store passwords and Admin PIN as secure hashes, never plain text.
- Add first-launch setup for Admin PIN and first inspector/admin user.
- Support the selected credential distribution path for Phase 1.
- Add a simple admin user list after setup so the created user can be verified.
- Prevent setup from being skipped into an unusable app state.

Expectations:

- A fresh install guides the user through local setup.
- Credentials remain device-local unless a later sync phase is explicitly enabled.

Use cases:

- Office admin prepares a phone before handing it to an inspector.
- Inspector confirms the app can be set up without network access.

Phone smoke tests:

1. Fresh install and open app in airplane mode.
   Expected: first-run setup appears.
2. Try to continue with missing Admin PIN or user fields.
   Expected: app blocks progress with a clear error.
3. Complete setup.
   Expected: setup completes and created user is visible in admin/user verification screen.
4. Close and reopen app.
   Expected: setup does not appear again.
5. Clear app data and reopen.
   Expected: setup appears again for a fresh device state.

Delivery log requirement:

- Include selected credential option, APK details, setup data used, and offline setup result.

---

## ~~EA-P1-004 - Offline Login, Session Restore, and Logout APK~~

Status: `[x] User tested`

APK increment result:

- User can log in offline, close/reopen the app, restore the session, and log out.

Requirements:

- Add offline login screen with username and password.
- Validate credentials against the local user store.
- Persist session securely on the device.
- Add logout that clears session but does not delete local data.
- Add optional biometric unlock if available on the test device.
- Handle wrong password and inactive/unauthorised local account states.

Expectations:

- Login never requires a network call.
- Session survives app close/reopen until logout or configured expiry.
- Biometric unlock is a shortcut, not the only access path.

Use cases:

- Inspector logs in on site with no internet.
- Inspector reopens the app and continues from an existing session.
- Inspector logs out before handing the phone to another user.

Phone smoke tests:

1. Turn on airplane mode and open app.
   Expected: login works without network.
2. Enter wrong credentials.
   Expected: login fails with clear error.
3. Enter valid credentials.
   Expected: app opens the post-login placeholder/Dashboard.
4. Force close and reopen app.
   Expected: valid session is restored or biometric prompt appears if enabled.
5. Log out.
   Expected: app returns to login and local setup/data remains.

Delivery log requirement:

- Include APK details, test credentials, offline state, session behavior, and biometric behavior if tested.

---

## EA-P1-005 - App Shell, Navigation, Theme, and Safe-Area APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can navigate the main app shell on a phone and verify theme/safe-area behavior.

Requirements:

- Implement navigable placeholders for Dashboard, Site Audit, Zone Workspace, Audit Report, Photo Preview, Client Report, Settings, Login, and Admin where not already built.
- Add top header or equivalent detail-screen header with correct back behavior.
- Add bottom navigation for Home and Settings on main screens.
- Support light, dark, and system theme.
- Respect Android safe areas, keyboard overlap, hardware back button, and small-screen layouts.

Expectations:

- Routes can still be placeholders, but navigation must be real and testable.
- Theme changes are persisted locally.

Use cases:

- Inspector moves through the app structure before full features are filled in.
- Product owner confirms the phone navigation model early.

Phone smoke tests:

1. Log in and navigate Home -> Settings -> Home.
   Expected: bottom navigation works and active tab is clear.
2. Navigate Dashboard -> placeholder Audit -> placeholder Zone -> back.
   Expected: back behavior returns to the correct parent.
3. Toggle light/dark/system theme.
   Expected: theme changes immediately and persists after restart.
4. Rotate or use a small-screen phone if supported.
   Expected: content is not hidden behind header, bottom nav, notch, or keyboard.

Delivery log requirement:

- Include APK details, route list tested, theme result, and phone/screen size.

---

## EA-P1-006 - Dashboard Local Audit List APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can install the APK and test a local Dashboard with sample or real local audit records.

Requirements:

- Load local audits sorted by newest created date first.
- Show audit cards with site name, address, inspector, date, and status.
- Add search by site name or inspector name, case-insensitive.
- Add empty, loading, and no-search-results states.
- Add local pull-to-refresh/reload behavior.
- Support delete audit from card with confirmation and local cascade.
- If audit creation is not yet available, keep diagnostics seed sample audits available for this increment.

Expectations:

- Dashboard works fully offline.
- The user can test list/search/delete on a phone before the full audit form is built.

Use cases:

- Inspector searches previous audits.
- Inspector deletes an accidental test audit.

Phone smoke tests:

1. Open Dashboard with no audits.
   Expected: empty state is shown.
2. Seed sample audits or use existing local audits.
   Expected: cards appear newest first.
3. Search by partial site and inspector names.
   Expected: matching cards remain and non-matches hide.
4. Pull to refresh.
   Expected: list reloads from local SQLite without network.
5. Delete one audit card.
   Expected: confirmation appears, card disappears after confirm, and it remains gone after restart.

Delivery log requirement:

- Include APK details, sample audit names, search terms, and delete persistence result.

---

## EA-P1-007 - Audit Create/Edit/Delete/Complete APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can create a real audit on the phone, edit it, mark it complete, delete it, and see the Dashboard update.

Requirements:

- Add create and edit modes for site details.
- Fields: site name, site address, inspector, audit date, status.
- Require site name, site address, and inspector.
- Save audit locally.
- Mark Draft audits as Completed.
- Delete audit from the audit screen with confirmation and cascade.
- Show status badge and report access placeholder when applicable.

Expectations:

- Validation prevents incomplete required audit records.
- Completed status persists after restart.
- Offline app records completion locally; network email is deferred to Phase 4.

Use cases:

- Inspector starts a new site audit.
- Inspector corrects site details.
- Inspector marks audit complete after capture.

Phone smoke tests:

1. Tap Start New Site Audit.
   Expected: create audit form opens.
2. Try saving with missing required fields.
   Expected: save is blocked with feedback.
3. Create a valid audit.
   Expected: audit saves and appears on Dashboard.
4. Edit address/date and reopen audit.
   Expected: changes persist.
5. Mark Completed.
   Expected: status badge changes and persists after restart.
6. Delete audit from audit screen.
   Expected: app returns to Dashboard and audit is gone.

Delivery log requirement:

- Include APK details, audit data used, validation result, completion result, and deferred-email note.

---

## EA-P1-008 - Zone Management APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can create zones inside an audit and open the Zone Workspace on the phone.

Requirements:

- List zones under the audit.
- Add zone with required zone name and optional description.
- Delete zone with cascade to equipment/photo references in that zone.
- Open Zone Workspace from zone card.
- Show zone header, description, and equipment count.
- Add clear empty zone state and Add First Zone CTA.

Expectations:

- Zones give inspectors the same site-division workflow as the web app.
- Zone deletion cannot leave orphaned equipment records.

Use cases:

- Inspector creates "Warehouse", "Office", and "Rooftop" zones.
- Inspector opens a zone before capturing equipment.

Phone smoke tests:

1. Open an existing audit and tap Add Zone.
   Expected: add zone dialog/screen appears.
2. Try adding without zone name.
   Expected: save is blocked.
3. Add named zone with description.
   Expected: zone appears in the audit zone list.
4. Tap zone.
   Expected: Zone Workspace opens with correct zone name/description.
5. Delete zone.
   Expected: zone disappears and remains gone after restart.

Delivery log requirement:

- Include APK details, zone names tested, workspace behavior, and delete persistence result.

---

## EA-P1-009 - Local Photo Capture and Storage APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can take or choose photos on the phone, see thumbnails, remove photos, and verify they persist offline.

Requirements:

- Support camera capture for zone photos and reusable primary/multi-photo components.
- Support gallery import for zone photos and reusable primary/multi-photo components.
- Store original photos in an organised local filesystem structure.
- Create compressed copies for future report/PDF generation.
- Show previews and remove controls.
- Handle camera/gallery permission denial gracefully.
- Track photo references in SQLite.

Expectations:

- Photos work offline and are not uploaded in Phase 1.
- File paths are stable after app restart.
- Removing a photo updates UI, database references, and local storage cleanup where safe.

Use cases:

- Inspector captures overview photos for a zone.
- Inspector removes a blurry photo before continuing.

Phone smoke tests:

1. Open a zone and add photo from camera.
   Expected: thumbnail appears.
2. Add photo from gallery.
   Expected: second thumbnail appears.
3. Close and reopen app.
   Expected: thumbnails remain.
4. Remove one photo.
   Expected: thumbnail and photo reference are removed.
5. Deny camera permission on a fresh permission state if possible.
   Expected: app shows clear recovery or gallery fallback.

Delivery log requirement:

- Include APK details, photo storage path pattern, permission behavior, and compression settings.

---

## EA-P1-010 - Equipment Framework APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can open a zone and see the full 9-type equipment grid, with Phase 1 equipment enabled and Phase 2 equipment clearly deferred.

Requirements:

- Show all 9 equipment type buttons in the Add Equipment grid so no web category is hidden.
- Open a form/dialog route for Main Switchboard, HVAC, and Lighting when their forms are implemented in later increments.
- Show "Coming in Phase 2" or disabled state for Additional Switchboard, Solar PV, Forklift Charger, Hot Water System, General Water, and General Electricity until Phase 2.
- Add the equipment list area grouped by type with count, label, sub-label, edit action, and delete action framework.
- Add temporary placeholder behavior only if needed to test list/edit/delete structure before the real Phase 1 forms arrive.

Expectations:

- Inspectors can see the complete future equipment surface from Phase 1.
- Phase 2 can enable remaining forms without redesigning the zone workspace.

Use cases:

- Product owner confirms no web equipment category is missing.
- Inspector sees which categories are available now and which are planned for Phase 2.

Phone smoke tests:

1. Open Zone Workspace.
   Expected: all 9 equipment buttons are visible.
2. Tap Phase 2 equipment type.
   Expected: app clearly shows Coming in Phase 2 or disabled behavior.
3. Tap Main Switchboard, HVAC, and Lighting.
   Expected: app opens implemented form if available, or a clearly labelled next-increment placeholder.
4. If placeholder equipment list is included, add/edit/delete placeholder item.
   Expected: list behavior works and persists according to design.

Delivery log requirement:

- Include APK details, enabled/deferred equipment behavior, and screenshots/notes confirming all 9 types are visible.

---

## EA-P1-011 - Main Switchboard Capture APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can add, edit, delete, and persist Main Switchboard records with photos.

Requirements:

- Implement the full Main Switchboard form from `docs/DATA_MODELS.md`.
- Required field: name.
- Fields: name, location, map locator/GPS, site NMI, primary photo, sub-circuits description, comments, extra notes, extra photos.
- Support add, edit, delete, local persistence, and list display.
- Prepare report data mapping for MVP PDF.

Expectations:

- Field labels and ordering match the web form unless native UX requires a documented adjustment.
- Photo fields use the shared local photo system.

Use cases:

- Inspector records the main distribution board.
- Inspector adds NMI and sub-circuit notes.
- Inspector attaches extra board photos.

Phone smoke tests:

1. Open Zone Workspace and tap Main Switchboard.
   Expected: Main Switchboard form opens.
2. Save without name.
   Expected: save is blocked.
3. Save with name, location, NMI, notes, primary photo, and extra photo.
   Expected: item appears in zone equipment list.
4. Edit sub-circuit description.
   Expected: changed text persists after restart.
5. Delete the item.
   Expected: item disappears and remains gone.

Delivery log requirement:

- Include APK details, form fields verified, photos tested, and persistence result.

---

## EA-P1-012 - HVAC Unit Capture APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can add, edit, delete, and persist HVAC records with all Phase 1 HVAC photo fields.

Requirements:

- Implement the full HVAC form from `docs/DATA_MODELS.md`.
- Required field: unit name.
- Include outdoor unit, indoor unit, controller, thermostat/sensor, capacity, power phase, coverage, notes, and photo fields.
- Support add, edit, delete, local persistence, and list display.
- Prepare report data mapping for MVP PDF.

Expectations:

- Numeric capacity fields store numbers.
- Type and power phase selection use native-friendly controls.
- HVAC photo fields render correctly in later report increments.

Use cases:

- Inspector records packaged or split HVAC units.
- Inspector captures outdoor/indoor nameplates and controller photos.
- Inspector records energy improvement notes.

Phone smoke tests:

1. Open Zone Workspace and tap HVAC Unit.
   Expected: HVAC form opens.
2. Save without unit name.
   Expected: save is blocked.
3. Save unit with make/model, capacities, power phase, and photos.
   Expected: item appears in zone list with `make - model` sub-label.
4. Edit controller model and coverage.
   Expected: values persist after restart.
5. Delete the item.
   Expected: item disappears and remains gone.

Delivery log requirement:

- Include APK details, selected HVAC type, numeric fields tested, photos tested, and persistence result.

---

## EA-P1-013 - Lighting System Capture APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can add, edit, delete, and persist Lighting records with fixture/control photos.

Requirements:

- Implement the full Lighting System form from `docs/DATA_MODELS.md`.
- Required field: light type.
- Include brand/model, primary photo, rated wattage, quantity, fixtures installed, fixture photo, area/location, controls type, operating hours, mounting height, mounting constraint photo, circuit grouping, sensors photo, access limitations, switchboard/control photo, energy improvement observations, extra notes, and extra photos.
- Support add, edit, delete, local persistence, and list display.
- Prepare report data mapping for MVP PDF.

Expectations:

- Quantity stores an integer.
- Rated wattage stores a number.
- List sub-label includes area/location and quantity when present.

Use cases:

- Inspector records LED highbay fixtures in a warehouse.
- Inspector captures sensor/control photos.
- Inspector records operating hours and access limitations.

Phone smoke tests:

1. Open Zone Workspace and tap Lighting System.
   Expected: Lighting form opens.
2. Save without light type.
   Expected: save is blocked.
3. Save lighting with wattage, quantity, area, controls, and photos.
   Expected: item appears in zone list with correct sub-label.
4. Edit quantity.
   Expected: new quantity persists and list updates.
5. Delete the item.
   Expected: item disappears and remains gone.

Delivery log requirement:

- Include APK details, required-field validation, numeric persistence, photos tested, and list output verified.

---

## EA-P1-014 - Internal Audit Review MVP APK

Status: `[D] Delivered for user testing`

APK increment result:

- User can review captured Phase 1 audit data by zone and by equipment before generating a PDF.

Requirements:

- Add internal audit review screen reachable from completed audits or audit workflow.
- Show audit header: site, address, inspector, date, zone count, equipment count.
- Support By Zone and By Equipment tabs.
- Include Main Switchboard, HVAC, and Lighting data.
- Add navigation to Photo Preview/Client Report flow placeholder or MVP PDF flow.

Expectations:

- The screen helps inspectors review captured data before producing the client PDF.
- Counts match local database records.

Use cases:

- Inspector reviews all captured items before report export.
- Inspector switches between zone-oriented and equipment-oriented views.

Phone smoke tests:

1. Create an audit with two zones and three Phase 1 equipment items.
   Expected: review header counts are correct.
2. Open By Zone tab.
   Expected: equipment appears under the correct zones.
3. Open By Equipment tab.
   Expected: items are grouped by equipment type.
4. Navigate back to audit and zone.
   Expected: back behavior is correct.

Delivery log requirement:

- Include APK details, audit fixture used, count verification, and review navigation behavior.

---

## EA-P1-015 - MVP Offline PDF Save and Share APK

Status: `[ ] Backlog`

APK increment result:

- User can generate, open, save, and share a branded MVP PDF from a real Phase 1 audit on the phone.

Requirements:

- Generate PDF on-device without internet.
- Include report header, site details, inspector, date, executive summary, Electrical/Main Switchboard, HVAC, Lighting, consolidated observations, footer, and page numbers.
- Bundle required fonts/assets locally.
- Embed compressed local photos.
- Save the generated PDF to local filesystem.
- Share PDF through Android share sheet.
- Regenerate PDF after audit data changes.

Expectations:

- PDF is readable, branded, and usable for client review.
- No remote image or font dependency exists.
- Large-enough Phase 1 audits do not crash the app.

Use cases:

- Inspector creates a report at a site with no internet.
- Inspector shares the report through email/WhatsApp/Drive when available.
- Inspector edits lighting quantity and regenerates PDF.

Phone smoke tests:

1. Put phone in airplane mode.
   Expected: PDF generation still works.
2. Generate PDF with one Main Switchboard, one HVAC, one Lighting item, and photos.
   Expected: PDF contains all entered data and photos.
3. Open saved PDF from local storage or viewer.
   Expected: file opens and pages render correctly.
4. Use Android share sheet.
   Expected: PDF file is shared as an attachment.
5. Edit audit/equipment data and regenerate.
   Expected: regenerated PDF reflects the edit.

Delivery log requirement:

- Include APK details, PDF file path, sample audit contents, phone model, output file size, and share result.

---

## EA-P1-016 - Settings, Admin, Storage, and Housekeeping APK

Status: `[ ] Backlog`

APK increment result:

- User can manage local app settings and verify storage/admin controls on the phone.

Requirements:

- Show current local user profile.
- Provide theme settings if not already complete.
- Provide logout.
- Provide Admin PIN entry and admin user-management access.
- Support add/edit/deactivate/reset password for inspectors according to Phase 1 credential decision.
- Show app version/build number.
- Show local storage usage for audits, photos, and PDFs.
- Show sync controls as disabled/coming-soon if sync is not in Phase 1.

Expectations:

- Settings contains all operational controls needed by an inspector/admin in Phase 1.
- Storage information helps identify device-space issues early.

Use cases:

- Inspector checks logged-in user.
- Admin updates an inspector account.
- Inspector sees device storage usage before a large audit.

Phone smoke tests:

1. Open Settings as inspector.
   Expected: profile, theme, logout, version, and storage are visible.
2. Enter wrong Admin PIN.
   Expected: access is blocked.
3. Enter correct Admin PIN.
   Expected: admin panel opens.
4. Add or update an inspector.
   Expected: updated account can be used according to login rules.
5. Capture photos/PDF and return to storage usage.
   Expected: storage value changes.
6. Tap disabled sync control.
   Expected: app clearly says sync is coming later.

Delivery log requirement:

- Include APK details, settings controls tested, admin actions tested, and storage calculation behavior.

---

## EA-P1-017 - Phase 1 Release Candidate APK and Sign-Off Pack

Status: `[ ] Backlog`

APK increment result:

- User receives a Phase 1 release-candidate APK and a complete smoke-test package for acceptance testing.

Requirements:

- Create a repeatable Phase 1 smoke-test script.
- Cover install, first setup, login, admin, dashboard, audit, zones, photos, Main Switchboard, HVAC, Lighting, review, PDF, save/share, restart persistence, settings, and logout.
- Run on at least two Android devices or one device plus one emulator if physical devices are constrained.
- Prepare delivery-log entries for all completed Phase 1 features.
- Keep delivery log open until user testing is complete.
- Remove, hide, or clearly gate temporary diagnostics/seed tools that should not be in production tester builds.

Expectations:

- Phase 1 can be tested consistently by developer and user.
- Bugs found during user testing map back to backlog item IDs.
- The release-candidate APK is the first build intended to represent the whole Phase 1 MVP.

Use cases:

- Developer verifies release candidate.
- User follows the smoke script to accept Phase 1.

Phone smoke tests:

1. Install release-candidate APK from a clean device state.
   Expected: setup starts cleanly and app opens.
2. Run the full Phase 1 script from fresh audit creation to PDF share.
   Expected: every critical path passes without crash.
3. Reopen app after completing an audit.
   Expected: data, photos, and generated PDF remain accessible.
4. Review delivery log.
   Expected: every delivered Phase 1 backlog item has clear user-test instructions.
5. Move accepted items to tested log after user approval.
   Expected: accepted backlog items are struck off and marked `[x] User tested`.

Delivery log requirement:

- Include release-candidate APK details, final smoke script, devices tested, failures fixed, and user-testing package location.

