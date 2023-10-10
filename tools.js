// https://stackoverflow.com/questions/51409162/how-can-i-emulate-the-jquery-selector-in-pure-javascript
var $ = function(selector) {
    return document.querySelector(selector);
};