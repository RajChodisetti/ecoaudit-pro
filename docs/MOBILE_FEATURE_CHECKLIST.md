# EcoAudit Pro — Mobile App Feature Checklist
## Complete parity verification against Base44 web app
> Tick every box before marking a phase complete. Nothing ships with an unticked box.

---

## HOW TO USE THIS CHECKLIST

- `[ ]` = Not started
- `[~]` = In progress
- `[x]` = Done and tested on a physical device
- `[N/A]` = Not applicable to mobile (noted with reason)

Each section has a **Phase** tag showing when it must be complete:
- **MVP** = Phase 1
- **FULL** = Phase 2
- **PROD** = Phase 3

---

---

# SECTION 1 — AUTHENTICATION & USER MANAGEMENT
> New for mobile — does not exist in web app (web uses Base44 auth)

## 1.1 Local User Store `[MVP]`
- [ ] SQLite `users` table created on first app launch
- [ ] Passwords stored as bcrypt hash — never plain text
- [ ] User record contains: id, username, full_name, email, role, created_at, is_active
- [ ] Admin user auto-created on first launch if no users exist
- [ ] `admin_config` table stores: admin_pin (hashed), app_version, setup_complete flag
- [ ] First-launch setup wizard (set admin PIN + create first inspector)

## 1.2 Login Screen `[MVP]`
- [ ] Username field (text input, auto-lowercase)
- [ ] Password field (text input, secure/masked)
- [ ] Show/hide password toggle button
- [ ] "Log In" button (disabled while fields are empty)
- [ ] Loading spinner during validation
- [ ] Error message on wrong credentials: "Incorrect username or password"
- [ ] Error message when account is inactive: "This account has been deactivated"
- [ ] No network call made — validation is 100% local SQLite
- [ ] Session token written to secure storage on success (expo-secure-store)
- [ ] Session persists across app close and reopen
- [ ] App navigates to Dashboard on successful login

## 1.3 Session Persistence `[MVP]`
- [ ] On app launch, check secure storage for existing session token
- [ ] If token valid → skip login, go directly to Dashboard
- [ ] If token expired or missing → show Login screen
- [ ] Session expiry configurable (default 30 days of inactivity)
- [ ] `last_active_at` updated on every app open

## 1.4 Biometric Unlock `[MVP]`
- [ ] After initial login, biometric prompt offered on next app open
- [ ] Face ID / fingerprint unlocks session without entering password
- [ ] Biometric can be enabled/disabled in Settings
- [ ] Falls back to password if biometric fails 3 times
- [ ] Biometric is device-local only — no network call

## 1.5 Admin Panel `[MVP]`
- [ ] Accessible from Settings with Admin PIN entry
- [ ] Admin PIN field (numeric, 4–6 digits, masked)
- [ ] Wrong PIN shows error: "Incorrect admin PIN"
- [ ] Admin panel shows list of all users
- [ ] Add inspector: full_name, username, password, role
- [ ] Edit inspector: full_name, active/inactive toggle
- [ ] Reset inspector password
- [ ] Deactivate inspector (soft delete — marks as inactive, does not delete audit data)
- [ ] Cannot deactivate the last remaining active admin
- [ ] Change admin PIN (requires current PIN first)

## 1.6 Credential Distribution via QR Code `[MVP]`
- [ ] Admin panel has "Generate QR" button per user
- [ ] QR encodes: username + temporary password (base64 or signed)
- [ ] New device scans QR → credentials pre-filled on login screen
- [ ] User prompted to change password after first QR-based login
- [ ] QR expires after 24 hours (configurable)

## 1.7 Logout `[MVP]`
- [ ] "Log Out" button in Settings
- [ ] Confirmation prompt: "Are you sure you want to log out?"
- [ ] Clears session token from secure storage
- [ ] Does NOT delete local audit data
- [ ] Navigates to Login screen

---

---

# SECTION 2 — NAVIGATION & LAYOUT

## 2.1 Bottom Navigation Bar `[MVP]`
- [ ] Visible on all main screens (Dashboard, Settings)
- [ ] Hidden on detail screens (Audit, Zone, Report)
- [ ] **Home** tab — icon: home, label: "Home", navigates to Dashboard
- [ ] **Settings** tab — icon: settings, label: "Settings", navigates to Settings
- [ ] Active tab highlighted in primary colour
- [ ] Inactive tabs in muted colour
- [ ] Safe area inset applied at the bottom (notch devices)
- [ ] Bottom nav does NOT appear on Login or Admin screens

## 2.2 Top Header `[MVP]`
- [ ] App logo / name: "Sustainability Wise" or branded icon
- [ ] Back button on detail screens (Audit, Zone, Report)
- [ ] Back button navigates to correct parent screen
- [ ] Header is sticky / fixed at top
- [ ] Header does NOT appear on Login screen

## 2.3 Screen Transitions `[MVP]`
- [ ] Smooth slide animation between screens
- [ ] No janky flashes or white frames between navigations
- [ ] Hardware back button (Android) works correctly on all screens

## 2.4 Safe Area Handling `[MVP]`
- [ ] Content not hidden behind status bar (top)
- [ ] Content not hidden behind bottom navigation bar
- [ ] Content not hidden behind device notch or punch-hole camera
- [ ] Keyboard does not cover active text inputs (scroll to focused field)

---

---

# SECTION 3 — DASHBOARD

## 3.1 Audit List `[MVP]`
- [ ] Loads all audits from local SQLite on mount
- [ ] Sorted by created_date descending (newest first)
- [ ] Shows audit count: "{n} audits"
- [ ] Pull-to-refresh reloads from SQLite
- [ ] Loading spinner while fetching

## 3.2 Audit Card Display `[MVP]`
Each card must show:
- [ ] Site name (truncated if long)
- [ ] Site address with MapPin icon
- [ ] Inspector name with User icon
- [ ] Audit date with Calendar icon, formatted as "MMM D, YYYY"
- [ ] Status badge ("Draft" or "Completed" with correct colour)
- [ ] Tap navigates to Site Audit screen (edit mode)
- [ ] Long-press or swipe reveals delete option OR delete icon on card

## 3.3 Delete Audit from Dashboard `[MVP]`
- [ ] Delete icon/button visible on each card
- [ ] Confirmation dialog: "Delete Audit?"
- [ ] Dialog body: "Are you sure you want to delete {site_name}? This cannot be undone."
- [ ] "Cancel" button dismisses dialog
- [ ] "Delete" button (red/destructive)
- [ ] Deletes audit + all zones + all equipment items in cascade from SQLite
- [ ] Card removed from list immediately (optimistic)
- [ ] Toast: "Audit deleted"

## 3.4 Search & Filter `[MVP]`
- [ ] Search bar at top of list
- [ ] Placeholder: "Search audits..."
- [ ] Filters by site_name OR inspector_name (case-insensitive, partial match)
- [ ] Results update in real-time as user types
- [ ] Clear button (X) appears when search has text
- [ ] Empty search result state: "No audits match your search"

## 3.5 Create New Audit `[MVP]`
- [ ] "Start New Site Audit" / "New Audit" button (prominent, primary colour)
- [ ] Navigates to Site Audit screen (create mode)

## 3.6 Empty State `[MVP]`
- [ ] Icon: clipboard or document icon
- [ ] Message: "No audits yet"
- [ ] Sub-text: "Start your first site audit to get going"
- [ ] CTA button: "Start New Site Audit"
- [ ] Empty state only shown when there are zero audits (not during search)

---

---

# SECTION 4 — SITE AUDIT (Create / Edit)

