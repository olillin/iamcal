# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Automatic escaping of special characters (`,`, `;`, `\` and `\n`) in
  property values of type `TEXT` during serialization.
- Automatic unescaping of special characters (`,`, `;`, `\` and `\n`) in
  property values of type `TEXT` during deserialization.
- Automatic quoting of property parameter values containing special characters
  (`,`, `;` and `:`) during serialization.
- Automatic unquoting of property parameter values containing special characters
  (`,`, `;` and `:`) during deserialization.
- `Property` class, representing a property on a calendar component.
  - Property parameters are stored as a map of the parameter name to a list of
    values.
  - Has getters, setters and removers for each known parameter specified by
    RFC 5545.
  - Can be (de)serialized independently of calendar components.

### Removed

- `Property` interface in favor of `Property` class.
- Previously deprecated APIs.

## [v2.1.2] - 2025-08-14

### Changed

- `default` export is now last in `package.json` to avoid confusing Webpack.

## [v2.1.1] - 2025-08-08

### Added

- This changelog. (#18)

### Fixed

- Text validation fails for escaped characters.

## [v2.1.0] - 2025-08-07

### Changed

- Implement DURATION for calendar events.
- Add `CalendarDate` and `CalendarDateTime` classes and allow these in place of
  `Date`.
- Add component and property validation.
- Add `get` prefix to property getters. I.e. `summary` -> `getSummary`.
- Rename some property getters and setters for clarity:
  - prodID -> productId
  - calScale -> calendarScale
  - geo -> geographicPosition
  - lastMod -> lastModified
- Rename deserialization functions.
  - deserialize -> deserializeComponent
  - deserializeString -> deserializeComponentString
- Add documentation for most functions and methods.
- Add unit tests.
  - Run on push with GitHub Actions.
- Add ESLint config.
  - Require JSDoc for classes and functions.
  - Run on push with GitHub Actions.
- Add Prettier config.
- Add `test`, `coverage` and `lint` npm scripts.

### Deprecated

- Property getters without the `get` prefix.
- Property getters and setters with updated property names.
- `deserialize` and `deserializeString`, use `deserializeComponent` and
  `deserializeComponentString` instead.

### Removed

- `fullDay` parameter from the following setters:
  - `CalendarEvent.setStamp`
  - `CalendarEvent.setStart`
  - `CalendarEvent.setEnd`

### Fixed

- Possible to have different types in `DTSTART` and `DTEND` (#9).
- Some properties falsely assumed to always be present (#12).
- `DTSTAMP` property being able to be set as `DATE` value type.
- `LAST-MODIFIED` property incorrectly being set as `LAST-MOD`.

## [v2.0.0] - 2025-07-20

### Added

- All exports to `iamcal` module.
- Compatability with both CommonJS and ESModules.

### Removed

- All submodules (`iamcal/parse` and `iamcal/io`).

### Fixed

- Setters `setMethod` and `setCalendarName` unable to be chained Calendar.

## [v1.1.1] - 2025-07-18

### Fixed

- `DTEND` is inclusive when it should be exclusive.

## [v1.1.0] - 2025-07-18

### Added

- Setting date values as full dates, not just date-times.
- Method chaining for calendar components.

### Fixed

- Parsing start and end times doesn't work (#4)
- `CalendarEvent` missing method `removeGeo`.

## [v1.0.3] - 2025-06-19

### Added

- Specific constructors for `Calendar` and `CalendarEvent`
  - `Calendar` can be created with a product id and an optional iCalendar
    version number.
  - `CalendarEvent` can be created with a UID, date time stamp and start time.
- Utility methods on `Component`:
  - Remove properties: `removePropertiesWithName(name: string)`
  - Add subcomponent: `addComponent(component: Component)`
  - Remove subcomponent: `removeComponent(component: Component): boolean`
  - Get subcomponents: `getComponents(name: string): Component[]`
- New property getters/setters (and removers) on `Calendar`: `PRODID`,
  `VERSION`, `CALSCALE`, `METHOD`, `X-WR-CALNAME` and `X-WR-CALDESC`.
- Property removers for optional properties on `CalendarEvent`.
- New property getters/setters/removers on `CalendarEvent`: `CREATED`
  and `GEO`.
- `TimeZone` component.
  - Represents a `VTIMEZONEOFFSET`, containing time zone information for a
    calendar.
  - Has getters (and setters/removers) for the following properties: `TZID`,
    `LAST-MOD` and `TZURL`
  - Has getters for all time zone offset subcomponents, or filtered by
    `DAYLIGHT`/`STANDARD`.
- `TimeZoneOffset` component.
  - Represents the `DAYLIGHT` and `STANDARD` subcomponents.
  - Has getters (and setters/removers) for the following properties: `DTSTART`,
    `TZOFFSETFROM`, `TZOFFSETTO`, `TZNAME` and `COMMENT`.
- Explicit type exports in `package.json`.

## [v1.0.2] - 2025-01-05

### Removed

- Uglification/minification of emitted JavaScript to make it easier to debug the
  code.

### Fixed

- Incorrectly depending on `typescript`, it is now a development dependency.

## [v1.0.1] - 2025-12-12

### Added

- Uglification/minification of emitted JavaScript to decrease bundle size.
- GitHub Actions workflows:
  - Test package on push.
  - Publish package on push to `main`.

### Changes

- `io.dump()` is now asynchronous.

### Removed

- `tsc` development dependency.

## [v1.0.0] - 2025-12-12

### Added

- Base calendar `Component` class.
  - Has basic methods for getting and setting component properties.
- Component serialization and deserialization.
- `Calendar` component class.
  - Represents a `VCALENDAR` component.
  - Has `events()` getter  for getting all event subcomponents.
- `CalendarEvent` component class.
  - Represents a `VEVENT` component.
  - Has getters/setters for the following properties: `DTSTART`, `DTEND`,
    `SUMMARY`, `DESCRIPTION` and `LOCATION`.

[unreleased]: https://github.com/olillin/iamcal/compare/v2.1.2...dev
[v2.1.2]: https://github.com/olillin/iamcal/compare/v2.1.1...v2.1.2
[v2.1.1]: https://github.com/olillin/iamcal/compare/v2.1.0...v2.1.1
[v2.1.0]: https://github.com/olillin/iamcal/compare/v2.0.0...v2.1.0
[v2.0.0]: https://github.com/olillin/iamcal/compare/v1.1.1...v2.0.0
[v1.1.1]: https://github.com/olillin/iamcal/compare/v1.1.0...v1.1.1
[v1.1.0]: https://github.com/olillin/iamcal/compare/v1.0.3...v1.1.0
[v1.0.3]: https://github.com/olillin/iamcal/compare/v1.0.2...v1.0.3
[v1.0.2]: https://github.com/olillin/iamcal/compare/v1.0.1...v1.0.2
[v1.0.1]: https://github.com/olillin/iamcal/compare/v1.0.0...v1.0.1
[v1.0.0]: https://github.com/olillin/iamcal/commits/v1.0.0
