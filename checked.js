(function(exports) {

  var defaults = {
    selector: '',
    storage: 'localStorage',
    namespace: 'checked:' + location.pathname,
    clear: '.checked-clear',
    key: defaultGetKey
  };

  exports.checked = function(options) {
    options = extend({}, defaults, options);

    var selector = 'input[type=checkbox]' + (options.selector || ''),
        storage = getEngine(options.storage),
        boxes = selectAll(selector),
        prefix = options.namespace,
        getKey = function(input, index) {
          return prefix + options.key(input, index);
        };

    boxes.forEach(function(box, i) {
      var key = getKey(box, i),
          val = storage.get(key);
      box.__key__ = key;
      box.__checked__ = box.checked;
      if (val !== null) {
        box.checked = val === 'true';
      }
      box.addEventListener('change', function() {
        storage.set(key, box.checked);
      });
    });

    if (options.clear) {
      selectAll(options.clear).forEach(function(button) {
        button.addEventListener('click', clear);
      });
    }

    function getData() {
      var data = {};
      boxes.forEach(function(box, i) {
        data[box.__key__] = box.checked;
      });
      return data;
    }

    function clear() {
      boxes.forEach(function(box, i) {
        box.checked = box.__checked__;
        storage.rem(box.__key__);
      });
    }

    return {
      data: getData,
      clear: clear
    };
  };

  function selectAll(selector) {
    return [].slice.call(document.querySelectorAll(selector));
  }

  function defaultGetKey(input, index) {
    return input.id
      ? '#' + input.id
      : input.name
        ? '[name="' + input.name + '"]'
        : '@' + index;
  }

  function getEngine(name) {
    switch (name) {
      case 'cookie':
        throw 'cookie engine not implemented';

      case 'localStorage':
      case null:
        var ls = window.localStorage;
        return {
          get: ls.getItem.bind(ls),
          set: ls.setItem.bind(ls),
          rem: ls.removeItem.bind(ls)
        };
    }
    throw 'no such storage engine: ' + name;
  }

  function extend(obj) {
    [].slice.call(arguments, 1).forEach(function(arg) {
      if (!arg) return;
      for (var key in arg) {
        obj[key] = arg[key];
      }
    });
    return obj;
  }

})(this);