## 4.1 Site Details Form `[MVP]`
- [ ] **Site Name** — text input, required, placeholder: "Enter site name"
- [ ] **Site Address** — text input, required, placeholder: "Enter site address"
- [ ] **Inspector** — text input, required, placeholder: "Enter inspector name"
- [ ] **Date** — date picker, defaults to today's date, optional
- [ ] Required fields marked with asterisk or red indicator
- [ ] Keyboard "Next" moves focus to next field
- [ ] Keyboard "Done" on last field dismisses keyboard

## 4.2 Validation `[MVP]`
- [ ] Cannot save if Site Name is empty
- [ ] Cannot save if Site Address is empty
- [ ] Cannot save if Inspector is empty
- [ ] Inline error messages shown on empty required fields
- [ ] Toast: "Please fill all required fields" if attempting to save with missing fields

## 4.3 Save / Create `[MVP]`
- [ ] "Save Changes" button (edit mode) / "Create Audit" button (create mode)
- [ ] Loading spinner while saving to SQLite
- [ ] Button disabled while saving
- [ ] Toast: "Audit saved" (edit) / "Audit created" (create)
- [ ] Navigates back to Dashboard after create, stays on page after edit

## 4.4 Status Display & Badge `[MVP]`
- [ ] Status badge shown: "Draft" (amber) or "Completed" (green)
- [ ] Status visible at top of screen

## 4.5 Mark as Completed `[MVP]`
- [ ] "Complete" button visible when status = "Draft"
- [ ] Confirmation or direct action on tap
- [ ] Updates status to "Completed" in SQLite
- [ ] Toast: "Audit marked as completed"
- [ ] Status badge updates to "Completed"

## 4.6 Delete Audit `[MVP]`
- [ ] Delete button visible on audit screen
- [ ] Confirmation dialog: "Delete Audit?" + site name
- [ ] Warning text about permanent deletion
- [ ] "Cancel" and "Delete" buttons
- [ ] Cascade deletes: audit → zones → all equipment → all photos (file system)
- [ ] Navigates to Dashboard after deletion
- [ ] Toast: "Audit deleted"

## 4.7 Zones Section `[MVP]`
- [ ] List of zones shown below site details
- [ ] "Add Zone" button
- [ ] Tap zone card navigates to Zone Workspace
- [ ] Empty zone state: "No zones added yet" with "Add First Zone" CTA

## 4.8 Add Zone Dialog `[MVP]`
- [ ] Modal/bottom sheet dialog
- [ ] **Zone Name** — text input, required, placeholder: "e.g. Warehouse, Office, Rooftop"
- [ ] **Description** — textarea, optional, placeholder: "Optional description"
- [ ] "Cancel" button dismisses dialog
- [ ] "Add Zone" button (primary)
- [ ] Validates zone name is not empty
- [ ] Adds zone to SQLite and list immediately
- [ ] Toast: "Zone added"

## 4.9 Zone Card `[MVP]`
- [ ] Zone name shown (truncated)
- [ ] Zone description shown if exists (truncated)
- [ ] MapPin icon in accent colour circle
- [ ] Right chevron icon
- [ ] Tap navigates to Zone Workspace
- [ ] Remove/delete button visible
- [ ] Delete removes zone + all equipment in zone from SQLite
- [ ] Toast: "Zone removed"

---

---

# SECTION 5 — ZONE WORKSPACE

## 5.1 Zone Header `[MVP]`
- [ ] Zone name shown prominently
- [ ] Back to Audit button

## 5.2 Zone Photos `[MVP]`
- [ ] "Zone Photos" section header
- [ ] Multi-photo upload component (camera + gallery)
- [ ] Existing photos displayed as thumbnail grid
- [ ] Photos saved to device filesystem under audit/zone folder
- [ ] Thumbnail grid updates immediately on capture
- [ ] Individual photo delete (X button on thumbnail)
- [ ] "Saving..." indicator while persisting

## 5.3 Equipment Grid (Add Equipment) `[MVP]`
All 9 equipment type buttons must be present:
- [ ] **Main Switchboard** — Zap icon, amber colour
- [ ] **Additional Switchboard** — CircuitBoard icon, orange colour
- [ ] **HVAC Unit** — Wind icon, sky/blue colour
- [ ] **Lighting System** — Lightbulb icon, yellow colour
- [ ] **Solar PV** — Sun icon, green colour
- [ ] **Forklift Charger** — BatteryCharging icon, purple colour
- [ ] **Hot Water System** — Flame icon, red colour
- [ ] **General Water** — Droplets icon, blue colour
- [ ] **General Electricity** — PlugZap icon, indigo colour
- [ ] Each button labelled "+ {equipment type name}"
- [ ] Tapping opens the equipment form dialog for that type

## 5.4 Equipment List (Equipment in Zone) `[MVP]`
- [ ] Section header: "Equipment in Zone ({count})"
- [ ] Grouped by equipment type with type icon and count
- [ ] Per item: name/label, sub-label, Edit button, Delete button
- [ ] Edit button opens pre-filled equipment form dialog
- [ ] Delete button removes from SQLite immediately
- [ ] Toast: "Equipment removed"

## 5.5 Equipment Labels (used in list display) `[MVP]`
- [ ] Main Switchboard → `name`
- [ ] Additional Switchboard → `name`
- [ ] HVAC Unit → `unit_name`
- [ ] Lighting System → `light_type`
- [ ] Solar PV → "Solar PV {system_size_kw}kW" or "Solar PV"
- [ ] Forklift Charger → `charger_type`
- [ ] Hot Water System → `dhw_details_type`
- [ ] General Water → `question` (truncated)
- [ ] General Electricity → `question` (truncated)

## 5.6 Equipment Sub-Labels (secondary line in list) `[MVP]`
- [ ] Main Switchboard → `location`
- [ ] Additional Switchboard → `location`
- [ ] HVAC → `make — model` or `location`
- [ ] Lighting → `area_location × quantity`
- [ ] Solar → `inverter_brand_model`
- [ ] Forklift → `brand_model`
- [ ] Hot Water → `fuel_type — size_liters L`
- [ ] General Water → `answer` (truncated)
- [ ] General Electricity → `answer` (truncated)

---

---

# SECTION 6 — EQUIPMENT FORMS

> Every form opens as a modal dialog (bottom sheet or full screen).
> All fields shown in this exact order. Labels must match exactly.

---

## 6.1 Main Switchboard Form `[MVP]`

### Required Fields
- [ ] **Name** * — text input

### Optional Fields
- [ ] **Location** — text input
- [ ] **Map Locator (GPS)** — text input
- [ ] **Site NMI** — text input
- [ ] **Photo** — single photo upload (camera + gallery)
- [ ] **Sub-Circuits Description** — textarea (3 rows)
- [ ] **Comments** — textarea (3 rows)

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

### Actions
- [ ] "Save" button — creates or updates record in SQLite
- [ ] "Cancel" button — dismisses without saving
- [ ] Validation: Name must not be empty
- [ ] Toast: "Equipment added" / "Equipment updated"

---

## 6.2 Additional Switchboard Form `[MVP]`

### Required Fields
- [ ] **Name** * — text input

### Optional Fields
- [ ] **Location** — text input
- [ ] **Map Locator** — text input
- [ ] **Type** — dropdown: `MSSB`, `PVDB`, `DSB-W`, `DSB-S`
- [ ] **Photo** — single photo upload
- [ ] **Sub-Circuits Description** — textarea (3 rows)
- [ ] **Comments** — textarea (3 rows)

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

### Actions
- [ ] Save / Cancel buttons
- [ ] Validation: Name must not be empty

---

## 6.3 HVAC Unit Form `[MVP]`

### Required Fields
- [ ] **Unit Name** * — text input

