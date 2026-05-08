# Phase 3 Backlog - Production Hardening

Goal: make the fully-parity Android app reliable, polished, testable, and ready for real inspectors.

Phase 3 starts after Phase 2 user sign-off. No new feature should enter Phase 3 unless it supports production readiness or fixes a user-tested parity gap.

## Phase 3 Exit Criteria

- Production branding is complete.
- First-time setup and empty states are polished.
- App handles expected errors without crashes.
- PDF and photo workflows are stable on low-end Android hardware.
- Play Store/internal distribution package is prepared.
- Handover docs are complete.
- Delivery/tested workflow is complete for all Phase 3 items.

---

## EA-P3-001 - Branding, Icon, Splash, and App Metadata

Status: `[ ] Backlog`

Requirements:

- Add branded app icon and adaptive Android icon.
- Add splash screen matching Sustainability Wise branding.
- Set app name, package ID, version, build number, and display metadata.
- Verify brand colours and report branding remain consistent.

Expectations:

- Installed app is recognisable on Android home screen and settings.
- Build metadata supports release tracking.

Use cases:

- Inspector installs APK and identifies the correct app.
- Support team references app version during troubleshooting.

Smoke tests:

1. Install APK on Android.
   Expected: app name and icon are correct.
2. Cold start the app.
   Expected: splash screen appears without stretched or cropped assets.
3. Open Settings.
   Expected: app version/build number is visible.

Delivery log requirement:

- Include build number, installed app name, and screenshots or notes from device check.

---

## EA-P3-002 - First-Time Onboarding and Setup Polish

Status: `[ ] Backlog`

Requirements:

- Polish first-launch setup flow for Admin PIN and first user.
- Provide clear error states for invalid PIN/password inputs.
- Add onboarding copy only where needed to complete setup.
- Ensure setup cannot be skipped into an unusable app state.

Expectations:

- A non-developer can set up a fresh device.
- Setup flow is short, clear, and recoverable.

Use cases:

- Office admin prepares a new device for an inspector.
- Inspector receives a device and logs in for the first time.

Smoke tests:

1. Fresh install with no database.
   Expected: setup flow appears first.
2. Try weak/invalid PIN or missing user fields.
   Expected: setup blocks progress with clear error.
3. Complete setup.
   Expected: app opens Dashboard and does not show setup again.

Delivery log requirement:

- Include setup scenarios tested and any approved credential constraints.

---

## EA-P3-003 - Empty, Loading, Error, and Permission States

Status: `[ ] Backlog`

Requirements:

- Review every main screen for empty, loading, error, and permission-denied states.
- Provide clear messages and recovery actions.
- Cover camera/gallery permission denial, low storage, failed PDF generation, failed ZIP export, database read/write errors, and invalid navigation targets.

Expectations:

- Failures are understandable and do not leave the user stuck.
- The app never shows raw technical errors to inspectors.

Use cases:

- Inspector denies camera permission.
- Device runs low on storage during a large audit.
- User opens a stale link to a deleted audit.

Smoke tests:

1. Deny camera permission.
   Expected: app provides recovery or gallery fallback.
2. Simulate missing audit/zone.
   Expected: app shows not-found state and a path back.
3. Force PDF generation failure if test hook exists.
   Expected: error message appears and user can retry.
4. Open empty audit and empty zone.
   Expected: helpful empty states are shown.

Delivery log requirement:

- Include screens audited and error states verified.

---

## EA-P3-004 - Accessibility, Touch Targets, Keyboard, and Android Back Behavior

Status: `[ ] Backlog`

Requirements:

- Ensure controls have accessible labels where needed.
- Minimum touch targets must be comfortable on phones.
- Keyboard should not cover active inputs or action buttons.
- Android hardware back must behave predictably across dialogs, camera, report flow, and nested screens.
- Check colour contrast in light and dark modes.

Expectations:

- Inspectors can use the app one-handed on site.
- Navigation feels native and does not lose unsaved work unexpectedly.

Use cases:

- Inspector fills a long form in a cramped plant room.
- Inspector dismisses a modal with Android back.

Smoke tests:

1. Complete each Phase 1 and Phase 2 form on a small phone.
   Expected: all fields and buttons are reachable.
2. Open form dialog and press Android back.
   Expected: dialog closes or prompts according to unsaved-change design.
3. Switch light/dark mode.
   Expected: text remains readable.
4. Use screen reader smoke check on core controls if available.
   Expected: buttons/inputs have meaningful labels.

Delivery log requirement:

- Include devices/screen sizes and back behavior verified.

---

## EA-P3-005 - Photo, Storage, and Orphan Cleanup Hardening

Status: `[ ] Backlog`

Requirements:

- Clean up orphaned photo files when audits, zones, equipment, or photo references are deleted.
- Preserve original photo files where retention policy requires it.
- Add storage usage calculation accuracy checks.
- Add safeguards for low-storage operations.
- Document photo folder structure for handover.

Expectations:

- Routine use does not leak large numbers of orphaned files.
- The user is warned before storage exhaustion causes data loss.

Use cases:

- Inspector deletes a test audit with many photos.
- Inspector checks storage before starting a large site.

Smoke tests:

1. Create audit with photos in zone and equipment.
   Expected: storage usage increases.
2. Delete photo references.
   Expected: removed files are cleaned according to policy.
3. Delete audit.
   Expected: child photo folders are removed or archived according to policy.
4. Simulate low storage if possible.
   Expected: app blocks or warns before risky operations.

Delivery log requirement:

- Include cleanup policy, storage before/after numbers, and folder paths.

---

## EA-P3-006 - PDF Performance and Large-Audit Stability

Status: `[ ] Backlog`

Requirements:

- Test PDF generation with large audits, including 50+ photos.
- Profile memory and runtime on low-end Android hardware.
- Optimise photo compression and template assembly if needed.
- Add progress indication and failure recovery for long PDF jobs.

Expectations:

- Large report generation completes without crash on target devices.
- User understands that generation is in progress.

Use cases:

- Inspector generates a complete report for a large warehouse.
- Inspector retries after a failed report generation attempt.

Smoke tests:

1. Generate PDF with at least 50 photos.
   Expected: PDF completes or fails gracefully with recoverable message.
2. Generate PDF on low-end Android target.
   Expected: no app crash.
3. Open generated PDF.
   Expected: pages render and photos are visible.
4. Regenerate after data edit.
   Expected: new file reflects updated data.

Delivery log requirement:

- Include device model, photo count, generation time, output size, and memory notes if available.

---

## EA-P3-007 - Device QA Matrix and Release Candidate Testing

Status: `[ ] Backlog`

Requirements:

- Define minimum supported Android version and target device classes.
- Run smoke suite on at least three device profiles when available: small phone, large phone, tablet or emulator equivalent.
- Track all release-candidate defects with backlog IDs or bug IDs.
- Retest fixed defects before sign-off.

Expectations:

- The release candidate is tested against realistic field devices.
- Known limitations are explicit before distribution.

Use cases:

- Product owner decides whether the APK is ready for inspectors.
- Support team understands device compatibility.

Smoke tests:

1. Run full Phase 1 + Phase 2 smoke suite on each target device.
   Expected: core flows pass.
2. Rotate device where supported.
   Expected: layout remains usable or orientation policy is enforced.
3. Restart app during an in-progress audit.
   Expected: saved data remains intact.

Delivery log requirement:

- Include device matrix, pass/fail summary, and unresolved issues.

---

## EA-P3-008 - Android Distribution and Play Store/Internal Testing

Status: `[ ] Backlog`

Requirements:

- Configure signing and secure keystore handling.
- Produce release APK/AAB.
- Prepare Play Store/internal testing assets if Play Store is in scope.
- Prepare privacy policy and data-safety notes for local storage, camera, photos, and optional future sync.
- Document install/update steps for direct APK distribution.

Expectations:

- App can be distributed to testers without developer handholding.
- Signing materials are handled securely.

Use cases:

- Product owner installs release APK on test devices.
- Internal testing track receives the first release candidate.

Smoke tests:

1. Build release artifact.
   Expected: signed artifact is produced successfully.
2. Install release artifact on clean device.
   Expected: app opens and setup flow works.
3. Upgrade from previous build if one exists.
   Expected: database migrations preserve data.
4. Validate privacy/data declarations.
   Expected: declarations match actual app behavior.

Delivery log requirement:

- Include artifact name/version, signing status, install path, and store submission status.

---

## EA-P3-009 - Handover Documentation and Operating Guide

Status: `[ ] Backlog`

Requirements:

- Document project setup and build process.
- Document local database schema and migrations.
- Document photo/PDF storage paths.
- Document credential/admin operations.
- Document known limitations and support procedures.
- Link delivery/tested logs for accepted scope.

Expectations:

- A new developer or support person can understand and operate the app.
- Product owner has a clear operational guide.

Use cases:

- Developer builds a new APK.
- Admin resets an inspector password.
- Support diagnoses missing photos or PDF issues.

Smoke tests:

1. Follow setup docs from a clean checkout.
   Expected: app runs.
2. Follow build docs.
   Expected: APK/AAB builds.
3. Follow admin guide.
   Expected: user-management task can be completed.
4. Follow storage guide.
   Expected: photo/PDF files can be located.

Delivery log requirement:

- Include docs added/updated and verification steps performed.

