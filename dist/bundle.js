(function() {
 'use strict';
 var app = window.seymour = (window.seymour || {});
 var doc = window.document;
 var body = doc.documentElement;
 
app.Button = function Button() {
  this.element = null;
  this.createElement();
  this.element.addEventListener('click', function () {
    app._events.emit('seymour:click');
  }.bind(this), false);
};

app.Button.prototype.createElement = function () {
  this.element = doc.createElement('button');
  this.element.textContent = 'Seymour';
  this.element.style.position = 'absolute';
  this.element.style.top = '0';
  this.element.style.right = '0';
  this.element.style.zIndex = app._helpers.computeZedIndex() + 10;
  doc.documentElement.appendChild(this.element);
};


app.Canvas = function Canvas() {
  app._events.add('socket:open', this.create.bind(this));
  app._events.add('socket:closed', this.remove.bind(this));
};

app.Canvas.prototype.create = function () {
  this.element = doc.createElement('canvas');
  this.element.width = body.clientWidth;
  this.element.height = body.clientHeight;
  this.element.setAttribute('id', 'seymour.canvas');
  this.element.style.position = 'absolute';
  this.element.style.top = 0;
  this.element.style.left = 0;
  this.element.style.zIndex = app._helpers.computeZedIndex(app._button.element, -1);
  this.element.style.cursor = 'pointer';
  doc.getElementsByTagName('html')[0].appendChild(this.element);
  this.context = this.element.getContext('2d');
  this.tools = new app.Tools(this);
  this.addSaveButton();
};

app.Canvas.prototype.remove = function () {
  this.element.remove();
};

app.Canvas.prototype.addSaveButton = function () {
  var saveBtn = doc.createElement('button'),
    text = doc.createTextNode('Feed me'),
    style = saveBtn.style;

  saveBtn.appendChild(text);

  saveBtn.type = 'button';

  style.padding = '5px 10px';
  style.position = 'absolute';
  style.top = 0;
  style.left = '200px';
  style.zIndex = app._helpers.computeZedIndex(this.element);

  saveBtn.addEventListener('click', function () {
    this.save();
  }.bind(this), false);
  body.appendChild(saveBtn);
};

app.Canvas.prototype.captureDraw = function () {
  this.element.addEventListener('mousemove', this.findxy.bind(this), false);
  this.element.addEventListener('mousedown', this.findxy.bind(this), false);
  this.element.addEventListener('mouseup', this.findxy.bind(this), false);
  this.element.addEventListener('mouseout', this.findxy.bind(this), false);
};

app.Canvas.prototype.cancelDraw = function () {
  this.element.removeEventListener('mousemove', this.findxy.bind(this), false);
  this.element.removeEventListener('mousedown', this.findxy.bind(this), false);
  this.element.removeEventListener('mouseup', this.findxy.bind(this), false);
  this.element.removeEventListener('mouseout', this.findxy.bind(this), false);
};

app.Canvas.prototype.write = function () {

  var textContainer = doc.createElement('div');
  textContainer.style.padding = '10px';
  textContainer.style.border = '1px solid #000';
  var textarea = doc.createElement('textarea');
  textContainer.appendChild(textarea);

  textContainer.style.position = 'absolute';
  textContainer.style.zIndex = 999999;

  body.appendChild(textContainer);
  textarea.focus();

  // this.element.addEventListener('click', function (e) {
  //   textarea.style.left = e.x + 'px';
  //   textarea.style.top = e.y + 'px';
  //   body.appendChild(textarea);
  //   textarea.focus();
  // });

  this.element.addEventListener('mousedown', function (e) {
    this.element.addEventListener('mousemove', function (e) {
      textContainer.style.left = e.x + 'px';
      textContainer.style.top = e.y + 'px';
    }, false);
  }.bind(this), false);

  this.element.addEventListener('mouseup', function (e) {
    this.element.removeEventListener('mousemove');
  }.bind(this), false);

  // textarea.addEventListener('keyup', function (e) {
  //   this.context.fillStyle = '#000';
  //   this.context.font = 'normal 12px Arial';
  //   console.log(e.target)
  //   this.context.fillText(e.target.value, e.target.offsetLeft, e.target.offsetTop);
  // }.bind(this), false);

};

var prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false,
    flag = false,
    x = 'black',
    y = 1;

app.Canvas.prototype.save = function () {
  var data = this.element.toDataURL();
  app._events.emit('canvas:save', { method: 'create', entity: 'image', data: data });
};

app.Canvas.prototype.draw = function () {
  this.context.beginPath();
  this.context.moveTo(prevX, prevY);
  this.context.lineTo(currX, currY);
  this.context.strokeStyle = x;
  this.context.lineWidth = y;
  this.context.stroke();
  this.context.closePath();
};

app.Canvas.prototype.findxy = function (e) {

  var dir = e.type.replace('mouse', '');
  if (dir === 'down') {

    prevX = currX;
    prevY = currY;
    currX = e.clientX;
    currY = e.clientY;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      this.context.beginPath();
      this.context.fillStyle = x;
      this.context.fillRect(currX, currY, 2, 2);
      this.context.closePath();
      dot_flag = false;
    }
  }
  if (dir === 'up' || dir === 'out') {
    flag = false;
  }
  if (dir === 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX;
      currY = e.clientY;
      this.draw();
    }
  }
};


