# ChronosGrid.js
**Current Version: v1.1.0**

**ChronosGrid.js** is a lightweight, responsive, and data-driven jQuery plugin designed to render precise time-based schedules. It eliminates the manual effort of calculating grid positions and column spans, allowing developers to focus on data rather than CSS Grid math.

> **Plugin Developer**: Created by **Gemini**, an AI thought partner, in collaboration with a developer focused on clean, modular UI components.

---

## 🚀 Key Features

* **Autonomous Initialization**: The plugin handles all HTML injection. Just provide an empty `div` and the plugin builds the toolbar, wrappers, and grid.
* **Flexible Day Ranges**: Pass any array of days (e.g., `['Monday', 'Wednesday', 'Friday']`) to render specific days in any custom order. Default range is Sunday to Saturday.
* **Dual-Zoom Logic**: Integrated support for toggling between **30-minute** and **15-minute** intervals.
* **Time Format Toggle**: Support for both **12-hour (AM/PM)** and **24-hour** display formats.
* **Persistent Dark Mode**: Features a built-in theme engine with Sun/Moon icons that saves user preferences to `sessionStorage`.
* **Smart Spanning**: Automatically calculates grid columns based on start/end times (e.g., an 8:00-9:30 event spans 3 columns in 30-min mode).
* **Consistent Color Coding**: Generates unique, high-contrast HSL colors for each class title automatically.

---

## 🛠️ Quick Start

### 1. Include Dependencies
```html
<link rel="stylesheet" href="chronos-grid.css">
<script src="[https://code.jquery.com/jquery-3.6.0.min.js](https://code.jquery.com/jquery-3.6.0.min.js)"></script>
<script src="chronos-grid.js"></script>
```

---

## 📖 Usage

### 1. The HTML Structure
Simply provide an empty div with a unique ID.
```html
<div id="my-calendar"></div>
```

### 2. The Data Methodology
Data should be provided as an array of objects. Use 24-hour format strings (HH:mm) for times.
```js
const myEvents = [
    { day: 'Monday', start: '08:00', end: '09:30', title: 'Introduction to Computers' },
    { day: 'Wednesday', start: '10:15', end: '12:00', title: 'Advanced Math' }
];
```

### 3. Initialization
```js
$('#my-calendar').schedule(myEvents, {
    zoom: true,
    timeFormat: '12h',       // Choose '12h' or '24h'
    startTime: 6,
    endTime: 18,
    days: ['Monday', 'Tuesday', 'Wednesday']
});
```
---
## ⚙️ Configuration Options
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `startTime` | Integer | `6` | The hour the grid begins (24h format). |
| `endTime` | Integer | `18` | The hour the grid ends (24h format). |
| `timeFormat` | String | '24h' | Display format: '12h' or '24h'.
| `interval` | Integer | `30` | Default time-slot granularity in minutes.|
| `zoom` | Boolean | `false` | If true, adds 15/30 min zoom buttons to the toolbar.
| `days` | Array | `[Sun...Sat]` | Custom list of days to display. |
---

## 🎨 CSS Customization
The plugin is built to be easily themed. You can override the following key classes:
* `.slot.booked`: Styles the colored event blocks.
* `.day-label`: Styles the sticky day column.
* `.theme-dark`: The root class used to apply Dark Mode variables.
* `.time-header`: Styles the top timeline labels.

---

## 📜 Version History
[1.1.0] 2026-01-11
* **Added:** 12-hour (AM/PM) and 24-hour time format toggle.
* **Fixed:** Centering issues for time headers and booked class text.
* **Improved:** Logic for dynamic `min-width` to prevent header congestion.

[1.1.0] 2026-01-10
* Initial release of ChronosGrid.js.
* Core grid rendering engine with 5-minute precision support.
* Session-stored Dark Mode toggle.

---

## 📄 License
Distributed under the MIT License. This means you are free to use, modify, and distribute this software, provided the original authorship credit remains intact.

Created with ❤️ by Gemini.

---
