/* ChronosGrid.js v1.2.3 - Hierarchical Text Support */

(function ($) {
    $.fn.schedule = function (data, options) {
        const $root = this;
        const settings = $.extend({
            startTime: 6,
            endTime: 18,
            interval: 30,
            zoom: true,
            timeFormat: '24h',
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            theme: sessionStorage.getItem('schedule-theme') || 'light'
        }, options);

        let currentFormat = settings.timeFormat;
        let currentInterval = settings.interval;

        const applyTheme = (theme) => {
            const isDark = theme === 'dark';
            $root.toggleClass('theme-dark', isDark);
            $('body').toggleClass('theme-dark', isDark);
            sessionStorage.setItem('schedule-theme', theme);
            const icon = isDark ? '☀️' : '🌙';
            $root.find('.theme-toggle-btn').html(`${icon} <span>${isDark ? 'Light' : 'Dark'} Mode</span>`);
        };

        const stringToColor = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
            return `hsl(${Math.abs(hash % 360)}, 60%, 45%)`;
        };

        const renderGrid = (interval) => {
            currentInterval = interval;
            const totalMinutes = (settings.endTime - settings.startTime) * 60;
            const totalSlots = totalMinutes / interval;
            const $grid = $root.find('.schedule-grid').empty();
            const minColWidth = interval < 30 ? '100px' : '150px';
            $grid.css('grid-template-columns', `140px repeat(${totalSlots}, minmax(${minColWidth}, 1fr))`);

            $grid.append('<div class="time-header">Time</div>');
            for (let i = 0; i < totalSlots; i++) {
                const totalMins = i * interval;
                const h = Math.floor(totalMins / 60) + settings.startTime;
                const m = totalMins % 60;
                let timeStr = (currentFormat === '24h') ?
                    `${h}:${m === 0 ? '00' : (m < 10 ? '0' + m : m)}` :
                    `${h % 12 || 12}:${m === 0 ? '00' : (m < 10 ? '0' + m : m)} ${h >= 12 ? 'PM' : 'AM'}`;
                $grid.append(`<div class="time-header">${timeStr}</div>`);
            }

            settings.days.forEach(day => {
                $grid.append(`<div class="day-label">${day}</div>`);
                let rowTracker = new Array(totalSlots).fill(null);

                data.filter(e => e.day === day).forEach(entry => {
                    const timeToIndex = (t) => {
                        const [hrs, mins] = t.split(':').map(Number);
                        return Math.floor(((hrs - settings.startTime) * 60 + mins) / interval);
                    };
                    const startIdx = timeToIndex(entry.start);
                    const endIdx = timeToIndex(entry.end);
                    if (startIdx >= 0 && startIdx < totalSlots) {
                        rowTracker[startIdx] = {
                            title: entry.title,
                            subtitle: entry.subtitle || '', // Support for subtitle
                            span: endIdx - startIdx,
                            color: stringToColor(entry.title)
                        };
                        for (let j = startIdx + 1; j < endIdx; j++) if (j < totalSlots) rowTracker[j] = "OCCUPIED";
                    }
                });

                rowTracker.forEach(slot => {
                    if (slot === "OCCUPIED") return;
                    if (slot && typeof slot === 'object') {
                        const baseColor = slot.color;
                        const hslParts = baseColor.match(/\d+/g);
                        const lightTone = `hsl(${hslParts[0]}, ${hslParts[1]}%, 92%)`;
                        const darkTone = `hsl(${hslParts[0]}, ${hslParts[1]}%, 25%)`;

                        // UPDATED: Added slot-content wrapper with title and subtitle
                        const $bookedSlot = $(`
                            <div class="slot booked">
                                <div class="slot-text-container">
                                    <div class="slot-title">${slot.title}</div>
                                    ${slot.subtitle ? `<div class="slot-subtitle">${slot.subtitle}</div>` : ''}
                                </div>
                            </div>
                        `);

                        $bookedSlot.css({
                            'grid-column': `span ${slot.span}`,
                            '--accent-color': baseColor,
                            '--bg-color-light': lightTone,
                            '--bg-color-dark': darkTone
                        });
                        $grid.append($bookedSlot);
                    } else {
                        $grid.append(`<div class="slot empty"></div>`);
                    }
                });
            });
        };

        return this.each(function () {
            $root.addClass('schedule-container-main').empty();
            const $toolbar = $('<div class="schedule-controls"></div>');

            if (settings.zoom) {
                const $zoomGroup = $('<div class="zoom-group" style="display:flex; gap:5px;"></div>');
                [30, 15].forEach(val => {
                    const $btn = $(`<button class="schedule-btn ${val === currentInterval ? 'active' : ''}">${val} Min</button>`);
                    $btn.on('click', function () {
                        $zoomGroup.find('.schedule-btn').removeClass('active');
                        $(this).addClass('active');
                        renderGrid(val);
                    });
                    $zoomGroup.append($btn);
                });
                $toolbar.append('<span>Zoom: </span>', $zoomGroup);
            }

            const $formatBtn = $(`<button class="schedule-btn">Format: ${currentFormat.toUpperCase()}</button>`).on('click', function () {
                currentFormat = (currentFormat === '24h') ? '12h' : '24h';
                $(this).text(`Format: ${currentFormat.toUpperCase()}`);
                renderGrid(currentInterval);
            });
            $toolbar.append($formatBtn);

            const $themeBtn = $('<button class="schedule-btn theme-toggle-btn" style="margin-left: auto;"></button>').on('click', function () {
                const newTheme = $root.hasClass('theme-dark') ? 'light' : 'dark';
                applyTheme(newTheme);
            });
            $toolbar.append($themeBtn);

            $root.append($toolbar, '<div class="calendar-wrapper"><div class="schedule-grid"></div></div>');
            applyTheme(settings.theme);
            renderGrid(settings.interval);
        });
    };
})(jQuery);