### Optional Fields (in order)
- [ ] **Make** — text input
- [ ] **Photo** — single photo upload
- [ ] **Location** — text input
- [ ] **Type** — dropdown: `Packaged`, `Split`
- [ ] **Model - Outdoor Unit** — text input
- [ ] **Serial Number - Outdoor Unit** — text input
- [ ] **Heating Capacity (kW)** — number input (decimal)
- [ ] **Cooling Capacity (kW)** — number input (decimal)
- [ ] **Power Supply Phase** — dropdown: `Single Phase`, `Three Phase`
- [ ] **Outdoor Unit Nameplate Photo** — single photo upload
- [ ] **HVAC Indoor Unit Model Number** — text input
- [ ] **HVAC Indoor Unit Serial Number** — text input
- [ ] **Indoor Unit Nameplate Photo** — single photo upload
- [ ] **HVAC Controller Type** — text input
- [ ] **HVAC Controller Model Number** — text input
- [ ] **Photo of HVAC Controller** — single photo upload
- [ ] **HVAC Temperature Sensor / Thermostat Type** — text input
- [ ] **HVAC System Coverage** — text input

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

### Actions
- [ ] Save / Cancel
- [ ] Validation: Unit Name required

---

## 6.4 Lighting System Form `[MVP]`

### Required Fields
- [ ] **Light Type** * — text input

### Optional Fields (in order)
- [ ] **Brand / Model** — text input
- [ ] **Photo** — single photo upload
- [ ] **Rated Wattage** — number input (decimal)
- [ ] **Quantity** — number input (integer)
- [ ] **Number of Fixtures Installed** — text input
- [ ] **Photo of Light Fixtures Installed** — single photo upload
- [ ] **Area / Location** — text input
- [ ] **Controls Type** — text input
- [ ] **Operating Hours** — text input
- [ ] **Mounting Height** — text input
- [ ] **Photo Showing Mounting Height / Access Constraints** — single photo upload
- [ ] **Circuit Grouping** — text input
- [ ] **Photo of Switches / Sensors / Lighting Control Devices** — single photo upload
- [ ] **Access / Installation Limitations** — text input
- [ ] **Photo of Switchboard / Lighting Switches Controlling the Circuit** — single photo upload
- [ ] **Observations for Energy Improvement** — text input

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

### Actions
- [ ] Save / Cancel
- [ ] Validation: Light Type required

---

## 6.5 Solar PV Form `[FULL]`

### No Required Fields (all optional)

### Optional Fields (in order)
- [ ] **System Size (kW)** — number input (decimal)
- [ ] **Roof Photo** — single photo upload
- [ ] **Inverter Brand / Model** — text input
- [ ] **Inverter Location** — text input
- [ ] **Photo of Inverters and Label / Model** — single photo upload
- [ ] **Power Supply to the PV System** — text input
- [ ] **Photo of Electricity Meter** — single photo upload
- [ ] **Available Roof Space** — dropdown: `Yes`, `No`

### Conditional Fields (only shown when Available Roof Space = Yes)
- [ ] **How Much Roof Space is Available?** — text input
- [ ] **Photo Showing Available Space for Additional Solar Panels** — single photo upload

### Optional Fields (continued)
- [ ] **Is There a Switchable Switchboard for Solar PV Connection?** — dropdown: `Yes`, `No`
- [ ] **Photo of the Switchboard** — single photo upload
- [ ] **Location of the Switchboard** — text input
- [ ] **Estimated Cable Distance (Solar PV Area to Switchboard)** — text input
- [ ] **Cable Route Description** — textarea (3 rows)
- [ ] **Observations for Energy Improvements** — text input

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

### Conditional Logic
- [ ] "How Much Roof Space" field appears ONLY when Available Roof Space = "Yes"
- [ ] "Available Space Photo" field appears ONLY when Available Roof Space = "Yes"
- [ ] Fields hidden correctly when dropdown switched back to "No"

---

## 6.6 Forklift Charger Form `[FULL]`

### Required Fields
- [ ] **Charger Type** * — text input

### Optional Fields (in order)
- [ ] **Photo of Forklift Charger** — single photo upload
- [ ] **Brand / Model** — text input
- [ ] **Rating (V/A)** — text input (e.g. "48V / 60A")
- [ ] **Photo of Charger Label / Model** — single photo upload
- [ ] **Power Supply** — text input
- [ ] **Photo of Electric Connection or Isolator** — single photo upload
- [ ] **Location** — text input
- [ ] **Quantity** — number input (integer)
- [ ] **Photo Showing Charger Within the Space** — single photo upload
- [ ] **How is the Charger Connected?** — text input
- [ ] **Photo of Socket / Isolator / Switchboard Connection** — single photo upload
- [ ] **Is There a Local Isolator or Switch Near the Charger?** — dropdown: `Yes`, `No`
- [ ] **Is the Circuit for the Forklift Charger Identifiable in the Switchboard?** — dropdown: `Yes`, `No`
- [ ] **Approximate Distance from Charger to Switchboard** — text input
- [ ] **Is There Sufficient Space for Additional Forklift Chargers?** — dropdown: `Yes`, `No`
- [ ] **Hardwired / Socket** — dropdown: `Hardwired`, `Socket`
- [ ] **Scheduling Opportunity** — dropdown: `Yes`, `No`
- [ ] **Observations for Energy Improvement** — textarea (3 rows)

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

### Actions
- [ ] Save / Cancel
- [ ] Validation: Charger Type required

---

## 6.7 Hot Water System Form `[FULL]`

### Required Fields
- [ ] **DHW Details / Type** * — text input

### Optional Fields (in order)
- [ ] **Photo** — single photo upload
- [ ] **Serial Number** — text input
- [ ] **Size (Liters)** — number input (decimal)
- [ ] **Fuel Type** — text input
- [ ] **Location** — text input
- [ ] **Pipe Insulation** — dropdown: `Yes`, `No`
- [ ] **Thickness of Water Pipe Insulation** — text input
- [ ] **Tempering Valve** — dropdown: `Yes`, `No`
- [ ] **Additional Photo (if required)** — single photo upload
- [ ] **Any More DHW Systems?** — dropdown: `Yes`, `No`
- [ ] **Additional Comments (condition, access issues, etc.)** — textarea (3 rows)
- [ ] **Observations for Energy Improvements** — textarea (3 rows)

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

### Actions
- [ ] Save / Cancel
- [ ] Validation: DHW Details / Type required

---

## 6.8 General Water Form `[FULL]`

### No Required Fields

### Fields
- [ ] **Question** — text input, placeholder: "Enter your question..."
- [ ] **Answer** — text input, placeholder: "Enter the answer..."
- [ ] **Photos** — multi-photo upload

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

---

## 6.9 General Electricity Form `[FULL]`

### No Required Fields

### Fields
- [ ] **Question** — text input, placeholder: "Enter your question..."
- [ ] **Answer** — text input, placeholder: "Enter the answer..."
- [ ] **Photos** — multi-photo upload

### Additional Section
- [ ] **Additional Notes** — textarea (3 rows)
- [ ] **Additional Photos** — multi-photo upload

---

---

# SECTION 7 — CAMERA & PHOTO HANDLING

## 7.1 Camera Permission `[MVP]`
- [ ] Camera permission requested on first use
- [ ] Permission prompt uses correct rationale text
- [ ] If denied: falls back to gallery picker
- [ ] If permanently denied: shows settings deep-link prompt

## 7.2 Gallery Permission `[MVP]`
- [ ] Photo library permission requested on first use
- [ ] If denied: shows permission explanation

## 7.3 Camera Interface (Single Photo) `[MVP]`
- [ ] Opens full-screen camera viewfinder
- [ ] Uses **rear camera** by default (facingMode: environment)
- [ ] Large capture button (white circle with camera icon)
- [ ] "Cancel" button (top-left or bottom-left)
- [ ] Captured photo shown as preview
- [ ] "Use Photo" and "Retake" options after capture
- [ ] On confirm: photo saved to device filesystem and linked to field

