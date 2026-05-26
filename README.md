# ChronosGrid.js
**Current Version: v3.0.0 (PRO)**

**ChronosGrid.js** is a lightweight, responsive, and framework-agnostic **Vanilla JS** schedule engine designed to render precise time-based schedules. It eliminates the manual effort of calculating grid positions and column spans, allowing developers to focus on data rather than CSS Grid math.

> **Plugin Developer**: Created by **Gemini**, an AI thought partner, in collaboration with a developer focused on clean, modular UI components.

---

## 🚀 Key Features

* **Zero-Dependency Native Architecture**: Re-engineered into a modern Vanilla JS class, eliminating any mandatory jQuery dependency while reducing payload sizes and maximizing rendering speeds.
* **Intelligent Collision & Overlap Spacing**: Built-in interval scheduling logic (`assignEventsToTracks`) automatically groups and stacks conflicting/overlapping day events into parallel stacked tracks within a clean row container.
* **Dynamic Event Callbacks**: Standard options support custom trigger actions (`onEventClick` and `onEventHover`) for responsive dashboard workflows.
* **Deep WAI-ARIA Accessibility (a11y)**: Fully semantic layout structure mapping custom roles (`role="grid"`, `role="row"`, `role="rowheader"`, `role="columnheader"`, `role="gridcell"`) with accessible `aria-label` screen speech synthesis on scheduled events.
* **Interactive Keyboard Navigation**: Users can tab through calendar cards and activate click actions via **Enter** or **Space** keys, using elegant theme-integrated focus rings.
* **State-of-the-Art CSS Variables**: Custom variable-driven stylesheets (`--cg-*`) for Light and Dark modes with smooth transition capabilities.
* **Dynamic Manipulation APIs**: Add or remove scheduled items on the fly using built-in methods like `addEvent`, `removeEvent`, and `setData`.
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
| `days` | Array | `[Sun...Sat]` | List of days to display. |
| `theme` | String | `'light'` | Theme selector: `'light'` or `'dark'`. |
| `onEventClick` | Function | `null` | Callback function triggered when a card is clicked/selected. `(eventData, element) => {}` |
| `onEventHover` | Function | `null` | Callback function triggered when cursor enters or leaves a card. `(eventData, element, isEntering) => {}` |

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

---

## 🎨 CSS Customization

The plugin is fully customizable using modern HSL-driven CSS custom variables. Override these variables inside your app stylesheets to adjust colors:
* `--cg-bg-canvas`: The main card and grid background fill.
* `--cg-border-subtle`: Separator lines dividing the time blocks.
* `--cg-border-medium`: Divider border on the sticky day column.
* `--cg-btn-active-bg`: Color of toggled active control segments.

---

## 📜 Version History

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
