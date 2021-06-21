if(sessionStorage.getItem('filterNumber') == null || sessionStorage.getItem('filterTimespan') == null){
  resetSelection();
}

const url = window.location.href;
var reddit;
var isScrolling = false;
var sortings;
var defaultSortings = [
  {filterNumber: 1, filterWord: 'hours'},
  {filterNumber: 1, filterWord: 'days'},
  {filterNumber: 2, filterWord: 'days'},
  {filterNumber: 1, filterWord: 'weeks'},
  {filterNumber: 1, filterWord: 'months'},
  {filterNumber: 1, filterWord: 'years'},
  {filterNumber: 1, filterWord: 'all'}
];
var getting = browser.storage.sync.get("sortings");
getting.then(onGot, onError);

function onGot(item){
  sortings = item || defaultSortings;
  filterPosts();
}
function onError(error){
  console.log(error);
  sortings = defaultSortings;
  filterPosts();
}

function filterPosts(){
  // URL is old.reddit.com or cookie redesign_optout is true
  if (/^(http:\/\/|https:\/\/)?old+([\-\.]reddit+)\.com(\/.*)?(\/top)(\/.*)?$/.test(url)
  || document.cookie.split(';').some((item) => item.includes('redesign_optout=true'))) {
    reddit = new Old(sortings);
  }
  else {
    reddit = new New(sortings);
    //scroll event throttling
    document.addEventListener('scroll', function() {
      isScrolling = true;
    }, {passive: true});
    setInterval(() => {
      if (isScrolling) {
        isScrolling = false;
        reddit.enforceSelectedSorting();
      }
    },1000);
  }


  reddit.enforceSelectedSorting();
  window.addEventListener('load', (event) => {
    reddit.enforceSelectedSorting();
  });
}

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
