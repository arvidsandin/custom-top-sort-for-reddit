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
  try {
    for (var row of document.getElementById('row_container').childNodes) {
      sortings.push({
        filterNumber: row.childNodes[1].value,
        filterWord: row.childNodes[2].value.toLowerCase()
      });
    }
    (chrome ? chrome : browser).storage.local.set({
      sortings: sortings
    });
    animateCheckmark();
  } catch (e) {
    console.log(e);
  }
});
var hoverInformation = document.getElementById('hoverInformation')
document.getElementById('limitations').addEventListener('mouseenter', () =>{
  hoverInformation.style.visibility = 'visible';
  hoverInformation.style.opacity = '1';
});
document.getElementById('limitations').addEventListener('mouseleave', () => {
  hoverInformation.style.opacity = '0';
  setTimeout(() => {
    hoverInformation.style.visibility = 'hidden';
  }, 200);
});


//functions
function stopPropagation(event) {
  event.stopPropagation();
}

function preventDefault(event){
  event.preventDefault();
}

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
  event.preventDefault();
  var target = event.target;
  if (!target.classList.contains('row')) {
    target = event.target.parentNode;
  }
  if ((target.getBoundingClientRect().top+target.clientHeight/2) > event.clientY) {
    target.style.borderTop = 'solid black 2px';
    target.style.borderBottom = '';
  }
  else {
    target.style.borderBottom = 'solid black 2px';
    target.style.borderTop = '';
  }
}

function dragLeave(event) {
  var target = event.target;
  if (target.nodeName == '#text') {
    target = target.parentNode;
  }
  if (!target.classList.contains('row')) {
    target = target.parentNode;
  }
  target.style.borderTop = '';
  target.style.borderBottom = '';
}

function drop(event) {
  event.preventDefault();
  var origin = document.getElementById(event.dataTransfer.getData("text/plain"));
  var target = event.target;
  if (!target.classList.contains('row')) {
    target = event.target.parentNode;
  }

  target.style.borderTop = '';
  target.style.borderBottom = '';
  if ((target.getBoundingClientRect().top+target.clientHeight/2) > event.clientY) {
    target.parentNode.insertBefore(origin, target);
  }
  else {
    target.parentNode.insertBefore(origin, target.nextSibling);
  }
}

function preventDefautlDrag(element){
  element.setAttribute("draggable", "true");
  element.addEventListener('dragstart', preventDefault);
  element.addEventListener('dragstart', stopPropagation);
  element.addEventListener('dragover', preventDefault);
  element.addEventListener('dragleave', preventDefault);
}

function animateCheckmark() {
  var checkmark = document.getElementById('checkmark');
  checkmark.style.transitionDuration = "200ms";
  checkmark.style.color = "#229922";
  setTimeout(() => {
    checkmark.style.transitionDuration = "600ms";
    checkmark.style.color = "transparent";
  }, 700);
}

var id_index = 0;
function getNewUniqueID() {
  id_index++;
  return 'unique_id_' + id_index;
}

function appendOption(filterNumber, filterWord){
  var rowContainer = document.getElementById('row_container');
  var row = document.createElement("div");
  row.setAttribute("class", "row");
  row.appendChild(createDraggableArea());
  row.appendChild(createNumberInputField(filterNumber));
  row.appendChild(createdropdownList(filterWord));
  row.appendChild(createRemoveButton());
  row.setAttribute("draggable", "true");
  row.id = getNewUniqueID();
  row.addEventListener('dragover', dragOver);
  row.addEventListener('dragleave', dragLeave);
  row.addEventListener('dragstart', dragStart);
  row.addEventListener('drop', drop);
  rowContainer.appendChild(row);
}

function createDraggableArea() {
  var draggable = document.createElement("span");
  draggable.innerHTML += "≡";
  draggable.setAttribute("class", "draggableArea");
  draggable.addEventListener('dragover', preventDefault);
  draggable.addEventListener('drop', preventDefault);
  return draggable;
}

function createNumberInputField(defaultValue){
  var inputField = document.createElement("input");
  inputField.setAttribute("type", "number");
  inputField.setAttribute("min", "1");
  inputField.setAttribute("max", "1000");
  inputField.setAttribute("value", defaultValue.toString());
  inputField.addEventListener('click', inputField.select());
  preventDefautlDrag(inputField);
  return inputField;
}

function createdropdownList(defaultValue){
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
  preventDefautlDrag(dropDown);
  return dropDown;
}

function createRemoveButton(){
  var button = document.createElement("img");
  button.setAttribute("src", "trash.svg");
  button.setAttribute("class", "remove_sorting");
  button.addEventListener('click', () =>{
    button.parentNode.remove();
  });
  preventDefautlDrag(button);
  return button;
}
