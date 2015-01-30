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
