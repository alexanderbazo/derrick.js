# Derrick.js

derrick.js is a simple Javascript library to define and detect custom [time framed] event chains. Derrick uses a simple syntax to define event patterns and to add listeners to them. Triggered events are automatically processed. When Derrick detects a predefined pattern, registerd listeners are envoked. More pattern constraints will be added soon.  Try it [here](http://derrick.regensburger-forscher.de/).

## Usage
Include the library file
```html
<script src="derrick.js"></script>
```
	
Start Derrick and point to the webworker script
```javascript
Derrick.start('/js/src/derrick_worker.js');
```

Add a event pattern (id, pattern, callback, [timeframe in ms])
```javascript
Derrick.addPatternListener('rgb-sequence', ['red', 'green', 'blue'], function (event) {
	alert("Pattern detected: " + event.pattern);
}, 1000);
```
        
Trigger events
```javascript
Derrick.trigger('red');
```
	
Link Derrick with dom events    
```javascript
document.querySelector('#buttons .green').addTriggerLink('click', 'green');
document.querySelectorAll('#buttons .box').addTriggerLink('click', 'box');
```
