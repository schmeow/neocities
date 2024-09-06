CloseTab('about')
CloseTab('welcome')

function updateDateTime() {
  const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.querySelector('#time').textContent = now;
}
setInterval(updateDateTime, 1000);




// Make the DIV element draggable:
dragElement(document.getElementById("about"));
dragElement(document.getElementById("welcome"));
console.log(window.innerWidth);
console.log(window.innerHeight)

function dragElement(tab) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(tab.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(tab.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    tab.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    console.log(e)
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if ((tab.offsetTop - pos2) < 0) {
      tab.style.top = 0 + "px";
    }
    else if ((tab.offsetTop - pos2) > (window.innerHeight - 40 - tab.offsetHeight)) {
      tab.style.top = (window.innerHeight - 40 - tab.offsetHeight) + "px";
    }
    else {
      tab.style.top = (tab.offsetTop - pos2) + "px";
    }
    if ((tab.offsetLeft - pos2) < 0) {
      tab.style.left = 0 + "px";
    }
    else if ((tab.offsetLeft - pos2) > (window.innerWidth - tab.offsetWidth)) {
      tab.style.left = (window.innerWidth - tab.offsetWidth) + "px";
    }
    else {
      tab.style.left = (tab.offsetLeft - pos1) + "px";
    }
    console.log(tab.offsetTop - pos2)
    console.log(tab.offsetLeft - pos1)

    var tabs = document.getElementsByClassName('window');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.add('back');
    }
    tab.classList.remove('back');
    tab.classList.add('front');
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function ShowTab(id) {
  var element = document.getElementById(id); 
  if (element.classList.contains('hide')) {
    element.classList.remove('hide');
  } else{
    element.classList.add('hide');
  }
}


function CloseTab(id) {
    ShowTab(id);
    var element = document.getElementById(id + "tab"); 
    element.classList.add('hide');
}

function OpenTab(id) {
  var element = document.getElementById(id + "tab"); 
  if (element.classList.contains('hide')) {
    element.classList.remove('hide');
    ShowTab(id);
  }
}


function Maximize(id) {
  var element = document.getElementById(id); 
  if (element.classList.contains('max')) {
    element.classList.remove('max');
    dragElement(element);
  }
  else {
    var header =  document.getElementById(id + "header")
    element.classList.add('max');
    element.classList.add('front')
    
    header.onmousedown = null;
    header.onmousemove = null;
    element.onmousedown = null;
    element.onmousemove = null;
    
    element.style.top = 0 + "px";
    element.style.left = 0 + "px";
  }
}
