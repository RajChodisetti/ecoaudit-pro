# Data Models — Complete Reference

All entities are stored in the Base44 cloud database. Every equipment entity carries `zone_id` and `audit_id` as foreign keys for cascade queries. Fields marked `*` are required.

---

## Audit

Top-level entity. One audit per site visit.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Auto-generated |
| `site_name` * | string | |
| `site_address` * | string | |
| `inspector_name` * | string | |
| `audit_date` | date | Defaults to today |
| `status` | string | `Draft` \| `Completed` |
| `created_date` | datetime | Auto |
| `updated_date` | datetime | Auto |
| `created_by` | string | Auto (user ID) |

---

## Zone

One audit contains one or more zones. A zone is a logical area of the site.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Auto-generated |
| `audit_id` * | string | FK → Audit |
| `zone_name` * | string | |
| `zone_description` | string | |
| `photos` | string[] | Array of image URLs |

---

## MainSwitchboard

Primary electrical distribution board.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | FK → Zone |
| `audit_id` * | string | FK → Audit |
| `name` * | string | Label/identifier |
| `location` | string | Physical location description |
| `map_locator` | string | GPS coordinates |
| `site_nmi` | string | National Metering Identifier |
| `photo` | string | Primary photo URL |
| `sub_circuits_description` | string | Description of sub-circuits |
| `comments` | string | |
| `extra_notes` | string | Additional notes |
| `extra_photos` | string[] | Additional photo URLs |

---

## AdditionalSwitchboard

Secondary distribution boards (sub-boards, PV distribution boards, etc.)

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `name` * | string | |
| `location` | string | |
| `map_locator` | string | GPS coordinates |
| `type` | string | `MSSB` \| `PVDB` \| `DSB-W` \| `DSB-S` |
| `photo` | string | |
| `sub_circuits_description` | string | |
| `comments` | string | |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## HVACUnit

Heating, ventilation, and air conditioning units.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `unit_name` * | string | |
| `make` | string | Manufacturer |
| `photo` | string | Main unit photo |
| `location` | string | |
| `type` | string | `Packaged` \| `Split` |
| `model` | string | |
| `serial_number` | string | |
| `heating_capacity_kw` | number | |
| `cooling_capacity_kw` | number | |
| `power_supply_phase` | string | |
| `nameplate_photos` | string | Nameplate photo URL |
| `indoor_unit_model` | string | Split system indoor unit |
| `indoor_unit_serial` | string | |
| `indoor_unit_nameplate_photo` | string | |
| `controller_type` | string | |
| `controller_model` | string | |
| `controller_photo` | string | |
| `temperature_sensor_type` | string | |
| `system_coverage` | string | Areas served |
| `energy_improvement_observations` | string | |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## LightingSystem

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `light_type` * | string | E.g., LED, fluorescent |
| `brand_model` | string | |
| `photo` | string | |
| `rated_wattage` | number | Watts per fixture |
| `quantity` | number | Number of fixtures |
| `fixtures_installed` | string | Installation description |
| `fixtures_photo` | string | |
| `area_location` | string | |
| `controls_type` | string | Manual, motion sensor, timer, etc. |
| `operating_hours` | string | Daily/weekly hours |
| `mounting_height` | string | |
| `mounting_constraints_photo` | string | |
| `circuit_grouping` | string | Which circuits control these fixtures |
| `sensors_photo` | string | Photo of sensor/control equipment |
| `access_limitations` | string | Maintenance access notes |
| `switchboard_photo_notes` | string | |
| `energy_improvement_observations` | string | |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## SolarPV

Photovoltaic solar installations.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `system_size_kw` | number | Installed capacity |
| `roof_photo` | string | |
| `inverter_brand_model` | string | |
| `inverter_location` | string | |
| `inverter_label_photo` | string | |
| `power_supply_to_pv` | string | |
| `electricity_meter_photo` | string | |
| `available_roof_space` | string | `Yes` \| `No` |
| `roof_space_amount` | string | Estimated m² |
| `additional_solar_space_photo` | string | |
| `suitable_switchboard` | string | `Yes` \| `No` |
| `switchboard_photo` | string | |
| `switchboard_location` | string | |
| `cable_distance` | string | Metres from roof to switchboard |
| `cable_route_description` | string | |
| `energy_improvement_observations` | string | |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## ForkliftCharger

Electric forklift battery charging infrastructure.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `charger_type` * | string | |
| `charger_photo` | string | |
| `brand_model` | string | |
| `rating` | string | Voltage/Amperage (e.g., `48V / 60A`) |
| `charger_label_photo` | string | |
| `power_supply` | string | |
| `electric_connection_photo` | string | |
| `location` | string | |
| `quantity` | number | |
| `charger_space_photo` | string | |
| `connection_description` | string | |
| `socket_connection_photo` | string | |
| `local_isolator` | string | `Yes` \| `No` |
| `circuit_identifiable` | string | `Yes` \| `No` |
| `distance_to_switchboard` | string | |
| `space_for_additional` | string | `Yes` \| `No` |
| `hardwired_socket` | string | `Hardwired` \| `Socket` |
| `scheduling_opportunity` | string | `Yes` \| `No` (load shifting potential) |
| `energy_improvement_observations` | string | |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## HotWaterSystem

Domestic/commercial hot water systems.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `dhw_details_type` * | string | System type description |
| `photo` | string | |
| `serial_number` | string | |
| `size_liters` | number | Tank capacity |
| `fuel_type` | string | Electric, gas, heat pump, solar, etc. |
| `location` | string | |
| `pipe_insulation` | string | `Yes` \| `No` |
| `pipe_insulation_thickness` | string | |
| `tempering_valve` | string | `Yes` \| `No` |
| `additional_photo` | string | |
| `more_dhw_systems` | string | `Yes` \| `No` |
| `additional_comments` | string | |
| `energy_improvement_observations` | string | |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## GeneralWater

Free-form Q&A for water-related observations.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `question` | string | Question text |
| `answer` | string | Inspector's answer |
| `photos` | string[] | Photo URLs |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## GeneralElectricity

Free-form Q&A for electricity-related observations.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `zone_id` * | string | |
| `audit_id` * | string | |
| `question` | string | |
| `answer` | string | |
| `photos` | string[] | |
| `extra_notes` | string | |
| `extra_photos` | string[] | |

---

## Entity Relationships

```
Audit (1)
  └── Zone (many)
        ├── MainSwitchboard (many)
        ├── AdditionalSwitchboard (many)
        ├── HVACUnit (many)
        ├── LightingSystem (many)
        ├── SolarPV (many)
        ├── ForkliftCharger (many)
        ├── HotWaterSystem (many)
        ├── GeneralWater (many)
        └── GeneralElectricity (many)
```

All equipment entities are **directly queryable by `audit_id`** — zone-level grouping is a UI concern, not a database constraint. This means you can fetch all HVAC units for an audit without knowing zone IDs first.

---

## Photo Storage

Photos are stored as URLs pointing to the Base44 file service. There is no local blob storage in the current web app. Photo URLs are strings in entity fields:
- `photo` — single primary photo (string)
- `extra_photos` — additional photos (string[])
- `photos` — zone photos or Q&A photos (string[])
- `nameplate_photos`, `controller_photo`, etc. — type-specific photos (string)

For mobile offline support, a `local_photo_path` field will need to shadow each URL field until the photo is uploaded and the URL is available.
