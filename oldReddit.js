class Old {
  constructor(listOfSortings) {
    //for reddit enhancement suite
    window.addEventListener("neverEndingLoad", function() {
      this.enforceSelectedSorting();
    });

    var dropDown = document.getElementsByClassName('drop-choices lightdrop')[0];
    dropDown.innerHTML = '';
    for (var sorting of listOfSortings) {
      dropDown.innerHTML += this.generateSortingHTML(sorting.filterNumber, sorting.filterWord);
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

  generateSortingHTML(filterNumber, filterWord){
    var url = window.location.href;
    var indexOfSignificantURLContent = url.search('/top/') + 5;
    url = url.substring(0, indexOfSignificantURLContent);
    var html = `<form method="POST" action="` + url +`">
        <input type="hidden" name="t" value="`;
    if (filterWord == "all") {
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
    html += `">
      <a href="` + url + `" class="choice" onclick="sessionStorage.setItem('filterNumber', '` + filterNumber.toString() + `');sessionStorage.setItem('filterTimespan', '`
      + filterWord + `');$(this).parent().submit(); return false;">`;
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
    html += `</a></form>`
    return html;
  }

  changeTextOfSelectedSorting(newText){
    var selectedSorting = document.getElementsByClassName('dropdown lightdrop')[0];
    selectedSorting.firstChild.innerHTML = newText;
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