## 7.4 Camera Interface (Multi Photo) `[MVP]`
- [ ] Same camera interface as single photo
- [ ] After capture, returns to form with photo added to array
- [ ] Can open camera again to add more photos
- [ ] Each thumbnail has individual X delete button
- [ ] No upper limit on photo count (practical limit: storage)

## 7.5 Gallery Picker `[MVP]`
- [ ] Opens device photo gallery
- [ ] Single selection for single photo fields
- [ ] Multiple selection for multi-photo fields
- [ ] Selected photos imported and saved to app filesystem

## 7.6 Photo Storage on Device `[MVP]`
- [ ] Photos saved at **full original resolution** — no compression, no quality loss
- [ ] Folder tree structure (human-readable, browsable via USB):
  ```
  EcoAudit/
    {site_name} — {audit_date}/
      {zone_name}/
        zone_photos/
          zone_photo_001.jpg
        {equipment_type} — {item_name}/
          main.jpg
          nameplate.jpg
          extra_001.jpg
          extra_002.jpg
  ```
- [ ] Folder names sanitised (special characters replaced with underscores)
- [ ] Filename format: `{field_label}_{sequence}.jpg` (e.g. `nameplate_001.jpg`, `extra_002.jpg`)
- [ ] SQLite `photos` table records: local_path, field_name, entity_type, entity_id, audit_id
- [ ] Photos survive app update (stored in documentDirectory, not cacheDirectory)
- [ ] Photos accessible via Android file manager and USB connection to PC/Mac

## 7.7 Photo Preview `[MVP]`
- [ ] Thumbnail shown in form after capture (3×3 or 4×4 size)
- [ ] Tap thumbnail → full-screen viewer
- [ ] Swipe between photos in full-screen viewer
- [ ] Close/dismiss full-screen viewer

## 7.8 Photo Deletion `[MVP]`
- [ ] X button on each thumbnail
- [ ] Confirmation on delete (or immediate with undo toast)
- [ ] Deletes file from device filesystem
- [ ] Removes reference from SQLite
- [ ] Thumbnail grid updates immediately

## 7.9 Orphaned Photo Cleanup `[PROD]`
- [ ] When equipment item is deleted, its folder deleted from filesystem
- [ ] When zone is deleted, entire zone folder (and all sub-folders) deleted
- [ ] When audit is deleted, entire audit folder deleted
- [ ] Background cleanup job for any folders/files with no matching SQLite record

---

---

# SECTION 8 — LOCAL DATABASE (SQLite)

## 8.1 Tables `[MVP]`
- [ ] `users` — id, username, full_name, password_hash, role, is_active, created_at
- [ ] `admin_config` — admin_pin_hash, setup_complete, sync_flag_enabled
- [ ] `audits` — all fields from web app + sync metadata columns
- [ ] `zones` — all fields + sync metadata
- [ ] `main_switchboards` — all fields + sync metadata
- [ ] `additional_switchboards` — all fields + sync metadata
- [ ] `hvac_units` — all fields + sync metadata
- [ ] `lighting_systems` — all fields + sync metadata
- [ ] `solar_pv` — all fields + sync metadata
- [ ] `forklift_chargers` — all fields + sync metadata
- [ ] `hot_water_systems` — all fields + sync metadata
- [ ] `general_water` — all fields + sync metadata
- [ ] `general_electricity` — all fields + sync metadata
- [ ] `photos` — id, entity_type, entity_id, field_name, local_path, audit_id, created_at

## 8.2 Sync Metadata Columns (on every entity table) `[MVP]`
- [ ] `_local_id` TEXT UNIQUE — device UUID generated at creation
- [ ] `_server_id` TEXT — null until synced (future)
- [ ] `_sync_status` TEXT — 'local' | 'pending' | 'synced'
- [ ] `_updated_at` TEXT — ISO timestamp

## 8.3 Migrations `[MVP]`
- [ ] Drizzle migration system set up
- [ ] Migration 001: initial schema (all tables)
- [ ] Migrations run automatically on app launch
- [ ] Failed migration does NOT crash app — logs error and alerts user
- [ ] App version tracked in `admin_config` to trigger migrations on update

## 8.4 Data Integrity `[MVP]`
- [ ] Foreign key constraints enabled on SQLite (`PRAGMA foreign_keys = ON`)
- [ ] Cascade deletes: audit delete → zones → equipment → photos (all tables)
- [ ] Zone delete → equipment in zone → photos for that equipment
- [ ] Unique constraint on `_local_id` for all tables

---

---

# SECTION 9 — AUDIT REPORT SCREEN (Internal Review)

## 9.1 Header `[FULL]`
- [ ] Back to Audit button
- [ ] Site name displayed
- [ ] Site address displayed
- [ ] Inspector name displayed
- [ ] Audit date displayed (formatted)
- [ ] Number of zones shown
- [ ] Total equipment count shown
- [ ] "Generate Report" / "Client Report" button (navigates to Report screen)

## 9.2 By Zone Tab `[FULL]`
- [ ] Tab: "By Zone" with Layers icon
- [ ] Accordion list — one entry per zone
- [ ] Zone name + total item count in header
- [ ] Expand to show equipment by type in that zone
- [ ] Equipment data shown in table format (all fields)
- [ ] URL-type values shown as tappable links

## 9.3 By Equipment Tab `[FULL]`
- [ ] Tab: "By Equipment" with LayoutGrid icon
- [ ] Groups all items across zones by equipment type
- [ ] Only shows equipment types that have at least one item
- [ ] Shows equipment type icon + label + count
- [ ] Equipment data shown in table with Zone column prepended
- [ ] URL-type values shown as tappable links

---

---

# SECTION 10 — PHOTO PREVIEW & MANAGEMENT

## 10.1 Photo Selection Tab `[FULL]`
- [ ] Tab label: "Select Photos ({selectedCount}/{totalPhotos})"
- [ ] Info box: "Tap a photo to exclude it from the report. Switch to 'Report Preview' to see the live result."
- [ ] Photos grouped by equipment type and item name
- [ ] Group header shows equipment label and item name
- [ ] "Include all" / "Exclude all" toggle per group
- [ ] Photo grid: 2–3 columns

## 10.2 Photo Interaction `[FULL]`
- [ ] Tap photo to toggle include/exclude
- [ ] **Excluded photo**: 40% opacity + red border + "Excluded" label overlay
- [ ] **Included photo**: full opacity + green checkmark overlay
- [ ] Counter updates in real time

## 10.3 Download All Photos as ZIP `[FULL]`
- [ ] "Download Images" button with FolderDown icon
- [ ] Button disabled when no photos are selected
- [ ] ZIP organised by zone (folder per zone)
- [ ] Photos converted from local path to output files
- [ ] ZIP file saved to device Downloads folder
- [ ] Share sheet offered after creation
- [ ] Toast: "Photos downloaded"

## 10.4 Report Preview Tab `[FULL]`
- [ ] Tab label: "Report Preview" with Eye icon
- [ ] Shows live preview of report with excluded photos hidden
- [ ] Report content editor (collapsible) at top
- [ ] Preview reflects all edits in real time

---

---

# SECTION 11 — REPORT CONTENT EDITOR

## 11.1 Collapsible Container `[FULL]`
- [ ] "Edit Report Content" button with chevron icon
- [ ] Expands/collapses content editor
- [ ] State remembered across tab switches

