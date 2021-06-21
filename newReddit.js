class New {
  constructor(listOfSortings) {
    var html = '';
    for (var sorting of listOfSortings) {
      html += this.generateSortingHTML(sorting.filterNumber, sorting.filterWord);
    }

    var listButton = document.getElementsByClassName('_29FQ-HlVE3aNu0iB8mO-ey GzkzdrqG-NjAYH7eKJan4')[0];
    listButton.addEventListener('click', function() {
      setTimeout(function () {
        var dropDown = document.getElementsByClassName('_2uYY-KeuYHKiwl-9aF0UiL Sgi9lgQUrox4tW9Q75iif')[0];
        dropDown.innerHTML = html;
      }, 200);
      setTimeout(function () {
        var dropDown = document.getElementsByClassName('_2uYY-KeuYHKiwl-9aF0UiL Sgi9lgQUrox4tW9Q75iif')[0];
        dropDown.innerHTML = html;
      }, 1000);
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

  generateSortingHTML(filterNumber, filterWord){
    var url = window.location.href;
    var indexOfSignificantURLContent = url.search('/top/') + 5;
    url = url.substring(0, indexOfSignificantURLContent);
    var html = `<a class="_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G" role="menuitem" href="`
      + url + '?t=';
    if (filterWord == 'all') {
      html += filterWord;
    }
    else if (filterNumber == 1) {
      html += filterWord.substring(0, filterWord.length - 1);
    }
    else {
      var times = ['hours', 'days', 'weeks', 'months', 'years', 'alls'];
      var index = times.indexOf(filterWord);
      var nextSorting = times[index + 1];
      html += nextSorting.substring(0, nextSorting.length -1);
    }
    html += `" onclick="sessionStorage.setItem('filterNumber', '` + filterNumber
    + `');sessionStorage.setItem('filterTimespan', '` + filterWord
    + `');">
    <span class="_2-cXnP74241WI7fpcpfPmg">`;
    if (filterWord == "all") {
      html += filterWord;
    }
    else if (filterNumber != 1) {
      html += 'last ';
      html += filterNumber.toString() + ' ';
      html += filterWord;
    }
    else {
      html += 'last ';
      html += filterWord.substring(0, filterWord.length -1);
    }
    html += `</span></a>`
    return html;
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
      var time = posts[i].getElementsByClassName('_3jOxDPIQ0KaOWpzvSQo-1s')[0];
      if (time == undefined) {
        return;
      }
      time = time.innerHTML;
      var words = time.split(' ');
      var postNumber = parseInt(words[0]);
      var postWord = words[1];
      if (postNumber >= filterNumber &&
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
