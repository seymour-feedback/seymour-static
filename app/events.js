
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
