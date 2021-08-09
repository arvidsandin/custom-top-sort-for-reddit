class Old {
  constructor(listOfSortings) {
    //for reddit enhancement suite
    window.addEventListener("neverEndingLoad", function() {
      this.enforceSelectedSorting();
    });

    var dropDown = document.getElementsByClassName('drop-choices lightdrop')[0];
    dropDown.innerHTML = '';
    for (var sorting of listOfSortings) {
      dropDown.appendChild(this.generateSortingLink(sorting.filterNumber, sorting.filterWord));
    }

    var customize = document.createElement('a');
    customize.innerText = "customize";
    customize.href = "javascript:void(0)";
    customize.classList = "choice";
    customize.addEventListener('click', (event) =>{
      event.preventDefault();
      (chrome ? chrome : browser).runtime.sendMessage({"action": "openOptionsPage"});
    });
    dropDown.appendChild(customize);
  }

  enforceSelectedSorting(){
    var filterNumber = parseInt(sessionStorage.getItem('filterNumber'));
    var filterTimespan = sessionStorage.getItem('filterTimespan');
    if (filterNumber == 1) {
      return;
    }
    switch(filterTimespan){
      case 'hours':
        this.removePostsOlderThan(hoursToMilliseconds(filterNumber));
        break;
      case 'days':
        this.removePostsOlderThan(daysToMilliseconds(filterNumber));
        break;
      case 'weeks':
        this.removePostsOlderThan(weeksToMilliseconds(filterNumber));
        break;
      case 'months':
        this.removePostsOlderThan(monthsToMilliseconds(filterNumber));
        break;
      case 'years':
        this.removePostsOlderThan(yearsToMilliseconds(filterNumber));
        break;
      default:
        break;
    }
    if (filterNumber != 0 && filterTimespan != 'default') {
      this.changeTextOfSelectedSorting('last ' + filterNumber.toString() + ' ' + filterTimespan);
    }
  }

  generateSortingLink(filterNumber, filterWord){
    var url = window.location.href + '/';
    var indexOfSignificantURLContent = url.search('/top/') + 5;
    url = url.substring(0, indexOfSignificantURLContent);
    var element = document.createElement('form');
    element.setAttribute('method', 'POST');
    element.setAttribute('action', url);
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 't');
    var defaultSortingToUse;
    var filterWordtoMilliseconds;
    switch (filterWord) {
      case 'all':
        filterWordtoMilliseconds = function (number) {return Infinity;};
        break;
      case 'hours':
        filterWordtoMilliseconds = hoursToMilliseconds;
        break;
      case 'days':
        filterWordtoMilliseconds = daysToMilliseconds;
        break;
      case 'weeks':
        filterWordtoMilliseconds = weeksToMilliseconds;
        break;
      case 'months':
        filterWordtoMilliseconds = monthsToMilliseconds;
        break;
      case 'years':
        filterWordtoMilliseconds = yearsToMilliseconds;
        break;
    }
    if (filterWordtoMilliseconds(filterNumber) > yearsToMilliseconds(1)) {
      defaultSortingToUse = 'all';
    }
    else if (filterWordtoMilliseconds(filterNumber) > monthsToMilliseconds(1)) {
      defaultSortingToUse = 'year';
    }
    else if (filterWordtoMilliseconds(filterNumber) > weeksToMilliseconds(1)) {
      defaultSortingToUse = 'month';
    }
    else if (filterWordtoMilliseconds(filterNumber) > daysToMilliseconds(1)) {
      defaultSortingToUse = 'week';
    }
    else if (filterWordtoMilliseconds(filterNumber) > hoursToMilliseconds(1)) {
      defaultSortingToUse = 'day';
    }
    else {
      defaultSortingToUse = 'hour';
    }
    input.setAttribute('value', defaultSortingToUse);
    var link = document.createElement('a');
    link.classList = 'choice';
    link.setAttribute('onclick', `sessionStorage.setItem('filterNumber', '${filterNumber.toString()}');sessionStorage.setItem('filterTimespan', '${filterWord}');$(this).parent().submit(); return false;`);
    if (filterWord == "all") {
      link.innerText += filterWord;
    }
    else if (filterNumber != 1) {
      link.innerText += 'last ';
      link.innerText += filterNumber.toString() + ' ';
      link.innerText += filterWord;
    }
    else {
      link.innerText += 'last ';
      link.innerText += filterWord.substring(0, filterWord.length -1);
    }
    element.appendChild(input);
    element.appendChild(link);
    return element;
  }

  changeTextOfSelectedSorting(newText){
    var selectedSorting = document.getElementsByClassName('dropdown lightdrop')[0];
    selectedSorting.firstChild.innerText = newText;
  }

  removePostsOlderThan(timeInMilliseconds){
    // get all posts
    var posts = document.getElementsByClassName('thing link');
    var time;
    var dateTime;
    const now = new Date();
    //iterate backwards to not skip elements after removing one
    for (var i = posts.length-1; i >= 0; i--) {
      time = posts[i].getElementsByTagName('time')[0];
      if (time == undefined) {
        continue;
      }
      dateTime = new Date(time.dateTime);
      if (now-dateTime > timeInMilliseconds) {
        posts[i].remove();
      }
    }
  }
}
