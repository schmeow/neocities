CloseTab('about')
CloseTab('projects')

function updateDateTime() {
  const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.querySelector('#time').textContent = now;
}
setInterval(updateDateTime, 1000);




// Make the DIV element draggable:
dragElement(document.getElementById("about"));
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("projects"));

function dragElement(tab) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var header = document.getElementById(tab.id + "header");
  var target = header || tab;

  // Mouse events
  if (header) {
    header.onmousedown = dragMouseDown;
    header.ontouchstart = dragTouchStart;
  } else {
    tab.onmousedown = dragMouseDown;
    tab.ontouchstart = dragTouchStart;
  }

  function getClientPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    var pos = getClientPos(e);
    pos3 = pos.x;
    pos4 = pos.y;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function dragTouchStart(e) {
    e.preventDefault();
    var pos = getClientPos(e);
    pos3 = pos.x;
    pos4 = pos.y;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDragTouch;
    
    // Bring window to front
    var tabs = document.getElementsByClassName('window');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.add('back');
    }
    tab.classList.remove('back');
    tab.classList.add('front');
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    updatePosition(e);
  }

  function elementDragTouch(e) {
    e.preventDefault();
    updatePosition(e);
  }

  function updatePosition(e) {
    var pos = getClientPos(e);
    // calculate the new cursor position:
    pos1 = pos3 - pos.x;
    pos2 = pos4 - pos.y;
    pos3 = pos.x;
    pos4 = pos.y;
    
    // set the element's new position:
    var newTop = tab.offsetTop - pos2;
    var newLeft = tab.offsetLeft - pos1;
    var menuHeight = 50; // Account for menu bar
    
    if (newTop < 0) {
      tab.style.top = 0 + "px";
    }
    else if (newTop > (window.innerHeight - menuHeight - tab.offsetHeight)) {
      tab.style.top = (window.innerHeight - menuHeight - tab.offsetHeight) + "px";
    }
    else {
      tab.style.top = newTop + "px";
    }
    
    if (newLeft < 10) {
      tab.style.left = 0 + "px";
    } else if (newLeft > window.innerWidth - tab.offsetWidth - 10) {
      tab.style.left = (window.innerWidth - tab.offsetWidth) + "px";
    } else {
      tab.style.left = newLeft + "px";
    }

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
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}


function ShowTab(id) {
  var element = document.getElementById(id); 
  if (element.classList.contains('hide')) {
    element.classList.remove('hide');
  } else{
    element.classList.add('hide');
  }
  var tabs = document.getElementsByClassName('window');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.add('back');
    }
    element.classList.remove('back');
    element.classList.add('front');
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
    
    // Remove mouse event listeners
    header.onmousedown = null;
    header.onmousemove = null;
    element.onmousedown = null;
    element.onmousemove = null;
    
    // Remove touch event listeners
    header.ontouchstart = null;
    header.ontouchmove = null;
    element.ontouchstart = null;
    element.ontouchmove = null;
    
    element.style.top = 0 + "px";
    element.style.left = 0 + "px";

    var tabs = document.getElementsByClassName('window');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.add('back');
    }
    element.classList.add('front');
  }
}
