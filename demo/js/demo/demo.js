(function () {
    'use strict';
    /*global Derrick, alert*/
    var Demo = {};
    Demo.start = function () {
        Derrick.start('/js/src/derrick_worker.js');
        Derrick.addPatternListener('rgb-sequence', ['red', 'green', 'blue'], function (event) {
            alert("Pattern detected: " + event.pattern);
        }, 1000);


        // Derrick.removePatternListener('rgb-sequence');

        document.querySelector('#buttons .red').addTriggerLink('click', 'red');
        document.querySelector('#buttons .green').addTriggerLink('click', 'green');
        document.querySelector('#buttons .blue').addTriggerLink('click', 'blue');
        document.querySelectorAll('#buttons .box').addTriggerLink('click', 'box');
    };

    window.Demo = Demo;

}());