app.EventEmitter = function () {};

app.EventEmitter.events = {};

app.EventEmitter.prototype.add = function (name, fn) {
  if (!app.EventEmitter.events[name]) {
    app.EventEmitter.events[name] = [];
  }
  app.EventEmitter.events[name].push(fn);
};

app.EventEmitter.prototype.remove = function (name) {
  delete app.EventEmitter.events[name];
};

app.EventEmitter.prototype.emit = function (name) {
  var args = [].slice.call(arguments, 1)[0];
  if (!app.EventEmitter.events[name]) {
    console.warn('No handler registered for: "' + name + '"');
    return false;
  }
  app.EventEmitter.events[name].forEach(function (fn) {
    fn(args);
  }, this);
};

app._helpers = {
  computeZedIndex: function (element, diff) {
    var zIndex = 0;
    diff = diff || 0;
    if (element) {
      zIndex = window.getComputedStyle(element).zIndex;
    } else {
      Array.prototype.forEach.call(doc.documentElement.children, function (el) {
        zIndex = window.getComputedStyle(el).zIndex;
        if (el.hasChild) {
          this.computeZedIndex(el);
        }
      }, this);
    }
    return zIndex === 'auto' ?  0 + diff: parseInt(zIndex, 10) + diff;
  }
};

window.onload = function () {
  app._events = new app.EventEmitter();
  app._canvas = new app.Canvas();
  app._socket = new app.Socket();
  app._button = new app.Button();
};


/**
  * @constructor
  * @name Pen
  */

app.Pen = function Pen(canvas) {
  this.canvas = canvas;
  this.element = null;
  this.create();
  this.listen();
  this.writing = false;
};

app.Pen.prototype.create = function () {
  this.element = doc.createElement('button');
  this.element.textContent = 'Pen';
  this.element.style.position = 'absolute';
  this.element.style.zIndex = app._helpers.computeZedIndex(app._canvas.element, +1);
  this.element.style.top = '0';
  this.element.style.right = '125px';
  doc.documentElement.appendChild(this.element);
};

app.Pen.prototype.listen = function () {
  this.element.addEventListener('click', function () {
    if (!this.writing) {
      this.canvas.write();
      this.writing = true;
    } else {
      this.canvas.cancelWrite();
      this.writing = false;
    }
  }.bind(this), false);
};

/**
  * @constructor
  * @name Pencil
  */
app.Pencil = function Pencil(canvas) {
  console.log('YEYEYEYEYE')
  this.canvas = canvas;
  this.element = null;
  this.create();
  this.listen();
  this.drawing = false;
};

app.Pencil.prototype.create = function () {
  this.element = doc.createElement('button');
  this.element.textContent = 'Pencil';
  this.element.style.position = 'absolute';
  this.element.style.zIndex = app._helpers.computeZedIndex(app._canvas.element, +1);
  this.element.style.top = '0';
  this.element.style.right = '70px';
  doc.documentElement.appendChild(this.element);
};

app.Pencil.prototype.listen = function () {
  this.element.addEventListener('click', function () {
    if (!this.drawing) {
      this.canvas.captureDraw();
      this.drawing = true;
    } else {
      this.canvas.cancelDraw();
      this.drawing = false;
    }
  }.bind(this), false);
};

 /**
  * @constructor
  * @name Socket
  */
app.Socket = function Socket() {
  this.connection = null;
  this.connected = false;
  app._events.add('seymour:click',  this.open.bind(this));
  app._events.add('canvas:save',  this.send.bind(this));
};

app.Socket.prototype.open = function open() {
  if (this.connected) {
    return this.close();
  }
  var host = window.location.host.replace(/\//g, '-').replace(/\:/g, '_');
  this.connection = new window.WebSocket('ws://127.0.0.1:3001', host);
  this.listen();
};

app.Socket.prototype.listen = function () {
  this.connection.onerror = function connectionError() {};
  this.connection.onmessage = function connectionMessage(message) {
    console.log(message);
  };

  this.connection.onclose = function connectionClose() {
    this.connected = false;
  }.bind(this);

  this.connection.onopen = function connectionOpen() {
    app._events.emit('socket:open');
    this.send({ type: 'connection', data: 'new connection' });
    this.connected = true;
  }.bind(this);
};

app.Socket.prototype.close = function close() {
  this.connection.close();
  app._events.emit('socket:closed');
};

app.Socket.prototype.send = function send(msg) {
  msg.location = window.location.href;
  this.connection.send(JSON.stringify(msg));
};

/**
* @constructor
* @name Tools
*/
app.Tools = function Tools(canvas) {
  this.tools = {};
  this.tools.pencil = new app.Pencil(canvas);
  this.tools.pen = new app.Pen(canvas);
  app._events.add('socket:closed', this.remove.bind(this));
};

app.Tools.prototype.remove = function () {
  this.tools.pencil.element.remove();
  this.tools.pen.element.remove();
};
 
 }());