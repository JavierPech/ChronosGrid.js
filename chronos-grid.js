(function($) {
    $.fn.schedule = function(data, options) {
        const $root = this;
        
        const settings = $.extend({
            startTime: 6,
            endTime: 18,
            interval: 30,
            zoom: true,
            timeFormat: '24h', // New default setting
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            theme: sessionStorage.getItem('schedule-theme') || 'light'
        }, options);

        let currentFormat = settings.timeFormat;

        const formatTime = (hour, minute) => {
            if (currentFormat === '24h') {
                return `${hour}:${minute === 0 ? '00' : (minute < 10 ? '0'+minute : minute)}`;
            } else {
                const suffix = hour >= 12 ? 'PM' : 'AM';
                const h12 = hour % 12 || 12;
                return `${h12}:${minute === 0 ? '00' : (minute < 10 ? '0'+minute : minute)} ${suffix}`;
            }
        };

        const applyTheme = (theme) => {
            const isDark = theme === 'dark';
            $root.toggleClass('theme-dark', isDark);
            sessionStorage.setItem('schedule-theme', theme);
            const icon = isDark ? '☀️' : '🌙';
            $root.find('.theme-toggle-btn').html(`${icon} <span>${isDark ? 'Light' : 'Dark'} Mode</span>`);
        };

        const stringToColor = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
            return `hsl(${Math.abs(hash % 360)}, 60%, 45%)`;
        };

        const renderGrid = (currentInterval) => {
            const totalMinutes = (settings.endTime - settings.startTime) * 60;
            const totalSlots = totalMinutes / currentInterval;
            const $grid = $root.find('.schedule-grid').empty();
            const minColWidth = currentInterval < 30 ? '90px' : '130px';
            $grid.css('grid-template-columns', `140px repeat(${totalSlots}, minmax(${minColWidth}, 1fr))`);

            $grid.append('<div class="time-header" style="border-left:none;">Time</div>');
            for (let i = 0; i < totalSlots; i++) {
                const totalMins = i * currentInterval;
                const h = Math.floor(totalMins / 60) + settings.startTime;
                const m = totalMins % 60;
                $grid.append(`<div class="time-header">${formatTime(h, m)}</div>`);
            }

            settings.days.forEach(day => {
                $grid.append(`<div class="day-label">${day}</div>`);
                let rowTracker = new Array(totalSlots).fill(null);
                const dayEntries = data.filter(e => e.day === day);

                dayEntries.forEach(entry => {
                    const timeToIndex = (t) => {
                        const [hrs, mins] = t.split(':').map(Number);
                        return Math.floor(((hrs - settings.startTime) * 60 + mins) / currentInterval);
                    };
                    const startIdx = timeToIndex(entry.start);
                    const endIdx = timeToIndex(entry.end);
                    if (startIdx >= 0 && startIdx < totalSlots) {
                        rowTracker[startIdx] = { title: entry.title, span: endIdx - startIdx, color: stringToColor(entry.title) };
                        for (let j = startIdx + 1; j < endIdx; j++) if (j < totalSlots) rowTracker[j] = "OCCUPIED";
                    }
                });

                rowTracker.forEach(slot => {
                    if (slot === "OCCUPIED") return;
                    if (slot && typeof slot === 'object') {
                        $grid.append(`<div class="slot booked" style="grid-column: span ${slot.span}; background-color: ${slot.color};">${slot.title}</div>`);
                    } else {
                        $grid.append(`<div class="slot empty"></div>`);
                    }
                });
            });
        };

        return this.each(function() {
            $root.addClass('schedule-container-main').empty();
            const $toolbar = $('<div class="schedule-controls"></div>');

            // Zoom Controls
            if (settings.zoom) {
                const $zoomGroup = $('<div class="zoom-group" style="display:flex; gap:5px; align-items:center;"></div>');
                [30, 15].forEach(val => {
                    const $btn = $(`<button class="schedule-btn ${val === settings.interval ? 'active' : ''}">${val} Min</button>`);
                    $btn.on('click', function() {
                        $zoomGroup.find('.schedule-btn').removeClass('active');
                        $(this).addClass('active');
                        renderGrid(val);
                    });
                    $zoomGroup.append($btn);
                });
                $toolbar.append('<span>Zoom: </span>', $zoomGroup);
            }

            // Time Format Toggle
            const $formatBtn = $(`<button class="schedule-btn">Format: ${currentFormat.toUpperCase()}</button>`).on('click', function() {
                currentFormat = currentFormat === '24h' ? '12h' : '24h';
                $(this).text(`Format: ${currentFormat.toUpperCase()}`);
                renderGrid($root.find('.zoom-group .active').text().includes('15') ? 15 : 30);
            });
            $toolbar.append($formatBtn);

            // Theme Toggle
            const $themeBtn = $('<button class="schedule-btn theme-toggle-btn" style="margin-left: auto;"></button>').on('click', function() {
                applyTheme($root.hasClass('theme-dark') ? 'light' : 'dark');
            });
            $toolbar.append($themeBtn);

            $root.append($toolbar, '<div class="calendar-wrapper"><div class="schedule-grid"></div></div>');
            applyTheme(settings.theme);
            renderGrid(settings.interval);
        });
    };
})(jQuery);