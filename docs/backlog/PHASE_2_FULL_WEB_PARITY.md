# Phase 2 Backlog - Full Web Parity

Goal: complete feature parity with the current Base44 web app for audit capture, photo/report management, and PDF output.

Phase 2 starts after Phase 1 user sign-off. It turns the MVP into the complete Energy Audit app by enabling the remaining equipment types and report tooling.

## Phase 2 Exit Criteria

- All 9 equipment types can be added, edited, deleted, reviewed, and reported.
- Photo include/exclude works across all photo fields.
- Live report preview reflects edited content and excluded photos.
- ZIP image export works and is organised by zone.
- Full PDF can include all current web sections.
- Download options can include/exclude sections and individual equipment items.
- Internal report views include all equipment types.
- Phase 2 delivery entries are user tested and moved to the tested log.

---

## EA-P2-001 - Additional Switchboard Capture

Status: `[ ] Backlog`

Requirements:

- Enable Additional Switchboard form in Zone Workspace.
- Required field: name.
- Fields: name, location, map locator/GPS, type selector (`MSSB`, `PVDB`, `DSB-W`, `DSB-S`), primary photo, sub-circuits description, comments, extra notes, extra photos.
- Add, edit, delete, list, internal-review, and PDF support.

Expectations:

- Additional Switchboards appear with Main Switchboards in the Electrical Infrastructure report section.
- The type selector preserves exact values used in the web app.

Use cases:

- Inspector records a PV distribution board.
- Inspector records multiple sub-boards in one zone.

Smoke tests:

1. Add Additional Switchboard without name.
   Expected: save is blocked.
2. Add with name, type, location, notes, and photos.
   Expected: item appears in zone list and review screens.
3. Generate full PDF.
   Expected: Additional Switchboard appears in Electrical Infrastructure.
4. Edit type from `MSSB` to `PVDB`.
   Expected: changed type persists and report updates.

Delivery log requirement:

- Include type selector values tested and report output verification.

---

## EA-P2-002 - Solar PV Capture

Status: `[ ] Backlog`

Requirements:

- Enable Solar PV form in Zone Workspace.
- Fields: system size, roof photo, inverter brand/model, inverter location, inverter label photo, power supply to PV, electricity meter photo, available roof space, roof space amount, additional solar space photo, suitable switchboard, switchboard photo, switchboard location, cable distance, cable route description, energy improvement observations, extra notes, extra photos.
- Preserve conditional behavior for roof-space fields when available roof space is `Yes`.
- Add, edit, delete, list, internal-review, and PDF support.

Expectations:

- Solar PV data supports both existing systems and solar opportunity assessment.
- Conditional fields do not lose saved data unexpectedly.

Use cases:

- Inspector records existing PV infrastructure.
- Inspector records available roof space and cable path.

Smoke tests:

1. Add Solar PV with system size and inverter details.
   Expected: item appears as Solar PV with size where available.
2. Select available roof space `Yes`.
   Expected: roof space amount and extra photo fields appear.
3. Save photos and reopen.
   Expected: all photos and conditional fields persist.
4. Generate PDF.
   Expected: Solar PV Infrastructure section appears with entered data.

Delivery log requirement:

- Include conditional-field behavior and PDF output result.

---

## EA-P2-003 - Forklift Charger Capture

Status: `[ ] Backlog`

Requirements:

- Enable Forklift Charger form in Zone Workspace.
- Required field: charger type.
- Fields: charger type, charger photo, brand/model, rating, charger label photo, power supply, electric connection photo, location, quantity, charger space photo, connection description, socket/isolator/switchboard photo, local isolator, circuit identifiable, distance to switchboard, space for additional chargers, hardwired/socket, scheduling opportunity, energy improvement observations, extra notes, extra photos.
- Add, edit, delete, list, internal-review, and PDF support.

Expectations:

- Yes/no and hardwired/socket fields are constrained to expected values.
- Quantity is numeric and renders correctly.

Use cases:

- Inspector records charging infrastructure and scheduling opportunity.
- Inspector documents whether extra chargers can be added.

Smoke tests:

1. Save without charger type.
   Expected: save is blocked.
2. Save charger with quantity, isolator, circuit, and scheduling fields.
   Expected: values persist and list sub-label uses brand/model.
3. Attach connection and label photos.
   Expected: photos render in preview/PDF.
4. Generate PDF.
   Expected: Forklift Charging Operations section appears.

Delivery log requirement:

- Include constrained option values and report verification.

---

## EA-P2-004 - Hot Water System Capture

Status: `[ ] Backlog`

Requirements:

- Enable Hot Water System form in Zone Workspace.
- Required field: DHW details/type.
- Fields: DHW details/type, primary photo, serial number, size litres, fuel type, location, pipe insulation, pipe insulation thickness, tempering valve, additional photo, more DHW systems, additional comments, energy improvement observations, extra notes, extra photos.
- Add, edit, delete, list, internal-review, and PDF support.

Expectations:

- Size stores as numeric litres.
- Yes/no fields use constrained values.

Use cases:

- Inspector records electric or gas hot water systems.
- Inspector records pipe insulation and tempering valve observations.

Smoke tests:

1. Save without DHW details/type.
   Expected: save is blocked.
2. Save with size, fuel type, insulation, valve, comments, and photos.
   Expected: item appears with fuel type/size sub-label.
3. Edit pipe insulation.
   Expected: value persists.
4. Generate PDF.
   Expected: Hot Water Systems section appears.

Delivery log requirement:

- Include numeric and yes/no field behavior tested.

---

## EA-P2-005 - General Water and General Electricity Q&A Capture

Status: `[ ] Backlog`

Requirements:

- Enable General Water form.
- Enable General Electricity form.
- Fields for both: question, answer, photos, extra notes, extra photos.
- Add, edit, delete, list, internal-review, and PDF support.
- Allow multiple Q&A items per zone.

Expectations:

- Q&A entries support flexible observations not covered by structured equipment forms.
- Long questions/answers remain readable in list and report views.

Use cases:

- Inspector records a water observation with supporting photos.
- Inspector records a general electrical question and answer.

Smoke tests:

1. Add a General Water Q&A with two photos.
   Expected: item appears in zone list and report section.
2. Add a General Electricity Q&A with long answer text.
   Expected: text is readable and does not overflow.
3. Edit answer.
   Expected: updated answer persists after restart.
4. Generate PDF.
   Expected: General Water and General Electricity sections appear.

Delivery log requirement:

- Include long-text behavior and PDF output verification.

---

## EA-P2-006 - Full Report Sections for All Equipment Types

Status: `[ ] Backlog`

Requirements:

- Extend PDF templates to include all current web report sections:
  - Executive Summary
  - Electrical Infrastructure
  - HVAC Systems
  - Lighting Systems
  - Solar PV Infrastructure
  - Forklift Charging Operations
  - Hot Water Systems
  - General Water Systems
  - General Electricity Systems
  - Consolidated Observations
- Preserve branding, header/footer, page numbers, typography, and readable tables/cards.
- Hide empty equipment sections unless required by report configuration.

Expectations:

- Report output is recognisably equivalent to the web PDF, adapted for offline native rendering.
- Photos and tables do not split in a visually broken way when avoidable.

Use cases:

- Inspector generates a complete client report after a full audit.
- Inspector generates a report with only the equipment types present at a site.

Smoke tests:

1. Create an audit with one item in every equipment type.
   Expected: every section appears in generated PDF.
2. Create an audit with only Solar PV.
   Expected: empty unrelated equipment sections are omitted.
3. Include photos in each type.
   Expected: photos render under correct items.
4. Review PDF across multiple pages.
   Expected: header/footer/page numbers are correct.

Delivery log requirement:

- Include sample audit contents, generated PDF filename/path, and sections verified.

---

## EA-P2-007 - Report Content Editor

Status: `[ ] Backlog`

Requirements:

- Let user edit executive summary before export.
- Let user edit consolidated observations before export.
- Preserve edits while moving between photo preview, live preview, and client report export.
- Do not overwrite underlying audit/equipment data unless explicitly designed as saved report content.

Expectations:

- Edits affect the generated PDF and live preview.
- User can cancel or leave without corrupting audit records.

Use cases:

- Inspector customises the executive summary for a client.
- Inspector adds final consolidated observations before export.

Smoke tests:

1. Edit executive summary.
   Expected: live preview shows edited text.
2. Edit consolidated observations.
   Expected: live preview and PDF show edited text.
3. Navigate back and return to report flow.
   Expected: edit persistence follows the chosen design.
4. Generate PDF.
   Expected: edited content is included.

Delivery log requirement:

- Document whether edits are transient or saved, and how persistence was tested.

---

## EA-P2-008 - Photo Selection and Live Report Preview

Status: `[ ] Backlog`

Requirements:

- Gather photos from all equipment fields and group by equipment type, item, and zone.
- Show selected/total count.
- Allow per-photo include/exclude.
- Allow include/exclude all photos in a group.
- Show live report preview with excluded photos removed.
- Continue to PDF generation with excluded-photo state applied.

Expectations:

- Photo selection matches web behavior and works across all 9 equipment types.
- Excluded photos never appear in generated PDF.

Use cases:

