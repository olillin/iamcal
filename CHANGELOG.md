# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `CalendarDuration` class ([#13](https://github.com/olillin/iamcal/issues/13))
  - Represents properties with type `DURATION`.
  - Can be created with a duration string such as `P1D2H3M4S` or another
    `CalendarDuration`.
  - `inSeconds` and `inMilliseconds` converts the duration to seconds and
    milliseconds respectively.
  - `getValue` serializes the duration to a duration string to be used as a
    property value.
  - `floor` removes smaller units than the unit specified.
  - The factories `fromSeconds`, `fromDays` and `fromWeeks` creates a duration
    from seconds, days and weeks respectively.
  - The `fromDifference` factory creates a duration from the difference between
    two times.
- `DurationUnit` type which can be one of W, D, H, M or S which represents
  weeks, days, hours, minutes and seconds respectively.
- `formatDurationString` creates a duration string from weeks, days, hours, minutes and seconds. The duration will be prefixed with `-` if any unit is negative.
- `secondsToDurationString` converts seconds to a duration string, using the largest
  units possible.
- `weeksToDurationString` and `daysToDurationString` creates duration strings
  from weeks or days.
- `CalendarEvent` has new methods:
  - `isFullDay()` returns if the event is a full day event, i.e. if the start
    is a full day time.
  - `getExplicitEnd()` returns the value of the `DTEND` property, same as the
    old `getEnd()`.
  - `getExplicitDuration()` returns the value of the `DURATION` property, same
    as the old `getDuration()`.
- `getDefaultEventDuration()` function returns either one day or zero seconds
  depending on the `isFullDay` parameter.
- `Property` has a few new methods:
  - `setValue()` sets the property value to the serialized `value` parameter
    and updates the value type accordingly.
  - `getValue()` gets the property value, deserializes date times and
    durations based on value type.
  - `getDefaultValueType()` gets the default value type based on the name of
    the property.
  - `getExplicitValueType()` get the parameter `VALUE` or `undefined` if unset.
    As opposed to `getValueType()` which returns the default if unset.
  - `fromDuration()` creates a new property from a `CalendarDuration`.
- `CalendarDateOrTime.offset` returns a new calendar date or time offset by a
  `CalendarDuration`.
- `CalendarDate` and `CalendarDateTime` now implement `[Symbol.toPrimitive]`.
- New type guards: `isDateObject` and `isCalendarDateOrTime`.
- New constants: `ONE_WEEK_MS`, `ONE_MINUTE_SECONDS`, `ONE_HOUR_SECONDS`,
  `ONE_DAY_SECONDS` and `ONE_WEEK_SECONDS`.

### Changed

- `CalendarEvent` changes:
  - `setDuration()` now accepts values of type `CalendarDuration`.
  - `getEnd()` will now imply when the event ends even if `DTEND` is unset by calculating the end using `DURATION` if present or using the default event duration.
  - `getDuration()` will now imply the duration of the even if `DURATION` is unset by calculating the duration using `DTEND` if present or using the default event duration.
  - Events now have a default duration if neither `DTEND` nor `DURATION` is set. ([#22](https://github.com/olillin/iamcal/issues/22))
    - For full day events this is one day, for other events it is zero seconds.
- `Component.setProperty` can take a `CalendarDuration` as a value and uses the new `Property.setValue` internally.
- `CalendarDateOrTime.isFullDay()` is now a type guard which returns if the object is a `CalendarDate`.

### Fixed

- `Property.fromDate` no longer assumes that the default type is `DATE-TIME`.

## [v3.1.0] - 2026-01-22

### Added

- Synchronous io methods:
  - `loadCalendarSync()`
  - `dumpCalendarSync()`

### Changed

- All deserialization is now done synchronously meaning that methods have been
  renamed and no longer return promises.
  - `deserializeComponent()` which takes a **readline** interface has been
    replaced by `deserializeComponentLines()` which takes an array of strings.

### Deprecated

- `load()`, use `loadCalendarSync()` instead.
- `dump()`, use `dumpCalendarSync()` instead.
- `deserializeComponent()`, use `deserializeComponentLines()` or
  `deserializeComponentString()` instead.

### Fixed

- Bug where last line of component would be missed when using
  `deserializeComponentString()`, invalidating the component.

### Security

- Update depndencies.

## [v3.0.3] - 2025-10-24

### Fixed

- Folding lines cuts off the last line.

## [v3.0.2] - 2025-10-14

### Fixed

- Unquoted parameter values following quoted parameter values being treated
  as trailing data.
- TEXT validator not allowing values like `\n`.

## [v3.0.1] - 2025-10-14

### Fixed

- `unescapeTextPropertyValue` throws if it contains DQUOTE.

## [v3.0.0] - 2025-10-14

### Added

- Automatic (un)escaping of special characters (`,`, `;`, `\` and `\n`) in
  property values of type `TEXT` during (de)serialization.
- Automatic (un)quoting of property parameter values containing special characters
  (`,`, `;` and `:`) during (de)serialization.
- `Property` class, representing a property on a calendar component.
  - Property parameters are stored as a map of the parameter name to a list of
    values.
  - Has getters, setters and removers for each known parameter specified by
    RFC 5545.
  - Has a `fromDate` factory method which replaces the
    `CalendarDateOrTime.toProperty` method.
  - Can be (de)serialized independently of calendar components.
- `deserializeProperty` which can independently deserialize a property.

### Removed

- `Property` interface in favor of `Property` class.
- Previously deprecated APIs from v2.1.0.
- `CalendarDateOrTime.toProperty` in favor of `Property.fromDate`.

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

- Possible to have different types in `DTSTART` and `DTEND` ([#9](https://github.com/olillin/iamcal/issues/9)).
- Some properties falsely assumed to always be present ([#12](https://github.com/olillin/iamcal/issues/12)).
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

- Parsing start and end times doesn't work ([#4](https://github.com/olillin/iamcal/issues/4))
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

[unreleased]: https://github.com/olillin/iamcal/compare/v3.1.0...dev
[v3.0.3]: https://github.com/olillin/iamcal/compare/v3.0.3...v3.1.0
[v3.0.3]: https://github.com/olillin/iamcal/compare/v3.0.2...v3.0.3
[v3.0.2]: https://github.com/olillin/iamcal/compare/v3.0.1...v3.0.2
[v3.0.1]: https://github.com/olillin/iamcal/compare/v3.0.0...v3.0.1
[v3.0.0]: https://github.com/olillin/iamcal/compare/v2.1.2...v3.0.0
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
