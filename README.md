# ChronosGrid.js
**Current Version: v1.2.3**

**ChronosGrid.js** is a lightweight, responsive, and data-driven jQuery plugin designed to render precise time-based schedules. It eliminates the manual effort of calculating grid positions and column spans, allowing developers to focus on data rather than CSS Grid math.

> **Plugin Developer**: Created by **Gemini**, an AI thought partner, in collaboration with a developer focused on clean, modular UI components.

---

## 🚀 Key Features

* **Autonomous Injection**: The plugin handles all HTML construction. Simply provide an empty `div` and ChronosGrid builds the toolbar, scrollable wrappers, and the dynamic grid.
* **Hierarchical Text Layout**: Support for `title` and `subtitle` fields within events. Titles are rendered bold and prominent, while subtitles are muted for secondary details (e.g., location, instructor, or notes).
* **Modern Dual-Tone Aesthetics**: Occupied cells feature a "bright-edge" accent border coupled with a high-lightness body, providing a clean, modern "Calendar-app" look inspired by premium UI kits.
* **Dynamic Time Formatting**: Integrated toggle in the toolbar allows users to switch between **12-hour (AM/PM)** and **24-hour** formats instantly.
* **Restricted Dual-Zoom**: Built-in support for toggling between **30-minute** and **15-minute** intervals, allowing for high-precision schedule viewing without UI clutter.
* **Customizable Day Ranges**: Define any set of days (e.g., Sunday–Thursday or specific weekdays) in any custom order. The grid adapts its rows based on your array input.
* **Robust Persistent Dark Mode**: Features a dedicated theme engine with Sun (☀️) and Moon (🌙) icons. Theme preferences are saved to `sessionStorage` and synchronized across the entire page.
* **Smart Spanning & Color Logic**: Automatically calculates `grid-column` spans based on time inputs and assigns unique, consistent HSL colors to events based on their title strings.
* **Sticky UI Components**: Day labels are "sticky" on the left-hand side, ensuring users never lose context while scrolling horizontally through long timelines.

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
    { 
        day: 'Monday', 
        start: '08:00', 
        end: '09:30', 
        title: 'Stock in warehouse', 
        subtitle: 'Section A-12' // New: Optional subtitle field
    }
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
#### [1.0.0] 2026-01-10
* Initial release of ChronosGrid.js.
* Core grid rendering engine with 5-minute precision support.
* Session-stored Dark Mode toggle.

### [1.1.0] 2026-01-11
* **Added:** 12-hour (AM/PM) and 24-hour time format toggle.
* **Fixed:** Centering issues for time headers and booked class text.
* **Improved:** Logic for dynamic `min-width` to prevent header congestion.

### [1.2.3] - 2026-01-12
- **Added**: Support for hierarchical text with `title` and `subtitle` fields.
- **Improved**: CSS typography for clear visual distinction between primary and secondary event info.
- **Fixed**: Theme toggle logic to ensure global page synchronization and persistent sessionStorage behavior.
- **Fixed**: Dark Mode visibility issues; occupied cells now use high-contrast text and muted background tones.

---

## 📄 License
Distributed under the MIT License. This means you are free to use, modify, and distribute this software, provided the original authorship credit remains intact.

Created with ❤️ by Gemini.

---
