(function () {
    'use strict';
    /*global self*/

    var MAX_BUS_LENGTH = 1000,
        PATTERN_DETECTED = 'PATTERN_DETECTED',
        bus = [],
        patterns = [],
        connections = 0,

        pack = function () {
            if (bus.length > MAX_BUS_LENGTH) {
                bus.shift();
            }
        },

        lastIndexOf = function (id, offset) {
            var i,
                start = offset - 1,
                event = null;
            
            for (i = start; i >= 0; i -= 1) {
                event = bus[i];
                if (event.id === id) {
                    return i;
                }
            }
            return -1;
        },

        scanForPatter = function (pattern) {
            var i,
                indices = [],
                events = pattern.events,
                lastIndex = -1,
                currentIndex = 0,
                frame = -1,
                inFrame;

            if (bus.length < events.length) {
                return;
            }
            
            if (bus[bus.length - 1].id !== events[events.length - 1]) {
                return;
            }


            lastIndex = bus.length - 1;
            indices.push(lastIndex);

            for (i = events.length - 2; i >= 0; i -= 1) {
                currentIndex = lastIndexOf(events[i], lastIndex);
                if (currentIndex === -1) {
                    return;
                } else {
                    indices.push(currentIndex);
                    lastIndex = currentIndex;
                }
            }

            //Add to loop for better performance ?
            frame = bus[indices[0]].at - bus[indices[indices.length - 1]].at;
            inFrame = frame <= pattern.frame ||  pattern.frame === -1;
            if (inFrame) {
                self.postMessage({
                    type: PATTERN_DETECTED,
                    id: pattern.id
                });
            }
        },

        scan = function () {
            patterns.forEach(scanForPatter);
        },

        addEvent = function (event) {
            bus.push(event);
            pack();
            scan();
        },

        addPattern = function (pattern) {
            patterns.push(pattern);
        },

        removePattern = function (pattern) {
            var i;
            for (i = 0; i < patterns.length; i += 1) {
                if (patterns[i].id === pattern.id) {
                    patterns.splice(i, 1);
                    return;
                }
            }
        },

        flush = function () {
            bus = [];
        },

        clear = function () {
            patterns = [];
        };

    self.addEventListener('message', function (event) {
        var data = event.data;
        switch (data.cmd) {
        case 'start':
            break;
        case 'flush':
            flush();
            break;
        case 'clear':
            clear();
            break;
        case 'addEvent':
            addEvent(data.event);
            break;
        case 'addPattern':
            addPattern(data.pattern);
            break;
        case 'removePattern':
            removePattern(data.pattern);
            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
        }
    }, false);
}());