# ChronosGrid.js
**Current Version: v3.0.0 (PRO)**

**ChronosGrid.js** is a lightweight, responsive, and framework-agnostic **Vanilla JS** schedule engine designed to render precise time-based schedules. It eliminates the manual effort of calculating grid positions and column spans, allowing developers to focus on data rather than CSS Grid math.

> **Plugin Developer**: Created by **Gemini**, an AI thought partner, in collaboration with a developer focused on clean, modular UI components.

---

## 🚀 Key Features

* **Zero-Dependency Native Architecture**: Re-engineered into a modern Vanilla JS class, eliminating any mandatory jQuery dependency while reducing payload sizes and maximizing rendering speeds.
* **Intelligent Collision & Overlap Spacing**: Built-in interval scheduling logic (`assignEventsToTracks`) automatically groups and stacks conflicting/overlapping day events into parallel stacked tracks within a clean row container.
* **Pulsing Conflict Overlap Alerts**: Visual tracking identifiers that flag parallel track conflicts natively (injecting `data-overlap="true"` and class `.slot.booked.overlap-conflict`) with stunning red-pulsing glassmorphic indicators.
* **Slot Interaction API**: Enable users to interact with vacant grid cells via keyboard/click callback integration (`onSlotClick`) for rapid scheduling additions.
* **Dynamic Event Callbacks**: Standard options support custom trigger actions (`onEventClick` and `onEventHover`) for responsive dashboard workflows.
* **Deep WAI-ARIA Accessibility (a11y)**: Fully semantic layout structure mapping custom roles (`role="grid"`, `role="row"`, `role="rowheader"`, `role="columnheader"`, `role="gridcell"`) with accessible `aria-label` screen speech synthesis on scheduled and vacant grid cells.
* **Interactive Keyboard Navigation**: Users can tab through calendar cards and vacant cells, activating click actions via **Enter** or **Space** keys, using elegant theme-integrated focus rings.
* **State-of-the-Art CSS Variables**: Custom variable-driven stylesheets (`--cg-*`) for Light and Dark modes with smooth transition capabilities.
* **Dynamic Manipulation APIs**: Add or remove scheduled items on the fly using built-in methods like `addEvent`, `removeEvent`, `setData`, `setHourRange`, `toggleControls`, and `setTheme`.
* **Segmented iOS-Style Zoom**: Integrated toolbar that groups zoom buttons (`15 Min` / `30 Min`) into a sleek segmented capsule button group.
* **Backwards Compatibility**: Includes a built-in jQuery wrapper so legacy calls (`$(selector).schedule(...)`) continue to work seamlessly out-of-the-box.

---

## 🛠️ Quick Start

### 1. Include Dependencies
Simply link the compiled stylesheet and the modern Vanilla JS script:
```html
<link rel="stylesheet" href="chronos-grid.css">
<script src="chronos-grid.js"></script>
```

---

## 📖 Usage

### 1. The HTML Structure
Simply provide an empty container element with a unique ID:
```html
<div id="my-calendar"></div>
```

### 2. The Data Structure
Define schedule data as an array of objects. Use 24-hour format strings (HH:mm) for times.
```js
const myEvents = [
    { 
        day: 'Monday', 
        start: '08:00', 
        end: '09:30', 
        title: 'Weekly Standup', 
        subtitle: 'Conference Room 4'
    }
];
```

### 3. Native Vanilla JS Initialization (Recommended)
Instantiate ChronosGrid using the modern native constructor:
```js
const grid = new ChronosGrid('#my-calendar', myEvents, {
    zoom: true,
    timeFormat: '12h',
    startTime: 7,
    endTime: 18,
    days: ['Monday', 'Tuesday', 'Wednesday'],
    onEventClick: (event, element) => {
        console.log("Clicked:", event.title);
    }
});
```

