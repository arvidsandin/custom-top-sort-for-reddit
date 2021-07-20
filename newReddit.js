class New {
  constructor(listOfSortings) {
    const parent = this;
    var customize = document.createElement('a');
    customize.innerText = "customize";
    customize.href = "javascript:void(0)";
    customize.classList = "_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G";
    customize.addEventListener('click', (event) =>{
      event.preventDefault();
      (chrome ? chrome : browser).runtime.sendMessage({"action": "openOptionsPage"});
    });


    var listButton = document.getElementsByClassName('_29FQ-HlVE3aNu0iB8mO-ey GzkzdrqG-NjAYH7eKJan4')[0];
    listButton.addEventListener('click', function() {
      setTimeout(function () {
        var dropDown = document.getElementsByClassName('_2uYY-KeuYHKiwl-9aF0UiL Sgi9lgQUrox4tW9Q75iif')[0];
        dropDown.innerHTML = '';
        for (var sorting of listOfSortings) {
          dropDown.appendChild(parent.generateSortingLink(sorting.filterNumber, sorting.filterWord));
        }
        dropDown.appendChild(customize);
      }, 200);
      setTimeout(function () {
        var dropDown = document.getElementsByClassName('_2uYY-KeuYHKiwl-9aF0UiL Sgi9lgQUrox4tW9Q75iif')[0];
        dropDown.innerHTML = '';
        for (var sorting of listOfSortings) {
          dropDown.appendChild(parent.generateSortingLink(sorting.filterNumber, sorting.filterWord));
        }
        dropDown.appendChild(customize);
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
        this.removePostsOlderThan(filterNumber*7, 'days');
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

  generateSortingLink(filterNumber, filterWord){
    var element = document.createElement('a');
    element.classList.add('_39Glgtoolpdt4PIzcnjPSW', '_3LwUIE7yX7CZQKmD2L87vf', '_3LjUrsRA9MkUFLGB6ZCWaX', '_1oYEKCssGFjqxQ9jJMNj5G');
    element.setAttribute('role', 'menuitem');

    var url = window.location.href;
    var indexOfSignificantURLContent = url.search('/top/') + 5;
    url = url.substring(0, indexOfSignificantURLContent);
    url += '?t=';
    if (filterWord == 'all') {
      url += filterWord;
    }
    else if (filterNumber == 1) {
      url += filterWord.substring(0, filterWord.length - 1);
    }
    else {
      var times = ['hours', 'days', 'weeks', 'months', 'years', 'alls'];
      var index = times.indexOf(filterWord);
      var nextSorting = times[index + 1];
      url += nextSorting.substring(0, nextSorting.length -1);
    }

    element.setAttribute('href', url);
    element.addEventListener('click', ()=>{
      sessionStorage.setItem('filterNumber', filterNumber);
      sessionStorage.setItem('filterTimespan', filterWord);
    })

    var text = document.createElement('span');
    text.classList.add('_2-cXnP74241WI7fpcpfPmg');
    if (filterWord == "all") {
      text.innerText = filterWord;
    }
    else if (filterNumber != 1) {
      text.innerText = 'last ';
      text.innerText += filterNumber + ' ';
      text.innerText += filterWord;
    }
    else {
      text.innerText = 'last ';
      text.innerText += filterWord.substring(0, filterWord.length -1);
    }

    element.appendChild(text);
    return element;
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