## 11.2 Editable Fields (all 10 must be present) `[FULL]`
- [ ] **Executive Summary** — textarea (3 rows), placeholder: "Enter a custom executive summary paragraph..."
- [ ] **Obs: Main Switchboard** — textarea (3 rows), placeholder: "Enter observations for main switchboard (optional — only appears if content is added)"
- [ ] **Obs: Additional Switchboards** — textarea (3 rows), placeholder as above
- [ ] **Obs: HVAC Units** — textarea (3 rows)
- [ ] **Obs: Lighting Upgrades** — textarea (3 rows)
- [ ] **Obs: Solar PV** — textarea (3 rows)
- [ ] **Obs: Forklift Charging** — textarea (3 rows)
- [ ] **Obs: Hot Water Systems** — textarea (3 rows)
- [ ] **Obs: General Water** — textarea (3 rows)
- [ ] **Obs: General Electricity** — textarea (3 rows)
- [ ] Edited content persists while screen is open
- [ ] Edited content is passed into PDF generation

---

---

# SECTION 12 — PDF REPORT GENERATION

## 12.1 PDF Generation Engine `[MVP]`
- [ ] Uses `expo-print.printToFileAsync({ html })` — no internet required
- [ ] HTML template is self-contained (no external URLs)
- [ ] Montserrat font embedded as base64 data URI in template
- [ ] Photos read from device filesystem at **original resolution** and embedded as base64
- [ ] PDF saved to `documentDirectory/pdfs/{audit_local_id}_report.pdf`
- [ ] Previous PDF overwritten when report is regenerated
- [ ] Share sheet opens automatically after generation
- [ ] Loading indicator while generating: "Generating PDF..."
- [ ] Button disabled during generation
- [ ] Note: large audits with many full-res photos will produce larger PDFs and longer generation times — this is expected and acceptable

## 12.2 PDF Report Header `[MVP]`
- [ ] Sustainability Wise logo (bundled in app assets — no external URL)
- [ ] Title: "COMPREHENSIVE SITE ENERGY AUDIT REPORT"
- [ ] Metadata grid:
  - [ ] "Prepared For:" — audit.site_name
  - [ ] "Site Address:" — audit.site_address
  - [ ] "Date of Audit:" — formatted as "DD MMMM YYYY"
  - [ ] "Prepared By:" — "Sustainability Wise"
