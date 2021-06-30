var defaultSortings = [
  {filterNumber: 1, filterWord: 'hours'},
  {filterNumber: 1, filterWord: 'days'},
  {filterNumber: 1, filterWord: 'weeks'},
  {filterNumber: 1, filterWord: 'months'},
  {filterNumber: 1, filterWord: 'years'},
  {filterNumber: 1, filterWord: 'all'}
];
var sortings = defaultSortings;

(chrome ? chrome : browser).storage.local.get('sortings', function(result){
  if (result) {
    sortings = result.sortings || defaultSortings;
  }
  for (var sorting of sortings) {
    appendOption(sorting.filterNumber, sorting.filterWord);
  }
});


document.getElementById('add_sorting').addEventListener('click', () =>{
  appendOption(1, 'hour');
});
document.getElementById('saveButton').addEventListener('click', () =>{
  sortings = [];
  for (var row of document.getElementById('grid_container').childNodes) {
    sortings.push({
      filterNumber: row.childNodes[0].value,
      filterWord: row.childNodes[1].value.toLowerCase()
    });
  }
  (chrome ? chrome : browser).storage.local.set({
    sortings: sortings
  });
});

//functions

function appendOption(filterNumber, filterWord){
  var gridContainer = document.getElementById('grid_container');
  var row = document.createElement("div");
  row.setAttribute("class", "grid");
  row.appendChild(makeNumberInputField(filterNumber));
  row.appendChild(makedropdownList(filterWord));
  row.appendChild(makeRemoveButton());
  gridContainer.appendChild(row);
}

function makeNumberInputField(defaultValue){
  var inputField = document.createElement("input");
  inputField.setAttribute("type", "number");
  inputField.setAttribute("min", "1");
  inputField.setAttribute("max", "1000");
  inputField.setAttribute("value", defaultValue.toString());
  return inputField;
}

function makedropdownList(defaultValue){
  var dropDown = document.createElement("select");
  for (var timeSpan of ["Hours", "Days", "Weeks", "Months", "Years", "All"]) {
    var option = document.createElement("option");
    option.setAttribute("value", timeSpan.toLowerCase());
    option.appendChild(document.createTextNode(timeSpan));
    if (timeSpan.toLowerCase() == defaultValue) {
      option.setAttribute("selected", "selected");
    }
    dropDown.appendChild(option);
  }
  return dropDown;
}

function makeRemoveButton(){
  var button = document.createElement("img");
  button.setAttribute("src", "trash.svg");
  button.setAttribute("class", "remove_sorting");
  button.addEventListener('click', () =>{
    button.parentNode.remove();
  });
  return button;
}
