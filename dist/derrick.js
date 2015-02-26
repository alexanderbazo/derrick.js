(function () {
    var derrick = {};
    window.Derrick = derrick;
})();

(function () {
    const PATTERN_DETECTED = 'PATTERN_DETECTED';
    
    var worker,
        listeners = [],
        
        _init = function() {
            Element.prototype.addTriggerLink = function(event, trigger) {
                _addTriggerLink(this, event, trigger);
            };
            NodeList.prototype.addTriggerLink = function(event, trigger) {
                for(var i = 0; i < this.length; i++) {
                    _addTriggerLink(this[i], event, trigger);
                }
            };
        },

        start = function (workerScript) {
            var pathName = window.location.pathname,
                path = pathName.substr(0, pathName.lastIndexOf("/"));
            worker = new Worker(path + workerScript);
            worker.addEventListener('message', _onWorkerMessage);
            worker.postMessage({
                cmd: 'start'
            });
        },

        triggerEvent = function (id) {
            worker.postMessage({
                cmd: 'addEvent',
                event: {
                    id: id,
                    at: new Date().getTime()
                }
            });
        },
        
        // Here be dragons!
        _addTriggerLink = function(context, event, trigger) {
            context.addEventListener(event, function() {
                triggerEvent(trigger);
            });
        },

        addPatternListener = function (id, pattern, callback, frame) {
            worker.postMessage({
                cmd: 'addPattern',
                pattern: {
                    id: id,
                    events: pattern,
                    frame: (typeof frame === 'undefined') ? -1 : frame
                }
            });
            listeners[id] = callback;
        },
        
         _onWorkerMessage = function (event) {
            var data = event.data;
            switch(data.type) {
                case PATTERN_DETECTED:
                    listeners[data.id]({pattern: data.id});
                    break;
                default:
                    break;
            };
        };

    Derrick.start = start;
    Derrick.trigger = triggerEvent;
    Derrick.addPatternListener = addPatternListener;
    _init();
})();