- [ ] Dark blue header background (#162A4E)
- [ ] Green accent colour (#79B44A)
- [ ] Decorative SVG circles (top-right and bottom-left)

## 12.3 PDF Page Layout `[MVP]`
- [ ] A4 portrait format
- [ ] 1.8cm margins
- [ ] Custom header on each page (dark blue, logo, title)
- [ ] Custom footer on each page: "Prepared by Sustainability Wise | Confidential | {month} {year} | {site_name}"
- [ ] Page numbers in footer
- [ ] 2px solid dark blue border (#2C3E50) around each page
- [ ] Automatic page breaks
- [ ] Content blocks (cards, tables, rows) do not split across pages where possible

## 12.4 Executive Summary Section `[MVP]`
- [ ] Section heading: "Executive Summary"
- [ ] Default template text (same as web app)
- [ ] If edited via Report Content Editor, shows edited text instead
- [ ] Info boxes: Audit Date, Inspector, Status

## 12.5 Electrical Infrastructure Section `[MVP]`
**1.1 Main Switchboard (MSB)**
- [ ] Section heading: "1. Electrical Infrastructure"
- [ ] Sub-heading: "1.1 Main Switchboard (MSB)"
- [ ] Fields displayed in order:
  - [ ] Switchboard Name
  - [ ] Location
  - [ ] GPS Locator
  - [ ] Site NMI
  - [ ] Sub-Circuits & Ratings
  - [ ] Zone
  - [ ] Auditor Comments
- [ ] Additional Notes callout box (green background) — shown only if extra_notes has content
- [ ] Photographic Evidence block — shown only if any photos exist
- [ ] Section only rendered if at least one Main Switchboard exists

**1.2 Additional Switchboards**
- [ ] Sub-heading: "1.2 Additional Switchboards"
- [ ] Table with columns: Board Name, Location / GPS, Type, Sub-Circuit Details, Zone
- [ ] Each row is one Additional Switchboard item
- [ ] Alternating row colours (#ffffff / #f9f9f9)
- [ ] Colgroup widths set
- [ ] Photographic Evidence blocks per board (conditional)
- [ ] Section only rendered if at least one Additional Switchboard exists

## 12.6 HVAC Systems Section `[MVP]`
- [ ] Section heading: "2. HVAC Systems"
- [ ] Per unit: "Unit {i+1}: {unit_name}"
- [ ] **Unit Profile** sub-table: Unit Name, Make & Type, Location, Zone / Coverage Area, Power Supply Phase
- [ ] **Technical Specifications** sub-table: Model, Serial Number, Heating Capacity, Cooling Capacity, Controller Type
- [ ] Values formatted: "X kW" for capacities
- [ ] Additional Notes callout (conditional)
- [ ] Observations for Energy Improvement callout (amber background, conditional)
- [ ] Photographic Evidence (conditional):
  - [ ] HVAC Unit (main photo)
  - [ ] Nameplate (nameplate_photos)
  - [ ] Controller (controller_photo)
  - [ ] Indoor Unit Nameplate (indoor_unit_nameplate_photo)
  - [ ] Extra Photos (extra_photos array)
- [ ] Section only rendered if at least one HVAC unit exists

## 12.7 Lighting Systems Section `[FULL]`
- [ ] Section heading: "3. Lighting Systems"
- [ ] Per fixture: "Fixture {i+1}: {light_type}"
- [ ] **Fixture & Installation Details**: Area / Location, Zone, Fixture Type / Brand / Model, Quantity Installed, Rated Wattage (X W per fixture), Total Load (calculated: quantity × wattage / 1000 kW), Mounting Height
- [ ] **Controls & Operation**: Control Method, Circuit Grouping, Typical Operating Hours
- [ ] Additional Notes callout (conditional)
- [ ] Observations callout (conditional)
- [ ] Photographic Evidence (conditional): Fixture, Fixtures Installed, Mounting / Access, Switches / Sensors, Switchboard, Extra Photos
- [ ] Section only rendered if at least one Lighting System exists

## 12.8 Solar PV Infrastructure Section `[FULL]`
- [ ] Section heading: "4. Solar PV Infrastructure"
- [ ] Per system: "4.{i+1} Existing System" sub-heading
- [ ] **Existing System**: System Status, System Size, Inverter Brand / Model, Inverter Location, Zone
- [ ] **Expansion Potential**: Available Roof Space, Suitable Switchboard, Cable Routing Notes
- [ ] Additional Notes callout (conditional)
- [ ] Observations callout (conditional)
- [ ] Photographic Evidence (conditional): Roof / Panels, Inverter Label, Electricity Meter, Available Roof Space, Switchboard, Extra Photos
- [ ] Section only rendered if at least one Solar PV record exists

## 12.9 Forklift Charging Infrastructure Section `[FULL]`
- [ ] Section heading: "5. Forklift Charging Infrastructure"
- [ ] Per charger: "Charger {i+1}: {charger_type}"
- [ ] **Charger Profile**: Charger Type, Brand / Model, Rating (V/A), Power Supply, Location, Zone, Quantity
- [ ] **Connection & Installation**: Hardwired / Socket, Connection Description, Local Isolator, Circuit Identifiable, Distance to Switchboard, Space for Additional Chargers, Scheduling Opportunity
- [ ] Additional Notes callout (conditional)
- [ ] Observations callout (conditional)
- [ ] Photographic Evidence (conditional): Forklift Charger, Charger Label, Electric Connection, Charger Space, Socket / Isolator, Extra Photos
- [ ] Section only rendered if at least one Forklift Charger exists

## 12.10 Domestic Hot Water Systems Section `[FULL]`
- [ ] Section heading: "6. Domestic Hot Water (DHW) Systems"
- [ ] Per system: "6.{i+1} Unit Profile"
- [ ] **Unit Profile**: DHW Details / Type, Fuel Type, Size / Capacity, Serial Number, Location, Zone
- [ ] **Thermal Management & Safety**: Pipe Insulation, Tempering Valve Installed
- [ ] Additional Comments callout (conditional)
- [ ] Observations callout (conditional)
- [ ] Photographic Evidence (conditional): DHW System, Additional Photo, Extra Photos
- [ ] Section only rendered if at least one Hot Water System exists

## 12.11 General Water Section `[FULL]`
- [ ] Section heading: "Section 7: General Water"
- [ ] Per item: "Water Item {i+1}{: question if exists}"
- [ ] Zone displayed
- [ ] Question displayed
- [ ] Answer displayed
- [ ] Additional Notes callout (conditional)
- [ ] Photographic Evidence (conditional): Photos array, Extra Photos array
- [ ] Section only rendered if at least one General Water item exists

## 12.12 General Electricity Section `[FULL]`
- [ ] Section heading: "Section 8: General Electricity"
- [ ] Per item: "Electricity Item {i+1}{: question if exists}"
- [ ] Zone displayed
- [ ] Question displayed
- [ ] Answer displayed
- [ ] Additional Notes callout (conditional)
- [ ] Photographic Evidence (conditional): Photos array, Extra Photos array
- [ ] Section only rendered if at least one General Electricity item exists

## 12.13 Consolidated Observations Section `[FULL]`
- [ ] Section heading: "9. Observations for Energy Improvements"
- [ ] Only renders subsections where observations content exists:
  - [ ] 9.1 Main Switchboard
  - [ ] 9.2 Additional Switchboards
  - [ ] 9.3 HVAC Units
  - [ ] 9.4 Lighting Upgrades
  - [ ] 9.5 Solar PV Optimization
  - [ ] 9.6 Forklift Charging
  - [ ] 9.7 Hot Water Systems
  - [ ] 9.8 General Water
  - [ ] 9.9 General Electricity
- [ ] Each subsection only shown if that equipment type's observation field has content
- [ ] "End of Report" footer with confidentiality statement

## 12.14 PDF Styling `[MVP]`
- [ ] Font: Montserrat (embedded, not loaded from Google Fonts)
- [ ] Body background: #f7f8f8
- [ ] Headers: #162A4E (dark navy)
- [ ] Accent: #79B44A (green)
- [ ] Additional Notes callout: green background
- [ ] Observations callout: amber/yellow background
- [ ] Photo borders: 1px solid, 6px border-radius
- [ ] Tables: bordered cells, alternating row colours (#ffffff / #f9f9f9)
- [ ] No dark-mode bleed (light mode forced)
- [ ] Page-break-inside: avoid on card-block, obs-block, photo-evidence, table rows

## 12.15 Download Options Dialog `[FULL]`
- [ ] "Select All" and "Clear All" buttons
- [ ] Status counter: "{x} of {y} sections"
- [ ] Close (X) button
- [ ] Checkbox for each section:
  - [ ] Electrical Infrastructure
  - [ ] HVAC Systems (expandable with per-unit checkboxes)
  - [ ] Lighting Systems (expandable with per-fixture checkboxes)
  - [ ] Solar PV Infrastructure (expandable with per-system checkboxes)
  - [ ] Forklift Charging Operations (expandable with per-charger checkboxes)
  - [ ] Hot Water Systems (expandable with per-system checkboxes)
  - [ ] Consolidated Observations
- [ ] Item labels within expandable sections:
  - [ ] HVAC: `unit_name` or "HVAC Unit {i+1}"
  - [ ] Lighting: `{light_type} — {area_location}` or "Fixture {i+1}"
  - [ ] Solar: "Solar PV {i+1} ({system_size_kw}kW)" or "Solar PV {i+1}"
  - [ ] Forklift: `{charger_type} — {brand_model}` or "Charger {i+1}"
  - [ ] Hot Water: `dhw_details_type` or "DHW System {i+1}"
- [ ] Export PDF button: disabled when no sections selected
- [ ] Export PDF button triggers PDF generation with filtered content
- [ ] Cancel button dismisses dialog

## 12.16 PDF Filename `[MVP]`
- [ ] Filename format: `{site_name}-Energy-Audit-Report.pdf`
- [ ] Site name sanitised (special characters replaced)

## 12.17 Share PDF `[MVP]`
- [ ] After generation: Android share sheet opens automatically
- [ ] User can share via Email, WhatsApp, Drive, Teams, etc.
- [ ] "Share Again" option to reshare without regenerating

---

---

# SECTION 13 — SETTINGS

## 13.1 Account Section `[MVP]`
- [ ] User avatar (circle with User icon or initials)
- [ ] Full name displayed
- [ ] Username displayed

## 13.2 Appearance `[MVP]`
- [ ] Theme label: "Appearance"
- [ ] Three options: System, Light, Dark
- [ ] Radio-button style selector (not a dropdown)
- [ ] Icons: Monitor (System), Sun (Light), Moon (Dark)
- [ ] Theme applies immediately on selection
- [ ] Theme persists across app restarts

## 13.3 Sync Flag Setting `[MVP]`
- [ ] Toggle: "Enable Sync" (on/off switch)
- [ ] When OFF: Sync button is hidden throughout the app
- [ ] When ON: Sync button appears on Dashboard/Audit screens (greyed out until API connected)
- [ ] Default: OFF
- [ ] Requires admin PIN to change (or inspector can change — decide before Phase 1)
- [ ] Setting persisted in `admin_config` SQLite table

## 13.4 Biometric Setting `[MVP]`
- [ ] Toggle: "Enable Biometric Unlock"
- [ ] When enabled: Face ID / fingerprint prompt on app open
- [ ] When disabled: Password always required
- [ ] Persisted in SQLite user preferences

## 13.5 Admin Access `[MVP]`
- [ ] "Admin" button or section in Settings
- [ ] Requires admin PIN entry
- [ ] Navigates to Admin Panel on correct PIN
- [ ] Wrong PIN shows error

## 13.6 Log Out `[MVP]`
- [ ] "Log Out" button with LogOut icon
- [ ] Confirmation prompt: "Are you sure you want to log out?"
- [ ] "Cancel" and "Log Out" buttons
- [ ] Clears session token from secure storage
- [ ] Navigates to Login screen
- [ ] Local audit data preserved

## 13.7 Storage Info `[PROD]`
- [ ] Shows total storage used by app (SQLite + photos + PDFs)
- [ ] Breakdown: Database / Photos / PDFs
- [ ] "Clear PDF Cache" option (deletes generated PDFs but not source data)

## 13.8 App Info `[PROD]`
- [ ] App version number displayed
- [ ] Build number displayed

---

---

# SECTION 14 — UI / UX BEHAVIOURS

## 14.1 Toast Notifications `[MVP]`
All toasts from the web app must be present:
- [ ] "Equipment added"
- [ ] "Equipment updated"
- [ ] "Equipment removed"
- [ ] "Zone added"
- [ ] "Zone removed"
- [ ] "Audit saved"
- [ ] "Audit created"
- [ ] "Audit marked as completed"
- [ ] "Audit deleted"
- [ ] "Please fill all required fields"
- [ ] "Failed to load audit data"
- [ ] Error toast on any SQLite failure (generic message + log to console)

## 14.2 Loading States `[MVP]`
- [ ] Dashboard: spinner while loading audit list
- [ ] Audit screen: spinner while saving
- [ ] Equipment form: spinner while saving
- [ ] PDF screen: "Generating PDF..." with spinner, button disabled
- [ ] Photo upload: spinner in photo slot while processing

## 14.3 Empty States `[MVP]`
- [ ] Dashboard: no audits → icon + "No audits yet" + CTA
- [ ] Audit: no zones → icon + "No zones added yet" + "Add First Zone" CTA
- [ ] Zone: no equipment → icon + "No equipment in this zone"
- [ ] Photo Preview: no photos → "No photos found"
- [ ] Search results: no match → "No audits match your search"

## 14.4 Confirmation Dialogs `[MVP]`
- [ ] Delete audit: "Delete Audit?" + site name + Cancel + Delete (red)
- [ ] Delete zone: confirmation before removing
- [ ] Delete account / log out: confirmation prompt
- [ ] All dialogs have Cancel and Confirm buttons
- [ ] Destructive actions use red confirm button

## 14.5 Optimistic Updates `[MVP]`
- [ ] Adding equipment: shown in list immediately, saved to SQLite in background
- [ ] Editing equipment: updated in list immediately
- [ ] Deleting equipment: removed from list immediately, then deleted from SQLite
- [ ] Adding zone: shown immediately, saved in background
- [ ] Deleting zone: removed immediately, deleted in background

## 14.6 Keyboard Behaviour `[MVP]`
- [ ] Tapping outside a text field dismisses keyboard
- [ ] Scrollable forms scroll to keep focused field visible above keyboard
- [ ] Return/Next key moves to next field in form
- [ ] Done key on last field dismisses keyboard

## 14.7 Offline Indicator `[MVP]`
- [ ] Visual indicator if device has no internet (banner or icon)
- [ ] Note: app is fully functional offline — indicator is informational only
- [ ] Indicator disappears when connectivity restored

## 14.8 Android Back Button `[MVP]`
- [ ] Back button on equipment form dialog: dismiss dialog (not navigate back)
- [ ] Back button on Zone Workspace: navigate to Site Audit
- [ ] Back button on Site Audit: navigate to Dashboard
- [ ] Back button on Settings: navigate to Dashboard
- [ ] Back button on Report: navigate to previous screen
- [ ] Back button on Login: exits app (with confirmation)

---

---

# SECTION 15 — DATA FIELD COMPLETENESS VERIFICATION

> Tick each field to confirm it exists in the SQLite schema, the form, AND the PDF report.

## 15.1 Audit Entity Fields
- [ ] site_name
- [ ] site_address
- [ ] inspector_name
- [ ] audit_date
- [ ] status
- [ ] created_at
- [ ] updated_at
- [ ] _local_id
- [ ] _sync_status

## 15.2 Zone Entity Fields
- [ ] audit_id
- [ ] zone_name
- [ ] zone_description
- [ ] photos (array)
- [ ] _local_id, _sync_status, _updated_at

## 15.3 Main Switchboard Fields
- [ ] audit_id, zone_id
- [ ] name
- [ ] location
- [ ] map_locator
- [ ] site_nmi
- [ ] photo
- [ ] sub_circuits_description
- [ ] comments
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.4 Additional Switchboard Fields
- [ ] audit_id, zone_id
- [ ] name
- [ ] location
- [ ] map_locator
- [ ] type (MSSB / PVDB / DSB-W / DSB-S)
- [ ] photo
- [ ] sub_circuits_description
- [ ] comments
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.5 HVAC Unit Fields
- [ ] audit_id, zone_id
- [ ] unit_name
- [ ] make
- [ ] photo
- [ ] location
- [ ] type (Packaged / Split)
- [ ] model
- [ ] serial_number
- [ ] heating_capacity_kw
- [ ] cooling_capacity_kw
- [ ] power_supply_phase (Single Phase / Three Phase)
- [ ] nameplate_photos
- [ ] indoor_unit_model
- [ ] indoor_unit_serial
- [ ] indoor_unit_nameplate_photo
- [ ] controller_type
- [ ] controller_model
- [ ] controller_photo
- [ ] temperature_sensor_type
- [ ] system_coverage
- [ ] energy_improvement_observations
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.6 Lighting System Fields
- [ ] audit_id, zone_id
- [ ] light_type
- [ ] brand_model
- [ ] photo
- [ ] rated_wattage
- [ ] quantity
- [ ] fixtures_installed
- [ ] fixtures_photo
- [ ] area_location
- [ ] controls_type
- [ ] operating_hours
- [ ] mounting_height
- [ ] mounting_constraints_photo
- [ ] circuit_grouping
- [ ] sensors_photo
- [ ] access_limitations
- [ ] switchboard_photo_notes
- [ ] energy_improvement_observations
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.7 Solar PV Fields
- [ ] audit_id, zone_id
- [ ] system_size_kw
- [ ] roof_photo
- [ ] inverter_brand_model
- [ ] inverter_location
- [ ] inverter_label_photo
- [ ] power_supply_to_pv
- [ ] electricity_meter_photo
- [ ] available_roof_space (Yes / No)
- [ ] roof_space_amount ← conditional on available_roof_space = Yes
- [ ] additional_solar_space_photo ← conditional on available_roof_space = Yes
- [ ] suitable_switchboard (Yes / No)
- [ ] switchboard_photo
- [ ] switchboard_location
- [ ] cable_distance
- [ ] cable_route_description
- [ ] energy_improvement_observations
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.8 Forklift Charger Fields
- [ ] audit_id, zone_id
- [ ] charger_type
- [ ] charger_photo
- [ ] brand_model
- [ ] rating
- [ ] charger_label_photo
- [ ] power_supply
- [ ] electric_connection_photo
- [ ] location
- [ ] quantity
- [ ] charger_space_photo
- [ ] connection_description
- [ ] socket_connection_photo
- [ ] local_isolator (Yes / No)
- [ ] circuit_identifiable (Yes / No)
- [ ] distance_to_switchboard
- [ ] space_for_additional (Yes / No)
- [ ] hardwired_socket (Hardwired / Socket)
- [ ] scheduling_opportunity (Yes / No)
- [ ] energy_improvement_observations
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.9 Hot Water System Fields
- [ ] audit_id, zone_id
- [ ] dhw_details_type
- [ ] photo
- [ ] serial_number
- [ ] size_liters
- [ ] fuel_type
- [ ] location
- [ ] pipe_insulation (Yes / No)
- [ ] pipe_insulation_thickness
- [ ] tempering_valve (Yes / No)
- [ ] additional_photo
- [ ] more_dhw_systems (Yes / No)
- [ ] additional_comments
- [ ] energy_improvement_observations
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.10 General Water Fields
- [ ] audit_id, zone_id
- [ ] question
- [ ] answer
- [ ] photos (array)
- [ ] extra_notes
- [ ] extra_photos (array)

## 15.11 General Electricity Fields
- [ ] audit_id, zone_id
- [ ] question
- [ ] answer
- [ ] photos (array)
- [ ] extra_notes
- [ ] extra_photos (array)

---

---

# SECTION 16 — ENUM VALUES VERIFICATION

Verify each dropdown renders these exact options in this exact order:

## 16.1 Additional Switchboard — Type
- [ ] MSSB
- [ ] PVDB
- [ ] DSB-W
- [ ] DSB-S

## 16.2 HVAC — Type
- [ ] Packaged
- [ ] Split

## 16.3 HVAC — Power Supply Phase
- [ ] Single Phase
- [ ] Three Phase

## 16.4 Yes / No dropdowns (all fields below must use exactly "Yes" and "No")
- [ ] Solar PV — Available Roof Space
- [ ] Solar PV — Suitable Switchboard
- [ ] Forklift — Local Isolator
- [ ] Forklift — Circuit Identifiable
- [ ] Forklift — Space for Additional Chargers
- [ ] Forklift — Scheduling Opportunity
- [ ] Hot Water — Pipe Insulation
- [ ] Hot Water — Tempering Valve
- [ ] Hot Water — Any More DHW Systems?

## 16.5 Forklift — Hardwired / Socket
- [ ] Hardwired
- [ ] Socket

## 16.6 Theme
- [ ] System
- [ ] Light
- [ ] Dark

---

---

# SECTION 17 — PRODUCTION READINESS

## 17.1 Performance `[PROD]`
- [ ] Dashboard loads under 1 second for 100 audits
- [ ] Equipment form opens under 300ms
- [ ] PDF generates in under 30 seconds for a 50-photo audit on a 2GB RAM device
- [ ] No memory crash during PDF generation with 50+ photos
- [ ] Photos compressed correctly before PDF embedding (max 1200px, 75% JPEG)
- [ ] App size under 50MB (AAB)

## 17.2 Tested Devices `[PROD]`
- [ ] Tested on physical Android device — high-end (Samsung S series or equivalent)
- [ ] Tested on physical Android device — mid-range (3–4GB RAM)
- [ ] Tested on physical Android device — low-end (2GB RAM)
- [ ] Tested on Android emulator (API 30+)
- [ ] Screen sizes tested: small (5"), medium (6"), large (6.5"+)

## 17.3 Android Permissions `[PROD]`
- [ ] `CAMERA` permission declared in AndroidManifest.xml
- [ ] `READ_MEDIA_IMAGES` (Android 13+) or `READ_EXTERNAL_STORAGE` declared
- [ ] `WRITE_EXTERNAL_STORAGE` declared where needed
- [ ] `USE_BIOMETRIC` declared
- [ ] `USE_FINGERPRINT` declared (Android <9 compatibility)
- [ ] All permissions have rationale text shown before requesting

## 17.4 Branding & Assets `[PROD]`
- [ ] App icon: 512×512px PNG, provided and implemented
- [ ] Adaptive icon foreground layer
- [ ] Splash screen (branded, no white flash)
- [ ] App name: correct display name in launcher
- [ ] Sustainability Wise logo bundled in app assets (not fetched from URL)
- [ ] All font files bundled (Montserrat variants)

## 17.5 Google Play Store `[PROD]`
- [ ] App signed with release keystore (stored securely, not in repo)
- [ ] AAB built via `eas build --platform android --profile production`
- [ ] Play Store listing: title, short description, full description
- [ ] Screenshots: minimum 2 phone screenshots
- [ ] Privacy policy URL provided
- [ ] Content rating completed
- [ ] Internal testing track submission
- [ ] Closed testing (limited group) passed
- [ ] Production release submitted

## 17.6 Security `[PROD]`
- [ ] No credentials stored in plain text anywhere
- [ ] No hardcoded passwords, API keys, or secrets in source code
- [ ] SQLite database is in app-private storage (not accessible by other apps)
- [ ] expo-secure-store used for session tokens (hardware-backed on supported devices)
- [ ] Admin PIN uses bcrypt (not MD5/SHA1)
- [ ] Passwords use bcrypt with cost factor ≥ 10

## 17.7 Error Handling `[PROD]`
- [ ] SQLite write failures show user-friendly error (not a crash)
- [ ] Camera failures fall back to gallery with explanation
- [ ] PDF generation failures show retry option
- [ ] App does not crash on any tested flow
- [ ] All uncaught exceptions logged (consider Sentry or equivalent)

## 17.8 Handover `[PROD]`
- [ ] GitHub repository shared with client (private)
- [ ] README.md: project setup, build instructions, environment requirements
- [ ] Architecture documentation (link to docs/)
- [ ] Data model reference (all SQLite tables and fields)
- [ ] Credential management guide (how to add inspectors, reset admin PIN, QR setup)
- [ ] Build and Play Store deployment guide
- [ ] Handover call completed with client team

---

---

# SECTION 18 — SYNC (FUTURE — NOT PHASE 1–3)
> These items are architecture-ready but NOT activated until the API server is built.

- [ ] Sync flag toggle exists in Settings (UI only — toggle visible, button greyed out)
- [ ] SQLite sync metadata columns present on all tables (_local_id, _server_id, _sync_status, _updated_at)
- [ ] sync_queue table exists in SQLite schema
- [ ] photo_upload_queue table exists in SQLite schema
- [ ] Sync engine module scaffolded (push.ts, pull.ts, photos.ts) — functions exist but are no-ops until API URL is configured
- [ ] Sync mode field on Audit entity: 'auto' | 'manual' | 'offline_only'
- [ ] Sync engine checks sync_mode before adding to queue

---

---

# SECTION 19 — APP 2: SOLAR ASSESSMENT

> Separate APK. Same offline-first architecture, same login system, same photo storage structure.
> Covers the solar-specific workflow that is a subset of the Energy Audit app.

## 19.1 App Shell `[FULL]`
- [ ] Separate Expo project (separate APK, separate Play Store listing if submitted)
- [ ] Same pre-approved credential login system as Energy Audit app
- [ ] Same admin panel (add/remove inspectors, admin PIN)
- [ ] Same theme (light/dark/system)
- [ ] Same bottom navigation structure
- [ ] Branded for Solar Assessment (app icon, name, splash screen)

## 19.2 Assessment Workflow `[FULL]`
- [ ] Dashboard: list of all solar assessments, search, create new
- [ ] Create / Edit Assessment: site name, site address, assessor name, assessment date
- [ ] Status: Draft / Completed
- [ ] Delete assessment with confirmation (cascade deletes all data)
- [ ] Mark as Completed

## 19.3 Solar Assessment Form Fields `[FULL]`
All fields from the Solar PV entity in the Energy Audit app plus:
- [ ] **System Size (kW)** — number input
- [ ] **Roof Photo** — single photo
- [ ] **Inverter Brand / Model** — text
- [ ] **Inverter Location** — text
- [ ] **Photo of Inverters and Label / Model** — single photo
- [ ] **Power Supply to the PV System** — text
- [ ] **Photo of Electricity Meter** — single photo
- [ ] **Available Roof Space** — dropdown: Yes / No
- [ ] **How Much Roof Space is Available?** — text (conditional: Yes only)
- [ ] **Photo Showing Available Space** — single photo (conditional: Yes only)
- [ ] **Is There a Switchable Switchboard?** — dropdown: Yes / No
- [ ] **Photo of the Switchboard** — single photo
- [ ] **Location of the Switchboard** — text
- [ ] **Estimated Cable Distance** — text
- [ ] **Cable Route Description** — textarea
- [ ] **Observations for Energy Improvements** — text
- [ ] **Additional Notes** — textarea
- [ ] **Additional Photos** — multi-photo

## 19.4 Photo Storage `[FULL]`
- [ ] Same folder tree structure as Energy Audit app
- [ ] Root folder: `SolarAssessment/` instead of `EcoAudit/`
- [ ] Full original resolution — no compression
- [ ] Accessible via USB / file manager

## 19.5 PDF Report — Solar Assessment `[FULL]`
- [ ] Branded header: "SOLAR SITE ASSESSMENT REPORT"
- [ ] Metadata: site name, address, assessor, date
- [ ] Executive summary section (editable)
- [ ] Existing System section: system size, inverter details, power supply, meter
- [ ] Expansion Potential section: available roof space, switchboard suitability, cable routing
- [ ] Observations section (editable)
- [ ] Photographic Evidence: all captured photos at original resolution
- [ ] Footer: confidentiality notice, page numbers
- [ ] Same Montserrat font, dark blue + green palette
- [ ] PDF saved locally, shareable via Android share sheet

## 19.6 Production Readiness `[PROD]`
- [ ] App icon and splash screen for Solar Assessment branding
- [ ] Signed APK via EAS Build
- [ ] Play Store submission attempted (separate listing from Energy Audit app)
- [ ] Tested on same device matrix as Energy Audit app
- [ ] Source code in same GitHub repository (separate app directory)
- [ ] Documentation covers both apps

---

*Last updated: May 2026*
*Checklist version: 1.1*
*Covers: Base44 web app → Android mobile app parity + Solar Assessment app*
