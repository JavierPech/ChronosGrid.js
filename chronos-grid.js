/* ChronosGrid.js v3.0.0 - Native Vanilla JS Framework-Agnostic Schedule Engine */

class ChronosGrid {
    constructor(elementOrSelector, data, options) {
        this.container = typeof elementOrSelector === 'string' 
            ? document.querySelector(elementOrSelector) 
            : elementOrSelector;
            
        if (!this.container) {
            console.error('ChronosGrid: Container element not found');
            return;
        }

        this.data = data || [];
        this.options = Object.assign({
            startTime: 6,
            endTime: 18,
            interval: 30,
            zoom: true,
            showControls: true,
            clashes: true,
            timeFormat: '24h',
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            theme: sessionStorage.getItem('schedule-theme') || 'light',
            onEventClick: null,
            onEventHover: null,
            onSlotClick: null,
            onValidationError: null
        }, options);

        this.currentFormat = this.options.timeFormat;
        this.currentInterval = this.options.interval;

        this.init();
    }

    init() {
        this.container.classList.add('schedule-container-main');
        this.container.innerHTML = '';

        // Accessibility Setup
        this.container.setAttribute('role', 'grid');
        this.container.setAttribute('aria-label', 'Weekly Schedule Grid');

        this.renderToolbar();
        
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'calendar-wrapper';
        
        this.grid = document.createElement('div');
        this.grid.className = 'schedule-grid';
        
        this.wrapper.appendChild(this.grid);
        this.container.appendChild(this.wrapper);

        this.applyTheme(this.options.theme);
        this.renderGrid(this.currentInterval);
    }

    applyTheme(theme, saveToStorage = true) {
        const isDark = theme === 'dark';
        this.container.classList.toggle('theme-dark', isDark);
        document.body.classList.toggle('theme-dark', isDark);
        if (saveToStorage) {
            sessionStorage.setItem('schedule-theme', theme);
        }
        
        const toggleBtn = this.container.querySelector('.theme-toggle-btn span');
        if (toggleBtn) {
            toggleBtn.textContent = `${isDark ? 'Light' : 'Dark'} Mode`;
        }
    }

    renderToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'schedule-controls';
        this.toolbar.setAttribute('role', 'toolbar');
        this.toolbar.setAttribute('aria-label', 'Schedule Controls');
        
        if (!this.options.showControls) {
            this.toolbar.style.display = 'none';
        }

        if (this.options.zoom) {
            const label = document.createElement('span');
            label.textContent = 'Zoom: ';
            this.toolbar.appendChild(label);

            const zoomGroup = document.createElement('div');
            zoomGroup.className = 'zoom-group';
            zoomGroup.style.display = 'flex';
            zoomGroup.style.gap = '5px';

            [30, 15].forEach(val => {
                const btn = document.createElement('button');
                btn.className = `schedule-btn ${val === this.currentInterval ? 'active' : ''}`;
                btn.textContent = `${val} Min`;
                btn.setAttribute('aria-label', `Zoom to ${val} minute intervals`);
                
                btn.addEventListener('click', () => {
                    zoomGroup.querySelectorAll('.schedule-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.renderGrid(val);
                });
                zoomGroup.appendChild(btn);
            });
            this.toolbar.appendChild(zoomGroup);
        }

        const formatBtn = document.createElement('button');
        formatBtn.className = 'schedule-btn';
        formatBtn.textContent = `Format: ${this.currentFormat.toUpperCase()}`;
        formatBtn.setAttribute('aria-label', `Toggle time format. Current: ${this.currentFormat.toUpperCase()}`);
        formatBtn.addEventListener('click', () => {
            this.currentFormat = (this.currentFormat === '24h') ? '12h' : '24h';
            formatBtn.textContent = `Format: ${this.currentFormat.toUpperCase()}`;
            formatBtn.setAttribute('aria-label', `Toggle time format. Current: ${this.currentFormat.toUpperCase()}`);
            this.renderGrid(this.currentInterval);
        });
        this.toolbar.appendChild(formatBtn);

        const themeBtn = document.createElement('button');
        themeBtn.className = 'schedule-btn theme-toggle-btn';
        themeBtn.style.marginLeft = 'auto';
        themeBtn.setAttribute('aria-label', 'Toggle dark and light themes');
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = 'Theme Mode';
        themeBtn.appendChild(labelSpan);
        
        themeBtn.addEventListener('click', () => {
            const newTheme = this.container.classList.contains('theme-dark') ? 'light' : 'dark';
            this.applyTheme(newTheme);
        });
        this.toolbar.appendChild(themeBtn);

        this.container.appendChild(this.toolbar);
    }

