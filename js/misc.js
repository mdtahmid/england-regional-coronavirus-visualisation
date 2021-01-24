/*
Function that highlights region name using jquery marker animate
 */
function highlightText() {
  $('.marker-animation').markerAnimation({
    "color": '#e5e5e5 ',
  });
}

/*
Function puts thousand seperators in numbers
Credits: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
