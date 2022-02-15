if(sessionStorage.getItem('filterNumber') == null || sessionStorage.getItem('filterTimespan') == null){
  resetSelection();
}

var reddit;
var isScrolling = false;
const defaultSortings = [
  {filterNumber: 1, filterWord: 'hours'},
  {filterNumber: 1, filterWord: 'days'},
  {filterNumber: 1, filterWord: 'weeks'},
  {filterNumber: 1, filterWord: 'months'},
  {filterNumber: 1, filterWord: 'years'},
  {filterNumber: 1, filterWord: 'all'}
];
var sortings = defaultSortings;
(chrome ? chrome : browser).storage.local.get('sortings', function(result) {
  if (result) {
    sortings = result.sortings || defaultSortings;
  }
  filterPosts();
});

function filterPosts(){
  try {
    if (isUsingOldReddit()) {
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
  } catch (e) {
    console.warn(e.message);
    return ;
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

function isUsingOldReddit() {
  const url = window.location.href;
  // URL is new.reddit.com/*/top
  var newRedditURL = /^(http:\/\/|https:\/\/)?new+([\-\.]reddit+)\.com(\/.*)?(\/top)(\/.*)?$/.test(url)
  if (newRedditURL) {
    return false;
  }
  // URL is old.reddit.com/*/top
  var oldRedditURL = /^(http:\/\/|https:\/\/)?old+([\-\.]reddit+)\.com(\/.*)?(\/top)(\/.*)?$/.test(url)
  if (oldRedditURL) {
    return true;
  }
  // URL is www.reddit.com/*/top
  var wwwRedditURL = /^(http:\/\/|https:\/\/)?www+([\-\.]reddit+)\.com(\/.*)?(\/top)(\/.*)?$/.test(url)
  if (wwwRedditURL) {
    return isUsingOldRedditOnWWW();
  }
  //If visiting incompatible site such as i.reddit.com or not sorting by top
  throw new Error("Custom top sort unavailable: Incompatible URL");
}

function isUsingOldRedditOnWWW() {
  //Works when HttpOnly is false
  const hasRedesignCookie = document.cookie.split(';').some((item) => item.includes('redesign_optout=true'))
  //Final fallback: check for element that only exists in old reddit
  const hasElementUniqueToOldReddit = document.getElementById("header-img");

  return hasRedesignCookie || hasElementUniqueToOldReddit
}
