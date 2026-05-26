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
            timeFormat: '24h',
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            theme: sessionStorage.getItem('schedule-theme') || 'light',
            onEventClick: null,
            onEventHover: null
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

    applyTheme(theme) {
        const isDark = theme === 'dark';
        this.container.classList.toggle('theme-dark', isDark);
        document.body.classList.toggle('theme-dark', isDark);
        sessionStorage.setItem('schedule-theme', theme);
        
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

    renderGrid(interval) {
        this.currentInterval = interval;
        const totalMinutes = (this.options.endTime - this.options.startTime) * 60;
        const totalSlots = totalMinutes / interval;
        
        this.grid.innerHTML = '';
        
        const minColWidth = interval < 30 ? '100px' : '150px';
        const gridCols = `140px repeat(${totalSlots}, minmax(${minColWidth}, 1fr))`;
        
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
            headerRow.appendChild(th);
        }
        this.grid.appendChild(headerRow);

        // Render Day Rows
        this.options.days.forEach(day => {
            const dayEvents = this.data.filter(e => e.day === day);
            const tracks = this.assignEventsToTracks(dayEvents);
            const totalTracks = tracks.length;

            const dayRow = document.createElement('div');
            dayRow.className = 'schedule-day-row';
            dayRow.setAttribute('role', 'row');
            dayRow.style.display = 'grid';
            dayRow.style.gridTemplateColumns = gridCols;
            dayRow.style.gap = '1px';

            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.textContent = day;
            dayLabel.setAttribute('role', 'rowheader');
            dayLabel.style.gridRow = `span ${totalTracks}`;
            dayRow.appendChild(dayLabel);

            // Render each track layout row
            tracks.forEach((trackEvents, trackIdx) => {
                let rowTracker = new Array(totalSlots).fill(null);

                // Map trackEvents into tracker
                trackEvents.forEach(entry => {
                    const timeToIndex = (t) => {
                        const [hrs, mins] = t.split(':').map(Number);
                        return Math.floor(((hrs - this.options.startTime) * 60 + mins) / interval);
                    };
                    const startIdx = timeToIndex(entry.start);
                    const endIdx = timeToIndex(entry.end);
                    
                    if (startIdx >= 0 && startIdx < totalSlots) {
                        rowTracker[startIdx] = {
                            title: entry.title,
                            subtitle: entry.subtitle || '',
                            span: endIdx - startIdx,
                            color: this.stringToColor(entry.title),
                            originalData: entry
                        };
                        for (let j = startIdx + 1; j < endIdx; j++) {
                            if (j < totalSlots) rowTracker[j] = "OCCUPIED";
                        }
                    }
                });

                // Append slot cells to row
                rowTracker.forEach((slot, slotIdx) => {
                    if (slot === "OCCUPIED") return;
                    
                    if (slot && typeof slot === 'object') {
                        const baseColor = slot.color;
                        const hslParts = baseColor.match(/\d+/g);
                        const lightTone = `hsl(${hslParts[0]}, ${hslParts[1]}%, 92%)`;
                        const darkTone = `hsl(${hslParts[0]}, ${hslParts[1]}%, 25%)`;

                        const bookedSlot = document.createElement('div');
                        bookedSlot.className = 'slot booked';
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
                    } else {
                        const emptySlot = document.createElement('div');
                        emptySlot.className = 'slot empty';
                        emptySlot.setAttribute('role', 'gridcell');
                        dayRow.appendChild(emptySlot);
                    }
                });
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