const MAX_BUS_LENGTH = 1000,
    PATTERN_DETECTED = 'PATTERN_DETECTED';

var bus = [],
    patterns = [],

    _addEvent = function (event) {
        bus.push(event);
        _pack();
        _scan();
    },

    _addPattern = function (pattern) {
        patterns.push(pattern);
    },

    _pack = function () {
        if(bus.length > MAX_BUS_LENGTH) {
            bus.shift();
        }
    },

    _scan = function () {
        patterns.forEach(_scanForPatter);
    },

    _scanForPatter = function (pattern) {
        var indices = [],
            events = pattern.events,
            lastIndex = -1,
            frame = -1;

        if (bus.length < events.length) {
            return;
        }
 
        if(bus[bus.length -1].id != events[events.length-1]) {
            return;
        } else {
            indices.push(bus.length-1);
            lastIndex = bus.length-1;
        }
        

        for (var i = events.length - 2; i >= 0; i--) {
            var index = _lastIndexOf(events[i], lastIndex);
            if (index == -1) {
                return;
            } else {
                indices.push(index);
                lastIndex = index;
            }
        }
        
        //Add to loop for better performance ?
        frame = bus[indices[0]].at - bus[indices[indices.length - 1]].at;
        if (frame <= pattern.frame) {
            self.postMessage({
                type: PATTERN_DETECTED,
                id: pattern.id
            });
        }
    },

    _lastIndexOf = function (id, offset) {
        var start = offset - 1,
            event = null;
        for (var i = start; i >= 0; i--) {
            event = bus[i];
            if (event.id == id) {
                return i;
            }
        }
        return -1;
    },

    _flush = function () {
        bus = [];
    },

    _clear = function () {
        patterns = [];
    };

self.addEventListener('message', function (event) {
    var data = event.data;
    switch (data.cmd) {
    case 'start':
        break;
    case 'flush':
        _flush();
        break;
    case 'clear':
        _clear();
        break;
    case 'addEvent':
        _addEvent(data.event);
        break;
    case 'addPattern':
        _addPattern(data.pattern);
        break;
    default:
        self.postMessage('Unknown command: ' + data.msg);
    };
}, false);