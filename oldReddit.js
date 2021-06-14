class Old {
  constructor() {
    //for reddit enhancement suite
    window.addEventListener("neverEndingLoad", function() {
      this.enforceSelectedSorting();
    });

    var dropDown = document.getElementsByClassName('drop-choices lightdrop')[0];
    dropDown.innerHTML = `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="hour">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');$(this).parent().submit(); return false;">
            last hour
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="day">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');$(this).parent().submit(); return false;">
            last day
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="week">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '2');sessionStorage.setItem('filterTimespan', 'days');$(this).parent().submit(); return false;">
            last 2 days
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="week">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');$(this).parent().submit(); return false;">
            last week
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="month">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '2');sessionStorage.setItem('filterTimespan', 'weeks');$(this).parent().submit(); return false;">
            last 2 weeks
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="month">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');$(this).parent().submit(); return false;">
            last month
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="year">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '3');sessionStorage.setItem('filterTimespan', 'months');$(this).parent().submit(); return false;">
            last 3 months
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="year">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');$(this).parent().submit(); return false;">
            last year
        </a>
      </form>
    `
    dropDown.innerHTML += `
      <form method="POST" action="https://old.reddit.com/top/">
        <input type="hidden" name="t" value="all">
          <a href="https://old.reddit.com/top/" class="choice" onclick="sessionStorage.setItem('filterNumber', '0');sessionStorage.setItem('filterTimespan', 'default');$(this).parent().submit(); return false;">
            all
        </a>
      </form>
    `
  }

  enforceSelectedSorting(){
    var filterNumber = parseInt(sessionStorage.getItem('filterNumber'));
    var filterTimespan = sessionStorage.getItem('filterTimespan');
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
      this.changeTextOfSelectedSorting('last ' + filterNumber + ' ' + filterTimespan);
    }
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
