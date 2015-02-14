# checked
A microlibrary for persisting the state of HTML checkboxes. It uses
[localStorage] to save the state of checkboxes between page reloads.

## Usage
Grab `checked.js` and include it anywhere in your HTML:

```html
<script src="checked.js"></script>
```

Then call `checked()` with an optional options object:

```js
// use the defaults
var check = checked();

// provide options
var check = checked({
  selector: '.persistent',
  namespace: 'foo',
  clear: '#clear-persistent'
});
```

The `check` object returned by `checked()` has two methods:

* check.**data()**: get an object containing the checked state of all
  the tracked checkboxes.
* check.**clear()**: reset the checkboxes to their original state and 
  remove their respective keys from [localStorage].

### Options
The following options are supported:

* **selector**: a selector suffix to determine which checkboxes are
  persisted. For instance, if you specify `'.persist'`, then only
  elements matching `'input[type=checkbox].persist'` will be persisted.
* **namespace**: the prefix for [localStorage] keys, which can be used
  to either ensure or prevent checkboxes from being persisted across
  pages. The default is `('checked:' + location.pathname)`, which
  should ensure that each checkbox at a unique URL will get a unique
  [localStorage] key.
* **clear**: for convenience, you can provide this selector to tell
  checked to clear its memory when these elements are clicked. Or
  just do this:

  ```js
  document.querySelector('.checked-clear')
    .addEventListener('click', check.clear);
  ```

[localStorage]: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage#localStorage