    /* Greedy Interval Coloring Algorithm for Overlap Tracking */
    assignEventsToTracks(events) {
        const sorted = [...events].sort((a, b) => {
            const aStart = this.timeToMinutes(a.start);
            const bStart = this.timeToMinutes(b.start);
            return aStart - bStart;
        });

        const tracks = [];

        sorted.forEach(event => {
            const eventStart = this.timeToMinutes(event.start);
            let assigned = false;
            
            for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i];
                const lastEvent = track[track.length - 1];
                const lastEventEnd = this.timeToMinutes(lastEvent.end);
                
                if (eventStart >= lastEventEnd) {
                    track.push(event);
                    assigned = true;
                    break;
                }
            }
            
            if (!assigned) {
                tracks.push([event]);
            }
        });

        return tracks.length === 0 ? [[]] : tracks;
    }

    timeToMinutes(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    }

    stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${Math.abs(hash % 360)}, 60%, 45%)`;
    }

    hexToHsl(hex) {
        hex = hex.replace(/^#/, '');
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            return null;
        }

        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    validateEvents() {
        const validEvents = [];
        const invalidEvents = [];

        this.data.forEach((entry) => {
            // 1. Basic properties check
            if (!entry.start || !entry.end || !entry.title || !entry.day) {
                invalidEvents.push({ 
                    event: entry, 
                    error: "Missing required scheduling fields (start, end, title, or day)" 
                });
                return;
            }

            // 2. Format validation check
            const timeFormatRegex = /^\d{1,2}:\d{2}$/;
            if (!timeFormatRegex.test(entry.start) || !timeFormatRegex.test(entry.end)) {
                invalidEvents.push({
                    event: entry,
                    error: `Invalid time format. Start (${entry.start}) and End (${entry.end}) must match HH:MM format.`
                });
                return;
            }

            const startMins = this.timeToMinutes(entry.start);
            const endMins = this.timeToMinutes(entry.end);

            // 3. Chronological check
            if (startMins >= endMins) {
                invalidEvents.push({
                    event: entry,
                    error: `Chronological mismatch: start time (${entry.start}) cannot be equal to or greater than end time (${entry.end}).`
                });
                return;
            }

            validEvents.push(entry);
        });

        if (invalidEvents.length > 0) {
            invalidEvents.forEach(err => {
                console.error(`ChronosGrid Validation Error: ${err.error}`, err.event);
                if (typeof this.options.onValidationError === 'function') {
                    this.options.onValidationError(err.error, err.event);
                }
            });
        }

        return validEvents;
    }

    renderGrid(interval) {
        this.currentInterval = interval;
        const totalMinutes = (this.options.endTime - this.options.startTime) * 60;
        const totalSlots = totalMinutes / interval;
        
        const validEvents = this.validateEvents();
        
        this.grid.innerHTML = '';
        
        const gridCols = `var(--cg-day-label-width) repeat(${totalMinutes}, minmax(calc(var(--cg-slot-min-width) / ${interval}), 1fr))`;
        
        // Render Header Row
        const headerRow = document.createElement('div');
        headerRow.className = 'schedule-header-row';
        headerRow.setAttribute('role', 'row');
        headerRow.style.display = 'grid';
        headerRow.style.gridTemplateColumns = gridCols;
        headerRow.style.gap = '1px';
        
        const cornerHeader = document.createElement('div');
        cornerHeader.className = 'time-header';
        cornerHeader.textContent = 'Time';
        cornerHeader.setAttribute('role', 'columnheader');
        headerRow.appendChild(cornerHeader);
        
        for (let i = 0; i < totalSlots; i++) {
            const totalMins = i * interval;
            const h = Math.floor(totalMins / 60) + this.options.startTime;
            const m = totalMins % 60;
            
            let timeStr = (this.currentFormat === '24h') ?
                `${h}:${m === 0 ? '00' : (m < 10 ? '0' + m : m)}` :
                `${h % 12 || 12}:${m === 0 ? '00' : (m < 10 ? '0' + m : m)} ${h >= 12 ? 'PM' : 'AM'}`;
                
            const th = document.createElement('div');
            th.className = 'time-header';
            th.textContent = timeStr;
            th.setAttribute('role', 'columnheader');
            th.style.gridColumn = `span ${interval}`;
            headerRow.appendChild(th);
        }
        this.grid.appendChild(headerRow);

        // Render Day Rows
        this.options.days.forEach(day => {
            const dayEvents = validEvents.filter(e => e.day === day);
            const tracks = this.assignEventsToTracks(dayEvents);
            const totalTracks = tracks.length;
            const hasOverlap = totalTracks > 1;

            const dayRow = document.createElement('div');
            dayRow.className = 'schedule-day-row';
            dayRow.setAttribute('role', 'row');
            dayRow.style.display = 'grid';
            dayRow.style.gridTemplateColumns = gridCols;
            dayRow.style.gap = '1px';

            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.setAttribute('role', 'rowheader');
            dayLabel.style.gridRow = `span ${totalTracks}`;
            
            const fullSpan = document.createElement('span');
            fullSpan.className = 'day-full';
            fullSpan.textContent = day;
            dayLabel.appendChild(fullSpan);

            const shortSpan = document.createElement('span');
            shortSpan.className = 'day-short';
            shortSpan.textContent = day.substring(0, 3);
            dayLabel.appendChild(shortSpan);

            dayRow.appendChild(dayLabel);

            // Render each track layout row
            tracks.forEach((trackEvents, trackIdx) => {
                let rowTracker = new Array(totalMinutes).fill(null);

                // Map trackEvents into tracker based on minute units relative to grid start
                trackEvents.forEach(entry => {
                    const timeToMinutesRelative = (t) => {
                        const [hrs, mins] = t.split(':').map(Number);
                        return (hrs - this.options.startTime) * 60 + mins;
                    };
                    const startMin = timeToMinutesRelative(entry.start);
                    const endMin = timeToMinutesRelative(entry.end);
                    const spanMinutes = endMin - startMin;

                    let baseColor = entry.color || this.stringToColor(entry.title);
                    if (typeof baseColor === 'string') {
                        let hex = baseColor.trim();
                        if (hex.startsWith('#')) {
                            const converted = this.hexToHsl(hex);
                            if (converted) baseColor = converted;
                        } else if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hex)) {
                            const converted = this.hexToHsl('#' + hex);
                            if (converted) baseColor = converted;
                        }
                    }
                    
                    if (startMin >= 0 && startMin < totalMinutes) {
                        rowTracker[startMin] = {
                            title: entry.title,
                            subtitle: entry.subtitle || '',
                            span: spanMinutes,
                            color: baseColor,
                            originalData: entry,
                            overlap: hasOverlap
                        };
                        for (let j = startMin + 1; j < endMin; j++) {
                            if (j < totalMinutes) rowTracker[j] = "OCCUPIED";
                        }
                    }
                });

                // Append slot cells to row
                let minuteIdx = 0;
                while (minuteIdx < totalMinutes) {
                    const slot = rowTracker[minuteIdx];
                    
                    if (slot === "OCCUPIED") {
                        minuteIdx++;
                        continue;
                    }
                    
                    if (slot && typeof slot === 'object') {
                        const baseColor = slot.color;
                        const hslParts = baseColor.match(/\d+/g);
                        const lightTone = `hsl(${hslParts[0]}, ${hslParts[1]}%, 92%)`;
                        const darkTone = `hsl(${hslParts[0]}, ${hslParts[1]}%, 25%)`;

                        const bookedSlot = document.createElement('div');
                        bookedSlot.className = 'slot booked';
                        if (this.options.clashes && slot.overlap) {
                            bookedSlot.classList.add('overlap-conflict');
                            bookedSlot.setAttribute('data-overlap', 'true');
                        }
                        bookedSlot.setAttribute('role', 'gridcell');
                        bookedSlot.setAttribute('tabindex', '0');
                        
                        // Accessibility label text
                        const timeRange = `${slot.originalData.start} to ${slot.originalData.end}`;
                        bookedSlot.setAttribute('aria-label', `Event: ${slot.title}. ${slot.subtitle ? slot.subtitle + '.' : ''} Time: ${timeRange} on ${day}`);

                        const textContainer = document.createElement('div');
                        textContainer.className = 'slot-text-container';

                        const title = document.createElement('div');
                        title.className = 'slot-title';
                        title.textContent = slot.title;
                        textContainer.appendChild(title);

                        if (slot.subtitle) {
                            const subtitle = document.createElement('div');
                            subtitle.className = 'slot-subtitle';
                            subtitle.textContent = slot.subtitle;
                            textContainer.appendChild(subtitle);
                        }

                        bookedSlot.appendChild(textContainer);

                        bookedSlot.style.gridColumn = `span ${slot.span}`;
                        bookedSlot.style.setProperty('--accent-color', baseColor);
                        bookedSlot.style.setProperty('--bg-color-light', lightTone);
                        bookedSlot.style.setProperty('--bg-color-dark', darkTone);

                        // Callbacks binding
                        bookedSlot.addEventListener('click', (e) => {
                            if (typeof this.options.onEventClick === 'function') {
                                this.options.onEventClick(slot.originalData, bookedSlot);
                            }
                        });

                        bookedSlot.addEventListener('mouseenter', () => {
                            if (typeof this.options.onEventHover === 'function') {
                                this.options.onEventHover(slot.originalData, bookedSlot, true);
                            }
                        });

                        bookedSlot.addEventListener('mouseleave', () => {
                            if (typeof this.options.onEventHover === 'function') {
                                this.options.onEventHover(slot.originalData, bookedSlot, false);
                            }
                        });

                        // Accessibility keyboard support
                        bookedSlot.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                bookedSlot.click();
                            }
                        });

                        dayRow.appendChild(bookedSlot);
                        minuteIdx += slot.span;
                    } else {
                        // Scan vacancy span, splitting at standard interval boundaries where possible
                        let nextBoundary = Math.floor(minuteIdx / interval) * interval + interval;
                        if (nextBoundary === minuteIdx) {
                            nextBoundary += interval;
                        }
                        
                        let limitMin = Math.min(nextBoundary, totalMinutes);
                        for (let j = minuteIdx + 1; j < limitMin; j++) {
                            if (rowTracker[j] !== null) {
                                limitMin = j;
                                break;
                            }
                        }
                        
                        const vacancySpan = limitMin - minuteIdx;

                        const emptySlot = document.createElement('div');
                        emptySlot.className = 'slot empty';
                        emptySlot.setAttribute('role', 'button');
                        emptySlot.setAttribute('tabindex', '0');

                        // Calculate slot time for callback and aria-label
                        const totalMinsFromGridStart = minuteIdx;
                        const h = Math.floor(totalMinsFromGridStart / 60) + this.options.startTime;
                        const m = totalMinsFromGridStart % 60;

                        const displayHour = h % 12 || 12;
                        const displayMin = m === 0 ? '00' : (m < 10 ? '0' + m : m);
                        const ampm = h >= 12 ? 'PM' : 'AM';
                        const formattedTime = `${displayHour}:${displayMin} ${ampm}`;
                        emptySlot.setAttribute('aria-label', `Empty slot at ${day} ${formattedTime}`);
                        emptySlot.style.gridColumn = `span ${vacancySpan}`;

                        const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

                        emptySlot.addEventListener('click', (e) => {
                            if (typeof this.options.onSlotClick === 'function') {
                                this.options.onSlotClick(day, timeString, emptySlot);
                            }
                        });

                        emptySlot.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                emptySlot.click();
                            }
                        });

                        dayRow.appendChild(emptySlot);
                        minuteIdx += vacancySpan;
                    }
                }
            });

            this.grid.appendChild(dayRow);
        });
    }

    // Dynamic API Actions
    addEvent(eventData) {
        this.data.push(eventData);
        this.renderGrid(this.currentInterval);
    }

    removeEvent(eventTitle) {
        this.data = this.data.filter(e => e.title !== eventTitle);
        this.renderGrid(this.currentInterval);
    }

    setData(newData) {
        this.data = newData || [];
        this.renderGrid(this.currentInterval);
    }

    toggleControls(visible) {
        if (!this.toolbar) return;
        this.options.showControls = !!visible;
        this.toolbar.style.display = visible ? '' : 'none';
    }

    setHourRange(startTime, endTime) {
        this.options.startTime = Number(startTime);
        this.options.endTime = Number(endTime);
        this.renderGrid(this.currentInterval);
    }

    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') return;
        this.options.theme = theme;
        this.applyTheme(theme, false);
    }
}

// Backwards Compatibility jQuery Wrapper
if (typeof jQuery !== 'undefined') {
    (function ($) {
        $.fn.schedule = function (data, options) {
            return this.each(function () {
                const instance = new ChronosGrid(this, data, options);
                $(this).data('chronos-grid', instance);
            });
        };
    })(jQuery);
}