### 4. Legacy jQuery Initialization (Compatibility Layer)
If your project depends on jQuery, you can still initialize the scheduler using the legacy syntax:
```js
$('#my-calendar').schedule(myEvents, {
    zoom: true,
    startTime: 7,
    endTime: 18
});

// Access the underlying native instance via jQuery data object:
const gridInstance = $('#my-calendar').data('chronos-grid');
gridInstance.addEvent(...);
```

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `startTime` | Integer | `6` | The hour the grid begins (24h format). |
| `endTime` | Integer | `18` | The hour the grid ends (24h format). |
| `timeFormat` | String | `'24h'` | Display format: `'12h'` or `'24h'`. |
| `interval` | Integer | `30` | Default time-slot granularity in minutes. |
| `zoom` | Boolean | `false` | If true, adds segmented 15/30 min zoom controls. |
| `showControls` | Boolean | `true` | If false, programmatically bypasses rendering the control toolbar wrapper entirely. |
| `clashes` | Boolean | `true` | If true, detects schedule collisions and highlights clashing tracks in red. |
| `days` | Array | `[Sun...Sat]` | List of days to display. |
| `theme` | String | `'light'` | Theme selector: `'light'` or `'dark'`. |
| `onEventClick` | Function | `null` | Callback function triggered when a card is clicked/selected. `(eventData, element) => {}` |
| `onEventHover` | Function | `null` | Callback function triggered when cursor enters or leaves a card. `(eventData, element, isEntering) => {}` |
| `onSlotClick` | Function | `null` | Callback function triggered when a vacant cell is clicked. `(dayName, timeString, cellDOMElement) => {}` |
| `onValidationError` | Function | `null` | Callback function triggered when validation errors occur in schedule coordinates. `(errorMessage, eventData) => {}` |

---

## 🎛️ Public API Actions

Manipulate the calendar dynamically using the native object methods:

### 1. `addEvent(eventData)`
Dynamically inserts an event, instantly recalculating tracks and rendering the grid.
```js
grid.addEvent({
    day: 'Monday',
    start: '10:00',
    end: '11:00',
    title: 'Code Review',
    subtitle: 'GitHub Pull Requests'
});
```

### 2. `removeEvent(eventTitle)`
Deletes events matching the title parameter and compiles the grid.
```js
grid.removeEvent('Code Review');
```

### 3. `setData(newData)`
Replaces the active dataset and re-renders the schedule.
```js
grid.setData([
    { day: 'Friday', start: '13:00', end: '14:00', title: 'Tech Talk' }
]);
```

### 4. `toggleControls(visible)`
Programmatically shows or hides the control toolbar wrapper dynamically.
```js
// Hide control toolbar
grid.toggleControls(false);

// Show control toolbar
grid.toggleControls(true);
```

### 5. `setHourRange(startTime, endTime)`
Dynamically shrinks or expands the calendar columns hour range on-the-fly without destroying widget states or toolbar elements.
```js
// Render hours from 8:00 AM to 4:00 PM (16:00)
grid.setHourRange(8, 16);
```

### 6. `setTheme(theme)`
Programmatically synchronizes the calendar's internal state with your system or global dashboard theme. Bypasses persistent `sessionStorage` overrides for clean global state synchronization.
```js
// Sync global dark theme
grid.setTheme('dark');
```

---

## 🎨 CSS Customization

The plugin is fully customizable using modern HSL-driven CSS custom variables. Override these variables inside your app stylesheets to adjust colors:
* `--cg-bg-canvas`: The main card and grid background fill.
* `--cg-border-subtle`: Separator lines dividing the time blocks.
* `--cg-border-medium`: Divider border on the sticky day column.
* `--cg-btn-active-bg`: Color of toggled active control segments.
* `--cg-conflict-border`: Border and accent color for conflict highlights.
* `--cg-conflict-glow`: Box shadow glow color for pulsing conflict highlights.
* `--cg-day-label-width`: Width of the sticky day column (automatically scales responsively).
* `--cg-slot-min-width`: Minimum width of individual time-slot column tracks.
* `--cg-slot-height`: Minimum height of event slots.

