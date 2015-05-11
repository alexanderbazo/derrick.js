(function () {
    "use strict";
    /*eslint-env browser*/
    /*global Derrick*/
    var derrick = {};
    window.Derrick = derrick;
}());

(function () {
    "use strict";
    /*global Worker, Element, NodeList */
    var PATTERN_DETECTED = "PATTERN_DETECTED",
        worker,
        listeners = [],

        triggerEvent = function (id) {
            worker.postMessage({
                cmd: "addEvent",
                event: {
                    id: id,
                    at: new Date().getTime()
                }
            });
        },

        addTriggerLink = function (context, event, trigger) {
            context.addEventListener(event, function () {
                triggerEvent(trigger);
            });
        },

        onWorkerMessage = function (event) {
            var data = event.data;
            switch (data.type) {
            case PATTERN_DETECTED:
                listeners[data.id]({
                    pattern: data.id
                });
                break;
            default:
                break;
            }
        },

        start = function (workerScript) {
            var pathName = window.location.pathname,
                path = pathName.substr(0, pathName.lastIndexOf("/"));
            worker = new Worker(path + workerScript);
            worker.addEventListener("message", onWorkerMessage);
            worker.postMessage({
                cmd: "start"
            });
        },

        addPatternListener = function (id, pattern, callback, frame) {
            worker.postMessage({
                cmd: "addPattern",
                pattern: {
                    id: id,
                    events: pattern,
                    frame: (frame === undefined) ? -1 : frame
                }
            });
            listeners[id] = callback;
        },

        removePatternListener = function (id) {
            worker.postMessage({
                cmd: "removePattern",
                pattern: {
                    id: id
                }
            });
            delete listeners[id];
        },

        init = function () {
            var i;
            Element.prototype.addTriggerLink = function (event, trigger) {
                addTriggerLink(this, event, trigger);
            };
            NodeList.prototype.addTriggerLink = function (event, trigger) {
                for (i = 0; i < this.length; i += 1) {
                    addTriggerLink(this[i], event, trigger);
                }
            };
        };

    Derrick.start = start;
    Derrick.trigger = triggerEvent;
    Derrick.addPatternListener = addPatternListener;
    Derrick.removePatternListener = removePatternListener;
    init();
}());
