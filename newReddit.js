class New {
  constructor() {
    var listButton = document.getElementsByClassName('_29FQ-HlVE3aNu0iB8mO-ey GzkzdrqG-NjAYH7eKJan4')[0];
    listButton.addEventListener('click', function() {
      setTimeout(function () {
        var dropDown = document.getElementsByClassName('_2uYY-KeuYHKiwl-9aF0UiL Sgi9lgQUrox4tW9Q75iif')[0];
        dropDown.innerHTML = `
          <a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G" role="menuitem" href="/r/memes/top/?t=hour" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');">
            <span class="_2-cXnP74241WI7fpcpfPmg">
              Now
            </span>
          </a>
        `
        //_1IKtbRloF_LV1hPqMzP3MC _1yVJwSS9tASrkJ6R6wvXpT Seems to be for the selected one
        dropDown.innerHTML += `
          <a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G" role="menuitem" href="/r/memes/top/?t=day" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');">
            <span class="_2-cXnP74241WI7fpcpfPmg">
              Today
            </span>
          </a>
        `
        dropDown.innerHTML += `
          <a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G " role="menuitem" href="/r/memes/top/?t=week" onclick="sessionStorage.setItem('filterNumber', '2');sessionStorage.setItem('filterTimespan', 'days');">
            <span class="_2-cXnP74241WI7fpcpfPmg">
              Last 2 days
            </span>
          </a>
        `
        dropDown.innerHTML += `
          <a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G" role="menuitem" href="/r/memes/top/?t=week" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');">
            <span class="_2-cXnP74241WI7fpcpfPmg">
              This Week
            </span>
          </a>
        `
        dropDown.innerHTML += `
          <a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G" role="menuitem" href="/r/memes/top/?t=month" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');">
            <span class="_2-cXnP74241WI7fpcpfPmg">
              This Month
            </span>
          </a>
        `
        dropDown.innerHTML += `
          <a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G" role="menuitem" href="/r/memes/top/?t=year" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');">
            <span class="_2-cXnP74241WI7fpcpfPmg">
              This Year
            </span>
          </a>
        `
        dropDown.innerHTML += `
          <a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G" role="menuitem" href="/r/memes/top/?t=all" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');">
            <span class="_2-cXnP74241WI7fpcpfPmg">
              All Time
            </span>
          </a>
        `
      }, 200);
    });
  }

  enforceSelectedSorting(){
    var filterNumber = parseInt(sessionStorage.getItem('filterNumber'));
    var filterTimespan = sessionStorage.getItem('filterTimespan');
    this.removePostsOlderThan(filterNumber, filterTimespan);
    switch(filterTimespan){
      case 'years':
        break;
      case 'months':
        this.removePostsOlderThan(0, 'years');
        break;
      case 'weeks':
      this.removePostsOlderThan(0, 'years');
      this.removePostsOlderThan(0, 'months');
        break;
      case 'days':
        this.removePostsOlderThan(0, 'years');
        this.removePostsOlderThan(0, 'months');
        break;
      case 'hours':
        this.removePostsOlderThan(0, 'years');
        this.removePostsOlderThan(0, 'months');
        this.removePostsOlderThan(0, 'days');
        break;
      default:
        break;
    }
    if (filterNumber != 0 && filterTimespan != 'default') {
      this.changeTextOfSelectedSorting('last ' + filterNumber + ' ' + filterTimespan);
    }
  }

  changeTextOfSelectedSorting(newText){
    var selectedSorting = document.getElementsByClassName('_2-cXnP74241WI7fpcpfPmg');
    for (var i = 0; i < selectedSorting.length; i++) {
      selectedSorting[i].innerHTML = newText;
    }
  }

  removePostsOlderThan(filterNumber, filterWord){
    var posts = document.getElementsByClassName('Post');
    for (var i = posts.length-1; i >= 0; i--) {
      var time = posts[i].getElementsByClassName('_3jOxDPIQ0KaOWpzvSQo-1s')[0]
      time = time.innerHTML;
      var words = time.split(' ');
      var postNumber = parseInt(words[0]);
      var postWord = words[1];
      if (postNumber > filterNumber &&
        (this.stringMatches(postWord, filterWord) ||
        this.stringMatches(postWord, filterWord.substring(0, filterWord.length - 1))))
        {
        posts[i].remove();
        }
    }
  }

  stringMatches(a, b) {
    return typeof a === 'string' && typeof b === 'string'
    ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
    : a === b;
  }
}
