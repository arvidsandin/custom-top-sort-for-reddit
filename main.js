if(sessionStorage.getItem('filterNumber') == null || sessionStorage.getItem('filterTimespan') == null){
  resetSelection();
}

const url = window.location.href;
var reddit;
var scrolling = false;
if (/^(http:\/\/|https:\/\/)?old+([\-\.]reddit+)\.com(\/.*)?(\/top)(\/.*)?$/.test(url)) {
  reddit = new Old();
}
else if (/^(http:\/\/|https:\/\/)?new+([\-\.]reddit+)\.com(\/.*)?(\/top)(\/.*)?$/.test(url)) {
  reddit = new New();

  //scroll event throttling
  document.addEventListener('scroll', function() {
    scrolling = true;
  }, {passive: true});
  setInterval(() => {
    if (scrolling) {
      scrolling = false;
      reddit.enforceSelectedSorting();
    }
  },1000);
}


reddit.enforceSelectedSorting();
window.addEventListener('load', (event) => {
  reddit.enforceSelectedSorting();
});

// functions
function hoursToMilliseconds(hours){
  return hours*1000*60*60;
}
function daysToMilliseconds(days){
  return days*1000*60*60*24;
}
function weeksToMilliseconds(weeks){
  return weeks*1000*60*60*24*7;
}
function monthsToMilliseconds(months){
  return months*1000*60*60*24*30;
}
function yearsToMilliseconds(years){
  return years*1000*60*60*24*365;
}

function resetSelection(){
  sessionStorage.setItem('filterNumber', '0');
  sessionStorage.setItem('filterTimespan', 'default');
}
