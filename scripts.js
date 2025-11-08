CloseTab('about')
CloseTab('projects')
CloseTab('resume')

var windowZIndexBase = 10; 
var windowZIndexCounter = 10;

function updateDateTime() {
  const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.querySelector('#time').textContent = now;
}
setInterval(updateDateTime, 1000);

function initializeWindowZIndex(windowElement) {
  if (!windowElement.style.zIndex || windowElement.style.zIndex === '') {
    windowElement.style.zIndex = windowZIndexCounter;
    windowZIndexCounter++;
  }
}

function getVisibleWindowsSorted() {
  var allWindows = Array.from(document.getElementsByClassName('window'));
  var visibleWindows = allWindows.filter(function(win) {
    return !win.classList.contains('hide');
  });
  
  visibleWindows.sort(function(a, b) {
    var zIndexA = parseInt(a.style.zIndex) || windowZIndexBase;
    var zIndexB = parseInt(b.style.zIndex) || windowZIndexBase;
    return zIndexA - zIndexB;
  });
  
  return visibleWindows;
}

function bringWindowToFront(windowElement) {
  initializeWindowZIndex(windowElement);
  var visibleWindows = getVisibleWindowsSorted();

  var index = visibleWindows.indexOf(windowElement);
  if (index !== -1) {
    visibleWindows.splice(index, 1);
  }
  
  visibleWindows.forEach(function(win, i) {
    win.style.zIndex = windowZIndexBase + i;
  });
  
  var topZIndex = windowZIndexBase + visibleWindows.length;
  windowElement.style.zIndex = topZIndex;
  
  if (topZIndex >= windowZIndexCounter) {
    windowZIndexCounter = topZIndex + 1;
  }
}

function initializeAllWindows() {
  var allWindows = document.getElementsByClassName('window');
  var visibleCount = 0;
  
  for (var i = 0; i < allWindows.length; i++) {
    var win = allWindows[i];
    if (!win.classList.contains('hide')) {
      win.style.zIndex = windowZIndexBase + visibleCount;
      visibleCount++;
    }
  }
  
  windowZIndexCounter = windowZIndexBase + visibleCount;
  
  var welcomeWindow = document.getElementById("welcome");
  if (welcomeWindow && !welcomeWindow.classList.contains('hide')) {
    bringWindowToFront(welcomeWindow);
  }
}

initializeAllWindows();

var aboutWindow = document.getElementById("about");
var welcomeWindow = document.getElementById("welcome");
var projectsWindow = document.getElementById("projects");
var projectsWindow = document.getElementById("resume");

dragElement(aboutWindow);
dragElement(welcomeWindow);
dragElement(projectsWindow);
dragElement(resumeWindow);


resizeElement(welcomeWindow);
resizeElement(aboutWindow);
resizeElement(projectsWindow);
resizeElement(resumeWindow);

function dragElement(tab) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var header = document.getElementById(tab.id + "header");
  var target = header || tab;

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
    
    if (e.target && (e.target.tagName === 'BUTTON' || e.target.closest('.title-bar-controls'))) {
      return;
    }
    
    e.preventDefault();
    var pos = getClientPos(e);
    pos3 = pos.x;
    pos4 = pos.y;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    
    bringWindowToFront(tab);
  }

  function dragTouchStart(e) {
    e.preventDefault();
    var pos = getClientPos(e);
    pos3 = pos.x;
    pos4 = pos.y;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDragTouch;
    
    bringWindowToFront(tab);
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

    pos1 = pos3 - pos.x;
    pos2 = pos4 - pos.y;
    pos3 = pos.x;
    pos4 = pos.y;
    

    var newTop = tab.offsetTop - pos2;
    var newLeft = tab.offsetLeft - pos1;
    var menuHeight = 50; 
    
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

    bringWindowToFront(tab);
  }

  function closeDragElement() {
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
    initializeWindowZIndex(element);
    bringWindowToFront(element);
    var existingHandle = element.querySelector('.window-resize-handle');
    if (!existingHandle) {
      resizeElement(element);
    }
  } else {
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
    var windowElement = document.getElementById(id);
    if (windowElement) {
      var existingHandle = windowElement.querySelector('.window-resize-handle');
      if (!existingHandle) {
        resizeElement(windowElement);
      }
    }
  }
}


function resizeElement(windowElement) {
  if (!windowElement) return;
  
  var existingHandle = windowElement.querySelector('.window-resize-handle');
  if (existingHandle) {
    return;
  }
  
  var resizeHandle = document.createElement('div');
  resizeHandle.className = 'window-resize-handle';
  windowElement.appendChild(resizeHandle);
  
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var startWidth = 0, startHeight = 0, startX = 0, startY = 0;

  function getClientPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function resizeMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    
    if (windowElement.classList.contains('max')) {
      return;
    }
    
    var pos = getClientPos(e);
    pos3 = pos.x;
    pos4 = pos.y;
    
    startWidth = windowElement.offsetWidth;
    startHeight = windowElement.offsetHeight;
    startX = windowElement.offsetLeft;
    startY = windowElement.offsetTop;
    
    document.onmouseup = closeResizeElement;
    document.onmousemove = elementResize;
    
    bringWindowToFront(windowElement);
  }

  function resizeTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (windowElement.classList.contains('max')) {
      return;
    }
    
    var pos = getClientPos(e);
    pos3 = pos.x;
    pos4 = pos.y;
    
    startWidth = windowElement.offsetWidth;
    startHeight = windowElement.offsetHeight;
    startX = windowElement.offsetLeft;
    startY = windowElement.offsetTop;
    
    document.ontouchend = closeResizeElement;
    document.ontouchmove = elementResizeTouch;
    
    bringWindowToFront(windowElement);
  }

  function elementResize(e) {
    e = e || window.event;
    e.preventDefault();
    updateResizePosition(e);
  }

  function elementResizeTouch(e) {
    e.preventDefault();
    updateResizePosition(e);
  }

  function updateResizePosition(e) {
    var pos = getClientPos(e);
    var deltaX = pos.x - pos3;
    var deltaY = pos.y - pos4;
    
    var newWidth = startWidth + deltaX;
    var newHeight = startHeight + deltaY;
    
    var menuHeight = 50;
    var minWidth = 300;
    var minHeight = 200;
    var maxWidth = window.innerWidth - windowElement.offsetLeft - 10;
    var maxHeight = window.innerHeight - windowElement.offsetTop - menuHeight - 10;
    
    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    
    windowElement.style.width = newWidth + "px";
    windowElement.style.height = newHeight + "px";
    
    bringWindowToFront(windowElement);
  }

  function closeResizeElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }

  resizeHandle.onmousedown = resizeMouseDown;
  resizeHandle.ontouchstart = resizeTouchStart;
}

function Maximize(id) {
  var element = document.getElementById(id); 
  if (element.classList.contains('max')) {
    element.classList.remove('max');
    dragElement(element);
    var existingHandle = element.querySelector('.window-resize-handle');
    if (!existingHandle) {
      resizeElement(element);
    }
  }
  else {
    var header =  document.getElementById(id + "header")
    element.classList.add('max');
    
    header.onmousedown = null;
    header.onmousemove = null;
    element.onmousedown = null;
    element.onmousemove = null;
    
    header.ontouchstart = null;
    header.ontouchmove = null;
    element.ontouchstart = null;
    element.ontouchmove = null;
    
    element.style.top = 0 + "px";
    element.style.left = 0 + "px";

    bringWindowToFront(element);
  }
}