- Inspector excludes blurry photos from the client report.
- Inspector excludes all photos for a specific equipment item.

Smoke tests:

1. Add multiple photos across three equipment types.
   Expected: photos are grouped with correct labels.
2. Exclude one photo.
   Expected: count decreases and preview removes it.
3. Exclude all photos in one group.
   Expected: group photos are all marked excluded.
4. Generate PDF.
   Expected: excluded photos are absent.

Delivery log requirement:

- Include selected/excluded counts and PDF verification.

---

## EA-P2-009 - ZIP Export of Selected Images

Status: `[ ] Backlog`

Requirements:

- Export included photos as a ZIP file.
- Organise ZIP folders by zone.
- Use safe filenames based on equipment type, item label, and photo label.
- Exclude photos that the user excluded from report/photo selection.
- Save or share the ZIP file from Android.

Expectations:

- ZIP contents are easy to browse after transfer to a computer.
- Export handles duplicate labels without overwriting files.

Use cases:

- Inspector sends all client-approved audit photos separately from the report.
- Office staff transfers zone-organised photos from the device.

Smoke tests:

1. Add photos in two zones.
   Expected: ZIP contains two zone folders.
2. Exclude one photo.
   Expected: excluded photo is not in ZIP.
3. Add duplicate equipment names.
   Expected: ZIP filenames remain unique.
4. Open ZIP on device or desktop.
   Expected: files are valid images.

Delivery log requirement:

- Include ZIP filename, folder layout, and excluded-photo behavior.

---

## EA-P2-010 - Download Options: Sections and Items

Status: `[ ] Backlog`

Requirements:

- Provide download options before PDF export.
- Allow selecting/clearing all report sections.
- Allow selecting individual equipment items inside sections where applicable.
- Include all web report sections and add General Water/Electricity selection if required for parity completeness.
- Disable export when no sections are selected.

Expectations:

- Exported PDF reflects exactly the selected sections/items.
- Selection UI remains usable on small Android screens.

Use cases:

- Inspector exports a report excluding Solar PV.
- Inspector exports a report with only selected HVAC units.

Smoke tests:

1. Clear all sections.
   Expected: export is disabled.
2. Select only HVAC and one HVAC item.
   Expected: PDF includes only that selected HVAC section/item plus required report framing.
3. Select Electrical.
   Expected: Main and Additional Switchboards are included according to selection design.
4. Select all.
   Expected: full report exports.

Delivery log requirement:

- Include selected section/item combinations tested and resulting PDF behavior.

---

## EA-P2-011 - Full Internal Audit Review by Zone and Equipment

Status: `[ ] Backlog`

Requirements:

- Extend internal report/review views to include all 9 equipment types.
- By Zone view must show all equipment attached to each zone.
- By Equipment view must group all equipment by type.
- Counts must include all types and match database records.
- Provide navigation back to source audit/zone where practical.

Expectations:

- Inspector can audit-check all captured data before PDF export.
- The review screen handles empty equipment groups cleanly.

Use cases:

- Inspector validates that every zone has been captured.
- Inspector reviews all Solar PV or all HVAC records across zones.

Smoke tests:

1. Create records in all 9 equipment types across two zones.
   Expected: By Zone shows each item under correct zone.
2. Open By Equipment.
   Expected: all 9 groups appear with correct counts.
3. Delete one item.
   Expected: counts update after reload.
4. Open audit with no equipment.
   Expected: empty review state is clear.

Delivery log requirement:

- Include count fixture and all-type review verification.

---

## EA-P2-012 - Phase 2 Full-Parity Regression and Sign-Off

Status: `[ ] Backlog`

Requirements:

- Build a full web-parity smoke script.
- Cover all 9 forms, all photo paths, review views, photo selection, ZIP export, report content edits, download options, and full PDF export.
- Run against at least one audit containing every equipment type.
- Update [FEATURE_PARITY_MATRIX.md](FEATURE_PARITY_MATRIX.md) if any feature is added, deferred, or marked N/A.
- Ensure delivery log has one entry per delivered Phase 2 item.

Expectations:

- Phase 2 cannot sign off while a current web feature is missing from backlog or delivery/tested tracking.

Use cases:

- Developer validates complete feature parity.
- User accepts full Energy Audit workflow.

Smoke tests:

1. Run full-parity smoke script from fresh audit creation to full PDF.
   Expected: every current web workflow has an Android equivalent.
2. Compare generated report contents to web feature list.
   Expected: no missing equipment sections or photo/report controls.
3. Review delivery and tested logs.
   Expected: all accepted Phase 2 features are moved to tested log and struck from backlog.

Delivery log requirement:

- Include the full-parity test audit, devices tested, and parity exceptions if any.