---

## 📜 Version History

#### [3.2.0] - 2026-06-05
* **Added**: **Strict Data Validation & Crash Prevention**: Filters invalid events (e.g. `start >= end`) and outputs `console.error` logs, safeguarding against infinite layout calculations and memory exhaustion.
* **Added**: **ValidationError Callback**: Introduced `onValidationError` to allow host applications to catch timeframe mismatches and surface custom notices/toasts directly to users.
* **Added**: **Hexadecimal Color Input**: Extended `stringToColor` fallback with `hexToHsl(hex)` checking to natively support user-defined hex colors (e.g. `#10b981`) while maintaining clean stylesheet light/dark HSL tone variants.
* **Added**: **Responsive CSS Fluid Scale**: Converted layout sizing constraints into CSS custom variables (`--cg-day-label-width`, `--cg-slot-min-width`, and `--cg-slot-height`).
* **Added**: **Mobile View optimization**: Created compact `@media (max-width: 768px)` stylesheet scale settings alongside mobile day abbreviations (e.g. `Wed`) to eliminate overflow scrolling on phone viewports.
* **Added**: **Clash Detection Toggle**: Integrated `clashes` initialization flag (defaults to `true`) to conditionally toggle overlap visual conflicts.

#### [3.1.0] - 2026-05-31
* **Added**: **Sub-Interval Column Precision**: Redesigned grid alignment onto a minute-scale micro-columns coordinate system (e.g. 720 columns), allowing events to start and end at arbitrary minutes (e.g. `13:45` to `14:45`) without absolute positioning.
* **Added**: **Dynamic Vacancy Splitting**: Scans vacant time spans and dynamically splits them into predictable clickable intervals, yielding custom fractional cells only where bounded by non-aligned events.
* **Added**: **Slot Interaction API** with fully keyboard-accessible empty slot clicks (`onSlotClick`).
* **Added**: **Visual Conflict Indicators** with pulsing glassmorphic red highlights (`.overlap-conflict` / `data-overlap="true"`).
* **Added**: **Programmatic Toolbar Toggle** option (`showControls`) and API method (`toggleControls`).
* **Added**: **Dynamic Columns API** with high-performance hour range changes (`setHourRange`).
* **Added**: **Programmatic Global Theme Sync** with storage bypass integration (`setTheme`).
* **Added**: Accessibility vacant slot focus rings (`:focus-visible`) and clear custom `aria-label` generators.

#### [3.0.0] - 2026-05-26
* **Refactored**: Rewrote engine from jQuery to standard ES6 Vanilla JS Class API.
* **Added**: High-performance **Interval Scheduling overlap tracks** for collision-free schedules.
* **Added**: Native click/hover action callbacks (`onEventClick` and `onEventHover`).
* **Added**: WAI-ARIA role structures, keyboard grid tab navigation, and responsive outline focus rings.
* **Added**: Direct state manipulation APIs (`addEvent`, `removeEvent`, `setData`).
* **Improved**: Replaced raw buttons with segmented iOS-style zoom capsule sliders.
* **Improved**: Removed Sun/Moon emojis from theme toggle button for clean flat text styling.
* **Fixed**: Horizontal alignment bugs on multi-row wraps by nesting grid rows natively.

#### [1.2.3] - 2026-01-12
* **Added**: Support for hierarchical text with `title` and `subtitle` fields.
* **Fixed**: Theme toggle persistent session sync.

#### [1.1.0] - 2026-01-11
* **Added**: 12-hour / 24-hour formatting toggle.

#### [1.0.0] - 2026-01-10
* Initial release of ChronosGrid.js.

---

## 📄 License

Distributed under the MIT License. This means you are free to use, modify, and distribute this software, provided the original authorship credit remains intact.

Created with ❤️ by Gemini.
