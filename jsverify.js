var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {}

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read$$1 (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read$$1(arr, i + j) !== read$$1(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write$$1 (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray$1(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray$1(ar) {
  return Array.isArray(ar);
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isNull(arg) {
  return arg === null;
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction(arg) {
  return typeof arg === 'function';
}

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
var hasOwn = Object.prototype.hasOwnProperty;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};
var pSlice = Array.prototype.slice;
var _functionsHaveNames;
function functionsHaveNames() {
  if (typeof _functionsHaveNames !== 'undefined') {
    return _functionsHaveNames;
  }
  return _functionsHaveNames = (function () {
    return function foo() {}.name === 'foo';
  }());
}
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global$1.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

function assert(value, message) {
  if (!value) fail(value, true, message, '==', ok);
}

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!isFunction(func)) {
    return;
  }
  if (functionsHaveNames()) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = AssertionError;
function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
}

// assert.AssertionError instanceof Error
inherits$1(AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect$1(something) {
  if (functionsHaveNames() || !isFunction(something)) {
    return inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect$1(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect$1(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);
assert.equal = equal;
function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', equal);
}

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);
assert.notEqual = notEqual;
function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', notEqual);
  }
}

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);
assert.deepEqual = deepEqual;
function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', deepEqual);
  }
}
assert.deepStrictEqual = deepStrictEqual;
function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', deepStrictEqual);
  }
}

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (isDate(actual) && isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (isRegExp(actual) && isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (isPrimitive(a) || isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);
assert.notDeepEqual = notDeepEqual;
function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', notDeepEqual);
  }
}

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);
assert.strictEqual = strictEqual;
function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', strictEqual);
  }
}

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
assert.notStrictEqual = notStrictEqual;
function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', notStrictEqual);
  }
}

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);
assert.throws = throws;
function throws(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
}

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = doesNotThrow;
function doesNotThrow(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
}

assert.ifError = ifError;
function ifError(err) {
  if (err) throw err;
}

var assert$1 = /*#__PURE__*/Object.freeze({
            default: assert,
            AssertionError: AssertionError,
            fail: fail,
            ok: ok,
            assert: ok,
            equal: equal,
            notEqual: notEqual,
            deepEqual: deepEqual,
            deepStrictEqual: deepStrictEqual,
            notDeepEqual: notDeepEqual,
            notDeepStrictEqual: notDeepStrictEqual,
            strictEqual: strictEqual,
            notStrictEqual: notStrictEqual,
            throws: throws,
            doesNotThrow: doesNotThrow,
            ifError: ifError
});

var assert$2 = ( assert$1 && assert ) || assert$1;

/**
  - *nil : Seq a* &mdash; Empty sequence.

  - *cons : (head : a, tail : Array a | Seq a | () → Array a | () → Seq a) → Seq a* : Cons a value to the front of a sequence (list or thunk).
*/
var nil = {};

/**
  - *.isNil : Boolean* &mdash; Constant time check, whether the sequence is empty.
*/
nil.isNil = true;

/**
  - *.toString : () → String* &mdash; String representation. Doesn't force the tail.
*/
nil.toString = function () {
  return "nil";
};

/**
  - *.length : () → Nat* &mdash; Return the length of the sequene. Forces the structure.
*/
nil.length = function () {
  return 0;
};

/**
  - *.toArray : () → Array a* &mdash; Convert the sequence to JavaScript array.
*/
nil.toArray = function nilToArray() {
  return [];
};

/**
  - *.fold : (z : b, f : (a, () → b) → b) → b* &mdash; Fold from right.

      ```hs
      fold nil x f        = x
      fold (cons h t) x f = f x (fold t x f)
      ```
*/
nil.fold = function nilFold(x /*, f */) {
  return x;
};

/**
  - *.head : () → a* &mdash;  Extract the first element of a sequence, which must be non-empty.
*/
nil.head = function nilHead() {
  throw new Error("nil.head");
};

/**
  - *.tail : () → Seq a* &mdash; Return the tail of the sequence.

      ```hs
      tail nil        = nil
      tail (cons h t) = t
      ```
*/
nil.tail = function nilTail() {
  return nil;
};

/**
  - *.nth : (n : Nat) → a* &mdash; Return nth value of the sequence.
*/
nil.nth = function nilNth(n) {
  assert$2(typeof n === "number");
  throw new Error("Can't get " + n + "th value of the nil");
};

/**
  - *.take : (n : Nat) → Seq a* &mdash; Take `n` first elements of the sequence.
*/
nil.take = function (n) {
  assert$2(typeof n === "number");
  return nil;
};

/**
  - *.drop : (n : Nat) → Seq a* &mdash; Drop `n` first elements of the sequence.
*/
nil.drop = function (n) {
  assert$2(typeof n === "number");
  return nil;
};

/**
  - *.map : (f : a → b) : Seq b* &mdash; The sequence obtained by applying `f` to each element of the original sequence.
*/
nil.map = function (f) {
  assert$2(typeof f === "function");
  return nil;
};

/**
  - *.append : (ys : Seq a | Array a) : Seq a* &mdash; Append `ys` sequence.
*/
nil.append = function (seq) {
  if (typeof seq === "function") {
    seq = seq();
  }

  if (Array.isArray(seq)) {
    /* eslint-disable no-use-before-define */
    return fromArray(seq);
    /* eslint-enable no-use-before-define */
  } else {
    return seq;
  }
};

/**
  - *.filter : (p : a -> bool) : Seq a* &mdash; filter using `p` predicate.
*/
nil.filter = function () {
  return nil;
};

/**
  - *.every : (p = identity: a -> b) : b | true &mdash; return first falsy value in the sequence, true otherwise. *N.B.* behaves slightly differently from `Array::every`.
*/
nil.every = function () {
  return true;
};

/**
  - *.some : (p = identity: a -> b) : b | false &mdash; return first truthy value in the sequence, false otherwise. *N.B.* behaves slightly differently from `Array::some`.
*/
nil.some = function () {
  return false;
};

/**
  - *.contains : (x : a) : bool &mdash; Returns `true` if `x` is in the sequence.
*/
nil.contains = function () {
  return false;
};

/**
  - *.containsNot : (x : a) : bool &mdash; Returns `true` if `x` is not in the sequence.
*/
nil.containsNot = function () {
  return true;
};

// Default cons values are with strict semantics
function Cons(head, tail) {
  this.headValue = head;
  this.tailValue = tail;
}

Cons.prototype.isNil = false;

Cons.prototype.toString = function () {
  return "Cons(" + this.headValue + ", " + this.tailValue + ")";
};

Cons.prototype.length = function () {
  return 1 + this.tail().length();
};

Cons.prototype.toArray = function () {
  var ptr = this;
  var acc = [];
  while (ptr !== nil) {
    acc.push(ptr.headValue);
    ptr = ptr.tail();
  }
  return acc;
};

Cons.prototype.fold = function consFold(x, f) {
  var self = this;
  return f(this.headValue, function () {
    return self.tail().fold(x, f);
  });
};

Cons.prototype.head = function consHead() {
  return this.headValue;
};

Cons.prototype.tail = function consTail() {
  return this.tailValue;
};

// But when cons is created, it's overloaded with lazy ones

// Force tail to whnf.
function lazyConsForce() {
  /* jshint validthis:true */
  var val = this.tailFn();
  /* eslint-disable no-use-before-define */
  this.tailValue = Array.isArray(val) ? fromArray(val) : val;
  /* eslint-enable no-use-before-define */

  delete this.tail;
  delete this.force;

  return this;
}

function lazyConsTail() {
  /* jshint validthis:true */
  this.force();
  return this.tailValue;
}

function delay(head, tail) {
  assert$2(typeof tail === "function");

  head.tailFn = tail;
  head.tail = lazyConsTail;

  head.force = lazyConsForce;
  return head;
}

function cons(head, tail) {
  if (typeof tail === "function") {
    return delay(new Cons(head), tail);
  } else if (Array.isArray(tail)) {
    return delay(cons(head), function () {
      /* eslint-disable no-use-before-define */
      return fromArray(tail);
      /* eslint-enable no-use-before-define */
    });
  } else {
    return new Cons(head, tail);
  }
}

// Rest of the functions. They might use cons

Cons.prototype.nth = function consNth(n) {
  assert$2(typeof n === "number");
  return n === 0 ? this.headValue : this.tail().nth(n - 1);
};

Cons.prototype.take = function consTake(n) {
  assert$2(typeof n === "number");
  var that = this;
  return n === 0 ? nil : cons(this.headValue, function () {
    return that.tail().take(n - 1);
  });
};

Cons.prototype.drop = function consDrop(n) {
  assert$2(typeof n === "number");
  return n === 0 ? this : this.tail().drop(n - 1);
};

Cons.prototype.map = function consMap(f) {
  assert$2(typeof f === "function");
  var that = this;
  return cons(f(that.headValue), function () {
    return that.tail().map(f);
  });
};

Cons.prototype.append = function consAppend(seq) {
  // Short circuit decidable: (++ []) ≡ id
  if (seq === nil || (Array.isArray(seq) && seq.length === 0)) {
    return this;
  }
  var that = this;
  return cons(that.headValue, function () {
    return that.tail().append(seq);
  });
};

Cons.prototype.filter = function consFilter(p) {
  assert$2(typeof p === "function");
  var that = this;
  if (p(that.headValue)) {
    return cons(that.headValue, function () {
      return that.tail().filter(p);
    });
  } else {
    return that.tail().filter(p);
  }
};

Cons.prototype.every = function consEvery(p) {
  p = p || function (x) { return x; };
  assert$2(typeof p === "function");
  var that = this;
  var pHead = p(that.headValue);
  if (!pHead) {
    return pHead;
  } else {
    return that.tail().every(p);
  }
};

Cons.prototype.some = function consSome(p) {
  p = p || function (x) { return x; };
  assert$2(typeof p === "function");
  var that = this;
  var pHead = p(that.headValue);
  if (pHead) {
    return pHead;
  } else {
    return that.tail().some(p);
  }
};

Cons.prototype.contains = function consContains(x) {
  var that = this;
  if (x === that.headValue) {
    return true;
  } else {
    return that.tail().contains(x);
  }
};

Cons.prototype.containsNot = function consContainsNot(x) {
  var that = this;
  if (x === that.headValue) {
    return false;
  } else {
    return that.tail().containsNot(x);
  }
};

// Constructors
/**
  - *fromArray: (arr : Array a) → Seq a* &mdash; Convert a JavaScript array into lazy sequence.
*/
function fromArrayIter(arr, n) {
  if (n < arr.length) {
    return cons(arr[n], function () {
      return fromArrayIter(arr, n + 1);
    });
  } else {
    return nil;
  }
}

function fromArray(arr) {
  assert$2(Array.isArray(arr));
  return fromArrayIter(arr, 0);
}

/**
  - *singleton: (x : a) → Seq a* &mdash; Create a singleton sequence.
*/
function singleton(x) {
  return fromArray([x]);
}

/**
  - *append : (xs... : Array a | Seq a | () → Array a | () → Seq a) → Seq a* : Append one sequence-like to another.
*/
function append() {
  var acc = nil;
  for (var i = 0; i < arguments.length; i++) {
    acc = acc.append(arguments[i]);
  }
  return acc;
}

/**
  - *iterate : (x : a, f : a → a) → Seq a* &mdash; Create an infinite sequence of repeated applications of `f` to `x`: *x, f(x), f(f(x))&hellip;*.
*/
function iterate(x, f) {
  return cons(x, function () {
    return iterate(f(x), f);
  });
}

/**
  - *fold : (seq : Seq a | Array a, z : b, f : (a, () → b) → b) : b* &mdash; polymorphic version of fold. Works with arrays too.
*/
function listFold(list, z, f, n) {
  if (n < list.length) {
    return f(list[n], function () {
      return listFold(list, z, f, n + 1);
    });
  } else {
    return z;
  }
}

function fold(list, z, f) {
  if (Array.isArray(list)) {
    return listFold(list, z, f, 0);
  } else {
    return list.fold(z, f);
  }
}

var lazySeq = {
  nil: nil,
  cons: cons,
  append: append,
  fromArray: fromArray,
  singleton: singleton,
  iterate: iterate,
  fold: fold,
};

function arbitraryAssert(arb) {
  assert$2(arb !== undefined && arb !== null && typeof arb === "object", "arb should be an object");
  assert$2(typeof arb.generator === "function" && typeof arb.generator.map === "function",
    "arb.generator should be a function");
  assert$2(typeof arb.shrink === "function" && typeof arb.shrink.smap === "function",
    "arb.shrink should be a function");
  assert$2(typeof arb.show === "function", "arb.show should be a function");
  assert$2(typeof arb.smap === "function", "arb.smap should be a function");
}

var arbitraryAssert_1 = arbitraryAssert;

/* @flow weak */

var isArray$2 = Array.isArray;
function isObject$1(o) {
  /* eslint-disable no-new-object */
  return new Object(o) === o;
  /* eslint-enable no-new-object */
}

/* undefined-safe isNaN */
function isNaN$1(n) {
  return typeof n === "number" && n !== n;
}

/**
  ### Utility functions

  Utility functions are exposed (and documented) only to make contributions to jsverify more easy.
  The changes here don't follow semver, i.e. there might be backward-incompatible changes even in patch releases.

  Use [underscore.js](http://underscorejs.org/), [lodash](https://lodash.com/), [ramda](http://ramda.github.io/ramdocs/docs/), [lazy.js](http://danieltao.com/lazy.js/) or some other utility belt.
*/

/* Simple sort */
function sort(arr) {
  var res = arr.slice();
  res.sort();
  return res;
}

/**
  - `utils.isEqual(x: json, y: json): bool`

      Equality test for `json` objects.
*/
function isEqual(a, b) {
  var i;

  if (isNaN$1(a) && isNaN$1(b)) {
    return true;
  }

  if (a === b) {
    return true;
  } else if (isArray$2(a) && isArray$2(b) && a.length === b.length) {
    for (i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else if (isObject$1(a) && isObject$1(b) && !isArray$2(a) && !isArray$2(b)) {
    var akeys = Object.keys(a);
    var bkeys = Object.keys(b);
    if (!isEqual(sort(akeys), sort(bkeys))) {
      return false;
    }

    for (i = 0; i < akeys.length; i++) {
      if (!isEqual(a[akeys[i]], b[akeys[i]])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
  - `utils.isApproxEqual(x: a, y: b, opts: obj): bool`

      Tests whether two objects are approximately and optimistically equal.
      Returns `false` only if they are distinguishable not equal.
      Returns `true` when `x` and `y` are `NaN`.
      This function works with cyclic data.

      Takes optional 'opts' parameter with properties:

      - `fnEqual` - whether all functions are considered equal (default: yes)
      - `depth` - how deep to recurse until treating as equal (default: 5)
*/
function isApproxEqual(x, y, opts) {
  opts = opts || {};
  var fnEqual = opts.fnEqual !== false;
  var depth = opts.depth || 5; // totally arbitrary

  // state contains pairs we checked (or are still checking, but assume equal!)
  var state = [];

  function loop(a, b, n) {
    if (isNaN$1(a) && isNaN$1(b)) {
      return true;
    }

    // trivial check
    if (a === b) {
      return true;
    }

    // depth check
    if (n >= depth) {
      return true;
    }

    var i;

    // check if pair already occured
    for (i = 0; i < state.length; i++) {
      if (state[i][0] === a && state[i][1] === b) {
        return true;
      }
    }

    // add to state
    state.push([a, b]);

    if (typeof a === "function" && typeof b === "function") {
      return fnEqual;
    }

    if (isArray$2(a) && isArray$2(b) && a.length === b.length) {
      for (i = 0; i < a.length; i++) {
        if (!loop(a[i], b[i], n + 1)) {
          return false;
        }
      }
      return true;
    } else if (isObject$1(a) && isObject$1(b) && !isArray$2(a) && !isArray$2(b)) {
      var akeys = Object.keys(a);
      var bkeys = Object.keys(b);
      if (!loop(sort(akeys), sort(bkeys), n + 1)) {
        return false;
      }

      for (i = 0; i < akeys.length; i++) {
        if (!loop(a[akeys[i]], b[akeys[i]], n + 1)) {
          return false;
        }
      }
      return true;
    }

    return false;
  }
  return loop(x, y, 0);
}

function identity(x) {
  return x;
}

function pluck(arr, key) {
  return arr.map(function (e) {
    return e[key];
  });
}

/**
  - `utils.force(x: a | () -> a) : a`

      Evaluate `x` as nullary function, if it is one.
*/
function force(arb) {
  return (typeof arb === "function") ? arb() : arb;
}

/**
  - `utils.merge(x... : obj): obj`

    Merge two objects, a bit like `_.extend({}, x, y)`.
*/
function merge() {
  var res = {};

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    var keys = Object.keys(arg);
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      res[key] = arg[key];
    }
  }

  return res;
}

function div2(x) {
  return Math.floor(x / 2);
}

function log2(x) {
  return Math.log(x) / Math.log(2);
}

function ilog2(x) {
  return x <= 0 ? 0 : Math.floor(log2(x));
}

function curriedN(n) {
  var n1 = n - 1;
  return function curriedNInstance(result, args) {
    if (args.length === n) {
      return result(args[n1]);
    } else {
      return result;
    }
  };
}

var curried2 = curriedN(2);
var curried3 = curriedN(3);

function charArrayToString(arr) {
  return arr.join("");
}

function stringToCharArray(str) {
  return str.split("");
}

function pairArrayToDict(arrayOfPairs) {
  var res = {};
  arrayOfPairs.forEach(function (p) {
    res[p[0]] = p[1];
  });
  return res;
}

function dictToPairArray(m) {
  var res = [];
  Object.keys(m).forEach(function (k) {
    res.push([k, m[k]]);
  });
  return res;
}

function partition(arr, pred) {
  var truthy = [];
  var falsy = [];

  for (var i = 0; i < arr.length; i++) {
    var x = arr[i];
    if (pred(x)) {
      truthy.push(x);
    } else {
      falsy.push(x);
    }
  }

  return [truthy, falsy];
}

var utils = {
  isArray: isArray$2,
  isObject: isObject$1,
  isEqual: isEqual,
  isApproxEqual: isApproxEqual,
  identity: identity,
  pluck: pluck,
  force: force,
  merge: merge,
  div2: div2,
  ilog2: ilog2,
  curried2: curried2,
  curried3: curried3,
  charArrayToString: charArrayToString,
  stringToCharArray: stringToCharArray,
  pairArrayToDict: pairArrayToDict,
  dictToPairArray: dictToPairArray,
  partition: partition,
};

/**
  ### Show functions
*/



/**
  - `show.def(x : a): string`

      Currently implemented as `JSON.stringify`.
*/
function showDef(obj) {
  return JSON.stringify(obj);
}

/**
  - `show.pair(showA: a -> string, showB: b -> string, x: (a, b)): string`
*/
function showPair(showA, showB) {
  var result = function (p) {
    return "(" + showA(p[0]) + ", " + showB(p[1]) + ")";
  };

  return utils.curried3(result, arguments);
}

/**
  - `show.either(showA: a -> string, showB: b -> string, e: either a b): string`
*/
function showEither(showA, showB) {
  function showLeft(value) {
    return "Left(" + showA(value) + ")";
  }

  function showRight(value) {
    return "Right(" + showB(value) + ")";
  }

  var result = function (e) {
    return e.either(showLeft, showRight);
  };

  return utils.curried3(result, arguments);
}

/**
  - `show.tuple(shrinks: (a -> string, b -> string...), x: (a, b...)): string`
*/
function showTuple(shows) {
  var result = function (objs) {
    var strs = [];
    for (var i = 0; i < shows.length; i++) {
      strs.push(shows[i](objs[i]));
    }
    return strs.join("; ");
  };

  return utils.curried2(result, arguments);
}

/**
  - `show.sum(shrinks: (a -> string, b -> string...), x: (a | b ...)): string`
*/
function showSum(shows) {
  var result = function (sum) {
    return sum.fold(function (idx, n, value) {
      return "Sum(" + idx + "/" + n + ": " + shows[idx](value) + ")";
    });
  };

  return utils.curried2(result, arguments);
}

/**
  - `show.array(shrink: a -> string, x: array a): string`
*/
function showArray(show) {
  var result = function (arr) {
    return "[" + arr.map(show).join(", ") + "]";
  };

  return utils.curried2(result, arguments);
}

var show = {
  def: showDef,
  pair: showPair,
  either: showEither,
  tuple: showTuple,
  sum: showSum,
  array: showArray,
};

/**
  ### Arbitrary data
*/

// Blessing: i.e adding prototype
/* eslint-disable no-use-before-define */
function arbitraryProtoSMap(f, g, newShow) {
  /* jshint validthis:true */
  var arb = this; // eslint-disable-line no-invalid-this
  return arbitraryBless({
    generator: arb.generator.map(f),
    shrink: arb.shrink.smap(f, g),
    show: newShow || show.def,
  });
}
/* eslint-enable no-use-before-define */

/**
  - `.smap(f: a -> b, g: b -> a, newShow: (b -> string)?): arbitrary b`

      Transform `arbitrary a` into `arbitrary b`. For example:

      `g` should be a [right inverse](http://en.wikipedia.org/wiki/Surjective_function#Surjections_as_right_invertible_functions) of `f`, but doesn't need to be complete inverse.
      i.e. i.e. `f` doesn't need to be invertible, only surjective.

      ```js
      var positiveIntegersArb = nat.smap(
        function (x) { return x + 1; },
        function (x) { return x - 1; });
      ```

      ```js
      var setNatArb =  jsc.array(jsc.nat).smap(_.uniq, _.identity);
      ```

      Right inverse means that *f(g(y)) = y* for all *y* in *Y*. Here *Y* is a type of **arrays of unique natural numbers**. For them
      ```js
      _.uniq(_.identity(y)) = _.uniq(y) = y
      ```

      Opposite: *g(f(x))* for all *x* in *X*, doesn't need to hold. *X* is **arrays of natural numbers**:
      ```js
      _.identity(_uniq([0, 0])) = [0]] != [0, 0]
      ```

      We need an inverse for shrinking, and there right inverse is enough. We can always *pull back* `smap`ped value, shrink the preimage, and *map* or *push forward* shrunken preimages again.
*/
function arbitraryBless(arb) {
  arb.smap = arbitraryProtoSMap;
  return arb;
}

var arbitraryBless_1 = arbitraryBless;

/**
  ### either
*/

function Left(value) {
  this.value = value;
}

function Right(value) {
  this.value = value;
}

/**
  - `either.left(value: a): either a b`
*/
function left(value) {
  return new Left(value);
}

/**
  - `either.right(value: b): either a b`
*/
function right(value) {
  return new Right(value);
}

/**
  - `either.either(l: a -> x, r: b -> x): x`
*/
Left.prototype.either = function lefteither(l) {
  return l(this.value);
};

Right.prototype.either = function righteither(l, r) {
  return r(this.value);
};

/**
  - `either.isEqual(other: either a b): bool`

      TODO: add `eq` optional parameter
*/
Left.prototype.isEqual = function leftIsEqual(other) {
  assert$2(other instanceof Left || other instanceof Right, "isEqual: `other` parameter should be either");
  return other instanceof Left && this.value === other.value;
};

Right.prototype.isEqual = function rightIsEqual(other) {
  assert$2(other instanceof Left || other instanceof Right, "isEqual: `other` parameter should be either");
  return other instanceof Right && this.value === other.value;
};

/**
  - `either.bimap(f: a -> c, g: b -> d): either c d`

      ```js
      either.bimap(compose(f, g), compose(h, i)) ≡ either.bimap(g, i).bimap(f, h);
      ```

*/
Left.prototype.bimap = function leftBimap(f) {
  return new Left(f(this.value));
};

Right.prototype.bimap = function rightBimap(f, g) {
  return new Right(g(this.value));
};

/**
  - `either.first(f: a -> c): either c b`

      ```js
      either.first(f) ≡ either.bimap(f, utils.identity)
      ```
*/
Left.prototype.first = function leftFirst(f) {
  return new Left(f(this.value));
};

Right.prototype.first = function rightFirst() {
  return this;
};

/**
  - `either.second(g: b -> d): either a d`

      ```js
      either.second(g) === either.bimap(utils.identity, g)
      ```
*/
Left.prototype.second = function leftSecond() {
  return this;
};

Right.prototype.second = function rightSecond(g) {
  return new Right(g(this.value));
};

var either = {
  left: left,
  right: right,
};

// Based on RC4 algorithm, as described in
// http://en.wikipedia.org/wiki/RC4

function isInteger(n) {
  return parseInt(n, 10) === n;
}

function createRC4(N) {
  function identityPermutation() {
    var s = new Array(N);
    for (var i = 0; i < N; i++) {
      s[i] = i;
    }
    return s;
  }

  // :: string | array integer -> array integer
  function seed(key) {
    if (key === undefined) {
      key = new Array(N);
      for (var k = 0; k < N; k++) {
        key[k] = Math.floor(Math.random() * N);
      }
    } else if (typeof key === "string") {
      // to string
      key = "" + key;
      key = key.split("").map(function (c) { return c.charCodeAt(0) % N; });
    } else if (Array.isArray(key)) {
      if (!key.every(function (v) {
        return typeof v === "number" && v === (v | 0);
      })) {
        throw new TypeError("invalid seed key specified: not array of integers");
      }
    } else {
      throw new TypeError("invalid seed key specified");
    }

    var keylen = key.length;

    // resed state
    var s = identityPermutation();

    var j = 0;
    for (var i = 0; i < N; i++) {
      j = (j + s[i] + key[i % keylen]) % N;
      var tmp = s[i];
      s[i] = s[j];
      s[j] = tmp;
    }

    return s;
  }

  /* eslint-disable no-shadow */
  function RC4(key) {
    this.s = seed(key);
    this.i = 0;
    this.j = 0;
  }
  /* eslint-enable no-shadow */

  RC4.prototype.randomNative = function () {
    this.i = (this.i + 1) % N;
    this.j = (this.j + this.s[this.i]) % N;

    var tmp = this.s[this.i];
    this.s[this.i] = this.s[this.j];
    this.s[this.j] = tmp;

    var k = this.s[(this.s[this.i] + this.s[this.j]) % N];

    return k;
  };

  RC4.prototype.randomUInt32 = function () {
    var a = this.randomByte();
    var b = this.randomByte();
    var c = this.randomByte();
    var d = this.randomByte();

    return ((a * 256 + b) * 256 + c) * 256 + d;
  };

  RC4.prototype.randomFloat = function () {
    return this.randomUInt32() / 0x100000000;
  };

  RC4.prototype.random = function () {
    var a;
    var b;

    if (arguments.length === 1) {
      a = 0;
      b = arguments[0];
    } else if (arguments.length === 2) {
      a = arguments[0];
      b = arguments[1];
    } else {
      throw new TypeError("random takes one or two integer arguments");
    }

    if (!isInteger(a) || !isInteger(b)) {
      throw new TypeError("random takes one or two integer arguments");
    }

    return a + this.randomUInt32() % (b - a + 1);
  };

  RC4.prototype.currentState = function () {
    return {
      i: this.i,
      j: this.j,
      s: this.s.slice(), // copy
    };
  };

  RC4.prototype.setState = function (state) {
    var s = state.s;
    var i = state.i;
    var j = state.j;

    /* eslint-disable yoda */
    if (!(i === (i | 0) && 0 <= i && i < N)) {
      throw new Error("state.i should be integer [0, " + (N - 1) + "]");
    }

    if (!(j === (j | 0) && 0 <= j && j < N)) {
      throw new Error("state.j should be integer [0, " + (N - 1) + "]");
    }
    /* eslint-enable yoda */

    // check length
    if (!Array.isArray(s) || s.length !== N) {
      throw new Error("state should be array of length " + N);
    }

    // check that all params are there
    for (var k = 0; k < N; k++) {
      if (s.indexOf(k) === -1) {
        throw new Error("state should be permutation of 0.." + (N - 1) + ": " + k + " is missing");
      }
    }

    this.i = i;
    this.j = j;
    this.s = s.slice(); // assign copy
  };

  return RC4;
}

var RC4 = createRC4(256);
RC4.prototype.randomByte = RC4.prototype.randomNative;

var RC4small = createRC4(16);
RC4small.prototype.randomByte = function () {
  var a = this.randomNative();
  var b = this.randomNative();

  return a * 16 + b;
};

var ordA = "a".charCodeAt(0);
var ord0 = "0".charCodeAt(0);

function toHex$1(n) {
  return n < 10 ? String.fromCharCode(ord0 + n) : String.fromCharCode(ordA + n - 10);
}

function fromHex(c) {
  return parseInt(c, 16);
}

RC4small.prototype.currentStateString = function () {
  var state = this.currentState();

  var i = toHex$1(state.i);
  var j = toHex$1(state.j);

  var res = i + j + state.s.map(toHex$1).join("");
  return res;
};

RC4small.prototype.setStateString = function (stateString) {
  if (!stateString.match(/^[0-9a-f]{18}$/)) {
    throw new TypeError("RC4small stateString should be 18 hex character string");
  }

  var i = fromHex(stateString[0]);
  var j = fromHex(stateString[1]);
  var s = stateString.split("").slice(2).map(fromHex);

  this.setState({
    i: i,
    j: j,
    s: s,
  });
};

RC4.RC4small = RC4small;

var rc4 = RC4;

var rc4$1 = new (rc4.RC4small)();

/**
  ### Random functions
*/

/**
  - `random(min: int, max: int): int`

      Returns random int from `[min, max]` range inclusively.

      ```js
      getRandomInt(2, 3) // either 2 or 3
      ```
*/
function randomInteger(min, max) {
  return rc4$1.random(min, max);
}

/**
  - `random.number(min: number, max: number): number`

      Returns random number from `[min, max)` range.
*/
function randomNumber(min, max) {
  return rc4$1.randomFloat() * (max - min) + min;
}

randomInteger.integer = randomInteger;
randomInteger.number = randomNumber;

randomInteger.currentStateString = rc4$1.currentStateString.bind(rc4$1);
randomInteger.setStateString = rc4$1.setStateString.bind(rc4$1);

var random = randomInteger;

/**
  ### sum (n-ary either)

  See: [Wikipedia](https://en.wikipedia.org/wiki/Tagged_union)
*/

function Addend(idx, len, value) {
  assert$2(len > 0, "Addend: 0 < len"); // empty sum is void - cannot create such
  assert$2(idx >= 0 && idx < len, "Addend: 0 <= idx < len");
  this.idx = idx;
  this.len = len;
  this.value = value;
}

/**
  - `sum.addend(idx: nat, n: nat, value: a): sum (... a ...)`
*/
function addend(idx, len, value) {
  return new Addend(idx, len, value);
}

/**
  - `.fold(f: (idx: nat, n: nat, value: a) -> b): b`
*/
Addend.prototype.fold = function (f) {
  return f(this.idx, this.len, this.value);
};

var sum = {
  addend: addend,
};

/**
  ### Generator functions

  A generator function, `generator a`, is a function `(size: nat) -> a`, which generates a value of given size.

  Generator combinators are auto-curried:

  ```js
  var xs = jsc.generator.array(jsc.nat.generator, 1); // ≡
  var ys = jsc.generator.array(jsc.nat.generator)(1);
  ```

  In purely functional approach `generator a` would be explicitly stateful computation:
  `(size: nat, rng: randomstate) -> (a, randomstate)`.
  *JSVerify* uses an implicit random number generator state,
  but the value generation is deterministic (tests are reproducible),
  if the primitives from *random* module are used.
*/

// Blessing: i.e adding prototype
/* eslint-disable no-use-before-define */
function generatorProtoMap(f) {
  /* jshint validthis:true */
  var generator = this; // eslint-disable-line no-invalid-this
  generatorAssert(generator);
  return generatorBless(function (size) {
    return f(generator(size));
  });
}

function generatorProtoFlatMap(f) {
  /* jshint validthis:true */
  var generator = this; // eslint-disable-line no-invalid-this
  generatorAssert(generator);
  return generatorBless(function (size) {
    return f(generator(size))(size);
  });
}
/* eslint-enable no-use-before-define */

function generatorAssert(generator) {
  assert$2(typeof generator === "function", "generator should be a function");
  assert$2(generator.map === generatorProtoMap, "generator.map should be a function");
  assert$2(generator.flatmap === generatorProtoFlatMap, "generator.flatmap should be a function");
  assert$2(generator.flatMap === generatorProtoFlatMap, "generator.flatMap should be a function");
}

/**
  - `generator.bless(f: nat -> a): generator a`

      Bless function with `.map` and `.flatmap` properties.

  - `.map(f: a -> b): generator b`

      Map `generator a` into `generator b`. For example:

      ```js
      positiveIntegersGenerator = nat.generator.map(
        function (x) { return x + 1; });
      ```

  - `.flatmap(f: a -> generator b): generator b`

      Monadic bind for generators. Also `flatMap` version is supported.
*/
function generatorBless(generator) {
  generator.map = generatorProtoMap;
  generator.flatmap = generatorProtoFlatMap;
  generator.flatMap = generatorProtoFlatMap;
  return generator;
}

/**
  - `generator.constant(x: a): generator a`
*/
function generateConstant(x) {
  return generatorBless(function () {
    return x;
  });
}

/**
  - `generator.combine(gen: generator a..., f: a... -> b): generator b`
*/
function generatorCombine() {
  var generators = Array.prototype.slice.call(arguments, 0, -1);
  var f = arguments[arguments.length - 1];

  return generatorBless(function (size) {
    var values = generators.map(function (gen) {
      return gen(size);
    });

    return f.apply(undefined, values);
  });
}

/**
  - `generator.oneof(gens: list (generator a)): generator a`
*/
function generateOneof(generators) {
  // TODO: generator
  generators.forEach(function (gen) {
    assert$2(typeof gen === "function");
  });

  var result = generatorBless(function (size) {
    var idx = random(0, generators.length - 1);
    var gen = generators[idx];
    return gen(size);
  });

  return utils.curried2(result, arguments);
}

// Helper, essentially: log2(size + 1)
function logsize(size) {
  return Math.max(Math.round(Math.log(size + 1) / Math.log(2), 0));
}

/**
  - `generator.recursive(genZ: generator a, genS: generator a -> generator a): generator a`
*/
function generatorRecursive(genZ, genS) {
  return generatorBless(function (size) {
    function rec(n, sizep) {
      if (n <= 0 || random(0, 3) === 0) {
        return genZ(sizep);
      } else {
        return genS(generatorBless(function (sizeq) {
          return rec(n - 1, sizeq);
        }))(sizep);
      }
    }

    return rec(logsize(size), size);
  });
}

/**
  - `generator.pair(genA: generator a, genB: generator b): generator (a, b)`
*/
function generatePair(genA, genB) {
  var result = generatorBless(function (size) {
    return [genA(size), genB(size)];
  });

  return utils.curried3(result, arguments);
}

/**
  - `generator.either(genA: generator a, genB: generator b): generator (either a b)`
*/
function generateEither(genA, genB) {
  var result = generatorBless(function (size) { // eslint-disable-line consistent-return
    var n = random(0, 1);
    switch (n) {
      case 0: return either.left(genA(size));
      case 1: return either.right(genB(size));
      // no default
    }
  });

  return utils.curried3(result, arguments);
}
/**
  - `generator.unit: generator ()`

      `unit` is an empty tuple, i.e. empty array in JavaScript representation. This is useful as a building block.
*/
var generateUnit = generatorBless(function () {
  return [];
});

/**
  - `generator.tuple(gens: (generator a, generator b...)): generator (a, b...)`
*/
function generateTuple(gens) {
  var len = gens.length;
  var result = generatorBless(function (size) {
    var r = [];
    for (var i = 0; i < len; i++) {
      r[i] = gens[i](size);
    }
    return r;
  });

  return utils.curried2(result, arguments);
}

/**
  - `generator.sum(gens: (generator a, generator b...)): generator (a | b...)`
*/
function generateSum(gens) {
  var len = gens.length;
  var result = generatorBless(function (size) {
    var idx = random(0, len - 1);
    return sum.addend(idx, len, gens[idx](size));
  });

  return utils.curried2(result, arguments);
}

/**
   - `generator.array(gen: generator a): generator (array a)`
*/
function generateArray(gen) {
  var result = generatorBless(function (size) {
    var arrsize = random(0, logsize(size));
    var arr = new Array(arrsize);
    for (var i = 0; i < arrsize; i++) {
      arr[i] = gen(size);
    }
    return arr;
  });

  return utils.curried2(result, arguments);
}

/**
   - `generator.nearray(gen: generator a): generator (array a)`
*/
function generateNEArray(gen) {
  var result = generatorBless(function (size) {
    var arrsize = random(1, Math.max(logsize(size), 1));
    var arr = new Array(arrsize);
    for (var i = 0; i < arrsize; i++) {
      arr[i] = gen(size);
    }
    return arr;
  });

  return utils.curried2(result, arguments);
}

/**
  - `generator.dict(gen: generator a): generator (dict a)`
*/

var generator = {
  pair: generatePair,
  either: generateEither,
  unit: generateUnit,
  tuple: generateTuple,
  sum: generateSum,
  array: generateArray,
  nearray: generateNEArray,
  oneof: generateOneof,
  constant: generateConstant,
  bless: generatorBless,
  combine: generatorCombine,
  recursive: generatorRecursive,
};

/**
  ### Shrink functions

  A shrink function, `shrink a`, is a function `a -> [a]`, returning an array of *smaller* values.

  Shrink combinators are auto-curried:

  ```js
  var xs = jsc.shrink.array(jsc.nat.shrink, [1]); // ≡
  var ys = jsc.shrink.array(jsc.nat.shrink)([1]);
  ```
*/

// Blessing: i.e adding prototype
/* eslint-disable no-use-before-define */
function shrinkProtoIsoMap(f, g) {
  /* jshint validthis:true */
  var shrink = this; // eslint-disable-line no-invalid-this
  return shrinkBless(function (value) {
    return shrink(g(value)).map(f);
  });
}
/* eslint-enable no-use-before-define */

/**
  - `shrink.bless(f: a -> [a]): shrink a`

      Bless function with `.smap` property.

  - `.smap(f: a -> b, g: b -> a): shrink b`

      Transform `shrink a` into `shrink b`. For example:

      ```js
      positiveIntegersShrink = nat.shrink.smap(
        function (x) { return x + 1; },
        function (x) { return x - 1; });
      ```
*/
function shrinkBless(shrink) {
  shrink.smap = shrinkProtoIsoMap;
  return shrink;
}

/**
  - `shrink.noop: shrink a`
*/
var shrinkNoop = shrinkBless(function shrinkNoop() {
  return [];
});

/**
  - `shrink.pair(shrA: shrink a, shrB: shrink b): shrink (a, b)`
*/
function shrinkPair(shrinkA, shrinkB) {
  var result = shrinkBless(function (pair) {
    assert$2(pair.length === 2, "shrinkPair: pair should be an Array of length 2");

    var a = pair[0];
    var b = pair[1];

    var shrinkedA = shrinkA(a);
    var shrinkedB = shrinkB(b);

    var pairA = shrinkedA.map(function (ap) {
      return [ap, b];
    });

    if (Array.isArray(pairA)) {
      pairA = lazySeq.fromArray(pairA);
    }

    return pairA.append(function () {
      var pairB = shrinkedB.map(function (bp) {
        return [a, bp];
      });
      return pairB;
    });
  });

  return utils.curried3(result, arguments);
}

/**
  - `shrink.either(shrA: shrink a, shrB: shrink b): shrink (either a b)`
*/
function shrinkEither(shrinkA, shrinkB) {
  function shrinkLeft(value) {
    return shrinkA(value).map(either.left);
  }

  function shrinkRight(value) {
    return shrinkB(value).map(either.right);
  }

  var result = shrinkBless(function (e) {
    return e.either(shrinkLeft, shrinkRight);
  });

  return utils.curried3(result, arguments);
}

// We represent non-empty linked list as
// singl x = [x]
// cons h t = [h, t]
function fromLinkedList(ll) {
  assert$2(ll.length === 1 || ll.length === 2, "linked list must be either [] or [x, linkedlist]");
  if (ll.length === 1) {
    return [ll[0]];
  } else {
    return [ll[0]].concat(fromLinkedList(ll[1]));
  }
}

function toLinkedList(arr) {
  assert$2(Array.isArray(arr) && arr.length > 0, "toLinkedList expects non-empty array");
  if (arr.length === 1) {
    return [arr[0]];
  } else {
    return [arr[0], toLinkedList(arr.slice(1))];
  }
}

function toSingleton(x) {
  return [x];
}

// Vec a 1 → a
function fromSingleton(a) {
  return a[0];
}

function flattenShrink(shrinksLL) {
  if (shrinksLL.length === 1) {
    return shrinksLL[0].smap(toSingleton, fromSingleton);
  } else {
    var head = shrinksLL[0];
    var tail = shrinksLL[1];
    return shrinkPair(head, flattenShrink(tail));
  }
}

/**
  - `shrink.tuple(shrs: (shrink a, shrink b...)): shrink (a, b...)`
*/
function shrinkTuple(shrinks) {
  assert$2(shrinks.length > 0, "shrinkTuple needs > 0 values");
  var shrinksLL = toLinkedList(shrinks);
  var shrink = flattenShrink(shrinksLL);
  var result = shrinkBless(function (tuple) {
    assert$2(tuple.length === shrinks.length, "shrinkTuple: not-matching params");
    var ll = toLinkedList(tuple);
    return shrink(ll).map(fromLinkedList);
  });

  return utils.curried2(result, arguments);
}

/**
  - `shrink.sum(shrs: (shrink a, shrink b...)): shrink (a | b...)`
*/
function shrinkSum(shrinks) {
  assert$2(shrinks.length > 0, "shrinkTuple needs > 0 values");
  var result = shrinkBless(function (s) {
    return s.fold(function (idx, len, value) {
      assert$2(len === shrinks.length, "shrinkSum: not-matching params");
      return shrinks[idx](value).map(function (shrinked) {
        return sum.addend(idx, len, shrinked);
      });
    });
  });

  return utils.curried2(result, arguments);
}

function shrinkArrayWithMinimumSize(size) {
  function shrinkArrayImpl(shrink) {
    var result = shrinkBless(function (arr) {
      assert$2(Array.isArray(arr), "shrinkArrayImpl() expects array, got: " + arr);
      if (arr.length <= size) {
        return lazySeq.nil;
      } else {
        var x = arr[0];
        var xs = arr.slice(1);

        return lazySeq.cons(xs, lazySeq.nil)
          .append(shrink(x).map(function (xp) { return [xp].concat(xs); }))
          .append(shrinkArrayImpl(shrink, xs).map(function (xsp) { return [x].concat(xsp); }));
      }
    });

    return utils.curried2(result, arguments);
  }

  return shrinkArrayImpl;
}

/**
  - `shrink.array(shr: shrink a): shrink (array a)`
*/
var shrinkArray = shrinkArrayWithMinimumSize(0);

/**
  - `shrink.nearray(shr: shrink a): shrink (nearray a)`
*/
var shrinkNEArray = shrinkArrayWithMinimumSize(1);

var shrink = {
  noop: shrinkNoop,
  pair: shrinkPair,
  either: shrinkEither,
  tuple: shrinkTuple,
  sum: shrinkSum,
  array: shrinkArray,
  nearray: shrinkNEArray,
  bless: shrinkBless,
};

function makeArray(flavour) {
  return function arrayImpl(arb) {
    arb = utils.force(arb);

    arbitraryAssert_1(arb);

    return arbitraryBless_1({
      generator: generator[flavour](arb.generator),
      shrink: shrink[flavour](arb.shrink),
      show: show.array(arb.show),
    });
  };
}

var array = makeArray("array");
var nearray = makeArray("nearray");

var array_1 = {
  array: array,
  nearray: nearray,
};

function pair(a, b) {
  a = utils.force(a);
  b = utils.force(b);

  arbitraryAssert_1(a);
  arbitraryAssert_1(b);

  return arbitraryBless_1({
    generator: generator.pair(a.generator, b.generator),
    shrink: shrink.pair(a.shrink, b.shrink),
    show: show.pair(a.show, b.show),
  });
}

var pair_1 = {
  pair: pair,
};

/**
  ### Primitive arbitraries
*/

function extendWithDefault(arb) {
  var def = arb();
  arb.generator = def.generator;
  arb.shrink = def.shrink;
  arb.show = def.show;
  arb.smap = def.smap;
}

function numeric(impl) {
  return function (minsize, maxsize) {
    if (arguments.length === 2) {
      var arb = arbitraryBless_1(impl(maxsize - minsize));
      var to = function to(x) {
        return Math.abs(x) + minsize;
      };
      var from = function from(x) {
        return x - minsize;
      };

      return arb.smap(to, from);
    } else if (arguments.length === 1) {
      return arbitraryBless_1(impl(minsize /* as maxsize */));
    } else {
      return arbitraryBless_1(impl());
    }
  };
}

/**
  - `integer: arbitrary integer`
  - `integer(maxsize: nat): arbitrary integer`
  - `integer(minsize: integer, maxsize: integer): arbitrary integer`

      Integers, ℤ
*/
var integer = numeric(function integer(maxsize) {
  return {
    generator: generator.bless(function (size) {
      size = maxsize === undefined ? size : maxsize;
      return random(-size, size);
    }),
    shrink: shrink.bless(function (i) {
      assert$2(typeof i === "number", "integer.shrink have to be a number");

      i = Math.abs(i);
      if (i === 0) {
        return [];
      } else {
        var arr = [0];
        var j = utils.div2(i);
        var k = Math.max(j, 1);
        while (j < i) {
          arr.push(j);
          arr.push(-j);
          k = Math.max(utils.div2(k), 1);
          j += k;
        }
        return arr;
      }
    }),

    show: show.def,
  };
});

extendWithDefault(integer);

/**
  - `nat: arbitrary nat`
  - `nat(maxsize: nat): arbitrary nat`

      Natural numbers, ℕ (0, 1, 2...)
*/
function nat(maxsize) {
  return arbitraryBless_1({
    generator: generator.bless(function (size) {
      size = maxsize === undefined ? size : maxsize;
      return random(0, size);
    }),
    shrink: shrink.bless(function (i) {
      assert$2(typeof i === "number", "nat.shrink have to be a number");

      var arr = [];
      var j = utils.div2(i);
      var k = Math.max(j, 1);
      while (j < i) {
        arr.push(j);
        k = Math.max(utils.div2(k), 1);
        j += k;
      }
      return arr;
    }),
    show: show.def,
  });
}

extendWithDefault(nat);

/**
  - `number: arbitrary number`
  - `number(maxsize: number): arbitrary number`
  - `number(min: number, max: number): arbitrary number`

      JavaScript numbers, "doubles", ℝ. `NaN` and `Infinity` are not included.
*/
var number = numeric(function number(maxsize) {
  return {
    generator: generator.bless(function (size) {
      size = maxsize === undefined ? size : maxsize;
      return random.number(-size, size);
    }),
    shrink: shrink.bless(function (x) {
      assert$2(typeof x === "number", "number.shrink have to be a number");

      if (Math.abs(x) > 1e-6) {
        return [0, x / 2, -x / 2];
      } else {
        return [];
      }
    }),
    show: show.def,
  };
});

extendWithDefault(number);

/**
  - `uint8: arbitrary nat`
  - `uint16: arbitrary nat`
  - `uint32: arbitrary nat`
*/
var uint8 = nat(0xff);
var uint16 = nat(0xffff);
var uint32 = nat(0xffffffff);

/**
  - `int8: arbitrary integer`
  - `int16: arbitrary integer`
  - `int32: arbitrary integer`
*/
var int8 = integer(-0x80, 0x7f);
var int16 = integer(-0x8000, 0x7fff);
var int32 = integer(-0x80000000, 0x7fffffff);

/**
  - `bool: arbitrary bool`

      Booleans, `true` or `false`.
*/
var bool = arbitraryBless_1({
  generator: generator.bless(function (/* size */) {
    var i = random(0, 1);
    return i === 1;
  }),

  shrink: shrink.bless(function (b) {
    assert$2(b === true || b === false, "bool.shrink excepts true or false");
    return b === true ? [false] : [];
  }),
  show: show.def,
});

/**
  - `datetime: arbitrary datetime`

      Random datetime
*/
var datetimeConst = 1416499879495; // arbitrary datetime

function datetime(from, to) {
  var toDate;
  var fromDate;
  var arb;

  if (arguments.length === 2) {
    toDate = function toDateFn(x) {
      return new Date(x);
    };
    fromDate = function fromDateFn(x) {
      return x.getTime();
    };
    from = fromDate(from);
    to = fromDate(to);
    arb = number(from, to);

    return arb.smap(toDate, fromDate);
  } else {
    toDate = function toDateFn(x) {
      return new Date(x * 768000000 + datetimeConst);
    };
    arb = number;

    return arbitraryBless_1({
      generator: arb.generator.map(toDate),
      shrink: shrink.noop,
      show: show.def,
    });
  }
}

extendWithDefault(datetime);

/**
  - `elements(args: array a): arbitrary a`

      Random element of `args` array.
*/
function elements(args) {
  assert$2(args.length !== 0, "elements: at least one parameter expected");

  return arbitraryBless_1({
    generator: generator.bless(function (/* size */) {
      var i = random(0, args.length - 1);
      return args[i];
    }),

    shrink: shrink.bless(function (x) {
      var idx = args.indexOf(x);
      if (idx <= 0) {
        return [];
      } else {
        return args.slice(0, idx);
      }
    }),
    show: show.def,
  });
}

/**
  - `falsy: arbitrary *`

      Generates falsy values: `false`, `null`, `undefined`, `""`, `0`, and `NaN`.
*/
var falsy = elements([false, null, undefined, "", 0, NaN]);
falsy.show = function (v) {
  if (v !== v) {
    return "falsy: NaN";
  } else if (v === "") {
    return "falsy: empty string";
  } else if (v === undefined) {
    return "falsy: undefined";
  } else {
    return "falsy: " + v;
  }
};

/**
  - `constant(x: a): arbitrary a`

      Returns an unshrinkable arbitrary that yields the given object.
*/
function constant(x) {
  return arbitraryBless_1({
    generator: generator.constant(x),
    shrink: shrink.noop,
    show: show.def,
  });
}

var primitive = {
  integer: integer,
  nat: nat,
  int8: int8,
  int16: int16,
  int32: int32,
  uint8: uint8,
  uint16: uint16,
  uint32: uint32,
  number: number,
  elements: elements,
  bool: bool,
  falsy: falsy,
  constant: constant,
  datetime: datetime,
};

/**
  ### Arbitrary strings
*/

function fromCode(code) {
  return String.fromCharCode(code);
}

function toCode(c) {
  return c.charCodeAt(0);
}

/**
  - `char: arbitrary char` &mdash; Single character
*/
var char = primitive.nat(0xff).smap(fromCode, toCode);

/**
  - `asciichar: arbitrary char` &mdash; Single ascii character (0x20-0x7e inclusive, no DEL)
*/
var asciichar = primitive.integer(0x20, 0x7e).smap(fromCode, toCode);

/**
  - `string: arbitrary string`
*/
var string = array_1.array(char).smap(utils.charArrayToString, utils.stringToCharArray);

/**
  - `nestring: arbitrary string` &mdash; Generates strings which are not empty.
*/
var nestring = array_1.nearray(char).smap(utils.charArrayToString, utils.stringToCharArray);

/**
  - `asciistring: arbitrary string`
*/
var asciistring = array_1.array(asciichar).smap(utils.charArrayToString, utils.stringToCharArray);

/**
  - `asciinestring: arbitrary string`
*/
var asciinestring = array_1.nearray(asciichar).smap(utils.charArrayToString, utils.stringToCharArray);

var string_1 = {
  char: char,
  asciichar: asciichar,
  string: string,
  nestring: nestring,
  asciistring: asciistring,
  asciinestring: asciinestring,
};

function makeMapShow(elShow) {
  return function (m) {
    return "{" + Object.keys(m).map(function (k) {
      return k + ": " + elShow(m[k]);
    }).join(", ") + "}";
  };
}

/**
  - `dict.generator(gen: generator a): generator (dict a)`
*/
function generateDict(gen) {
  var pairGen = generator.pair(string_1.string.generator, gen);
  var arrayGen = generator.array(pairGen);
  var result = arrayGen.map(utils.pairArrayToDict);

  return utils.curried2(result, arguments);
}

function dict(arb) {
  arb = utils.force(arb);
  arbitraryAssert_1(arb);

  var pairArbitrary = pair_1.pair(string_1.string, arb);
  var arrayArbitrary = array_1.array(pairArbitrary);

  return arrayArbitrary.smap(utils.pairArrayToDict, utils.dictToPairArray, makeMapShow(arb.show));
}

var dict_1 = {
  arbitrary: dict,
  generator: generateDict,
};

var nullArb = primitive.constant(null);

var generateInteger = primitive.integer.generator;
var generateNumber = primitive.number.generator;
var generateBool = primitive.bool.generator;
var generateString = string_1.string.generator;
var generateNull = nullArb.generator;

var generateJson = generator.recursive(
  generator.oneof([
    generateInteger,
    generateNumber,
    generateBool,
    generateString,
    generateNull,
  ]),
  function (gen) {
    return generator.oneof([generator.array(gen), dict_1.generator(gen)]);
  });

// Forward declaration
var shrinkDictJson;
var shrinkJson;

function shrinkRecJson(json) {
  if (Array.isArray(json)) {
    return shrink.array(shrinkJson, json);
  } else {
    return shrinkDictJson(json);
  }
}

shrinkJson = shrink.bless(function (json) {
  assert$2(typeof json !== "function");

  if (json === null) {
    return nullArb.shrink(json);
  }

  switch (typeof json) {
    case "boolean": return primitive.bool.shrink(json);
    case "number": return primitive.number.shrink(json);
    case "string": return string_1.string.shrink(json);
    default: return shrinkRecJson(json);
  }
});

shrinkDictJson = (function () {
  var pairShrink = shrink.pair(string_1.string.shrink, shrinkJson);
  var arrayShrink = shrink.array(pairShrink);

  return arrayShrink.smap(utils.pairArrayToDict, utils.dictToPairArray);
}());

var json = arbitraryBless_1({
  generator: generateJson,
  shrink: shrinkJson,
  show: show.def,
});

var json_1 = {
  json: json,
};

/**
  ### Arbitrary combinators
*/

/**
  - `nonshrink(arb: arbitrary a): arbitrary a`

      Non shrinkable version of arbitrary `arb`.
*/
function nonshrink(arb) {
  arb = utils.force(arb);

  return arbitraryBless_1({
    generator: arb.generator,
    shrink: shrink.noop,
    show: arb.show,
  });
}

/**
  - `unit: arbitrary ()`
*/
var unit = arbitraryBless_1({
  generator: generator.unit,
  shrink: shrink.noop,
  show: show.def,
});

/**
  - `either(arbA: arbitrary a, arbB : arbitrary b): arbitrary (either a b)`
*/
function either$1(a, b) {
  a = utils.force(a || json_1.json);
  b = utils.force(b || json_1.json);

  arbitraryAssert_1(a);
  arbitraryAssert_1(b);

  return arbitraryBless_1({
    generator: generator.either(a.generator, b.generator),
    shrink: shrink.either(a.shrink, b.shrink),
    show: show.either(a.show, b.show),
  });
}

/**
  - `pair(arbA: arbitrary a, arbB : arbitrary b): arbitrary (pair a b)`

      If not specified `a` and `b` are equal to `value()`.
*/
function pairArb(a, b) {
  return pair_1.pair(a || json_1.json, b || json_1.json);
}

/**
  - `tuple(arbs: (arbitrary a, arbitrary b...)): arbitrary (a, b...)`
*/
function tuple(arbs) {
  arbs = arbs.map(utils.force);
  return arbitraryBless_1({
    generator: generator.tuple(utils.pluck(arbs, "generator")),
    shrink: shrink.tuple(utils.pluck(arbs, "shrink")),
    show: show.tuple(utils.pluck(arbs, "show")),
  });
}

/**
  - `sum(arbs: (arbitrary a, arbitrary b...)): arbitrary (a | b ...)`
*/
function sum$1(arbs) {
  arbs = arbs.map(utils.force);
  return arbitraryBless_1({
    generator: generator.sum(utils.pluck(arbs, "generator")),
    shrink: shrink.sum(utils.pluck(arbs, "shrink")),
    show: show.sum(utils.pluck(arbs, "show")),
  });
}
/**
  - `dict(arb: arbitrary a): arbitrary (dict a)`

      Generates a JavaScript object with properties of type `A`.
*/
function dictArb(arb) {
  return dict_1.arbitrary(arb || json_1.json);
}

/**
  - `array(arb: arbitrary a): arbitrary (array a)`
*/
function arrayArb(arb) {
  return array_1.array(arb || json_1.json);
}

/**
  - `nearray(arb: arbitrary a): arbitrary (array a)`
*/
function nearrayArb(arb) {
  return array_1.nearray(arb || json_1.json);
}

/**
  - `json: arbitrary json`

       JavaScript Objects: boolean, number, string, null, array of `json` values or object with `json` values.
*/
var jsonArb = json_1.json;

/**
  - `oneof(gs : array (arbitrary a)...) : arbitrary a`

      Randomly uses one of the given arbitraries.
*/
function oneof() {
  assert$2(arguments.length !== 0, "oneof: at least one parameter expected");

  // TODO: write this in more functional way
  var generators = [];
  var append = function (a) {
    generators.push(utils.force(a).generator);
  };
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (utils.isArray(arg)) {
      arg.forEach(append);
    } else {
      append(arg);
    }
  }

  return arbitraryBless_1({
    generator: generator.oneof(generators),
    // TODO: make shrink
    shrink: shrink.noop,
    show: show.def,
  });
}

// Return a lazy arbitrary that delegates to another arbitrary at its
// 'strict' property. An arbitrary must be assigned to that property before
// this arbitrary can generate anything.
function lazyArbitrary() {
  var arb = {};
  // This function must be pure because it will not be called with
  // meaningful context.
  arb.generator = generator.bless(function (size) {
    return arb.strict.generator(size);
  });
  arb.shrink = shrink.noop;
  arb.show = show.def;
  arb = arbitraryBless_1(arb);
  return arb;
}

/**
  - ```js
    letrec(
      (tie: key -> (arbitrary a | arbitrary b | ...))
      -> { key: arbitrary a, key: arbitrary b, ... }):
    { key: arbitrary a, key: arbitrary b, ... }
    ```

    Mutually recursive definitions. Every reference to a sibling arbitrary
    should go through the `tie` function.

    ```js
    { arb1, arb2 } = jsc.letrec(function (tie) {
      return {
        arb1: jsc.tuple(jsc.int, jsc.oneof(jsc.const(null), tie("arb2"))),
        arb2: jsc.tuple(jsc.bool, jsc.oneof(jsc.const(null), tie("arb1"))),
      }
    });
    ```
*/
function letrec(definition) {
  // We must use a lazy dictionary because we do not know the key set
  // before calling the definition.
  var lazyArbs = {};

  function tie(name) {
    if (!lazyArbs.hasOwnProperty(name)) {
      lazyArbs[name] = lazyArbitrary();
    }
    return lazyArbs[name];
  }

  var strictArbs = definition(tie);

  Object.keys(lazyArbs).forEach(function (key) {
    var strictArb = strictArbs[key];
    if (!strictArb) {
      throw new Error("undefined lazy arbitrary: " + key);
    }
    lazyArbs[key].strict = strictArb;
  });

  return strictArbs;
}

function recursive(arbZ, arbS) {
  var genZ = arbZ.generator;
  var genS = function (recGen) {
    var recArb = arbitraryBless_1({
      generator: recGen,
      shrink: shrink.noop,
      show: show.def,
    });
    return arbS(recArb).generator;
  };

  var gen = generator.recursive(genZ, genS);
  return arbitraryBless_1({
    generator: gen,
    shrink: shrink.noop,
    show: show.def,
  });
}

var arbitrary = {
  nonshrink: nonshrink,
  pair: pairArb,
  either: either$1,
  unit: unit,
  dict: dictArb,
  json: jsonArb,
  nearray: nearrayArb,
  array: arrayArb,
  tuple: tuple,
  sum: sum$1,
  oneof: oneof,
  recursive: recursive,
  letrec: letrec,
};

/**
  - `bless(arb: {...}): arbitrary a`

    Bless almost arbitrary structure to be proper arbitrary. *Note*: this function mutates argument.

    #### Example:

    ```js
    var arbTokens = jsc.bless({
      generator: function () {
        switch (jsc.random(0, 2)) {
          case 0: return "foo";
          case 1: return "bar";
          case 2: return "quux";
        }
      }
    });
    ```
*/
function bless(arb) {
  assert$2(arb !== null && typeof arb === "object", "bless: arb should be an object");
  assert$2(typeof arb.generator === "function", "bless: arb.generator should be a function");

  // default shrink
  if (typeof arb.shrink !== "function") {
    arb.shrink = shrink.noop;
  }

  // default show
  if (typeof arb.show !== "function") {
    arb.show = show.def;
  }

  generator.bless(arb.generator);
  shrink.bless(arb.shrink);

  arbitraryBless_1(arb);
  return arb;
}

var bless_1 = bless;

/**
  - `generator.record(gen: { key: generator a... }): generator { key: a... }`
*/
function generatorRecord(spec) {
  var keys = Object.keys(spec);
  var result = generator.bless(function (size) {
    var res = {};
    keys.forEach(function (k) {
      res[k] = spec[k](size);
    });
    return res;
  });

  return utils.curried2(result, arguments);
}

/**
  - `shrink.record(shrs: { key: shrink a... }): shrink { key: a... }`
*/
function shrinkRecord(shrinksRecord) {
  var keys = Object.keys(shrinksRecord);
  var shrinks = keys.map(function (k) { return shrinksRecord[k]; });

  var result = shrink.bless(function (rec) {
    var values = keys.map(function (k) { return rec[k]; });
    var shrinked = shrink.tuple(shrinks, values);

    return shrinked.map(function (s) {
      var res = {};
      keys.forEach(function (k, i) {
        res[k] = s[i];
      });
      return res;
    });
  });

  return utils.curried2(result, arguments);
}

function arbitraryRecord(spec) {
  var generatorSpec = {};
  var shrinkSpec = {};
  var showSpec = {};

  Object.keys(spec).forEach(function (k) {
    var arb = utils.force(spec[k]);
    generatorSpec[k] = arb.generator;
    shrinkSpec[k] = arb.shrink;
    showSpec[k] = arb.show;
  });

  return arbitraryBless_1({
    generator: generatorRecord(generatorSpec),
    shrink: shrinkRecord(shrinkSpec),
    show: function (m) {
      return "{" + Object.keys(m).map(function (k) {
        return k + ": " + showSpec[k](m[k]);
      }).join(", ") + "}";
    },
  });
}

var record = {
  generator: generatorRecord,
  arbitrary: arbitraryRecord,
  shrink: shrinkRecord,
};

/*
  #### FMap (eq : a -> a -> bool) : FMap a

  Finite map, with any object a key.

  Short summary of member functions:

  - FMap.insert (key : a) (value : any) : void
  - FMap.get (key : a) : any
  - FMap.contains (key : a) : obool
*/
function FMap(eq) {
  this.eq = eq || utils.isEqual;
  this.data = [];
}

FMap.prototype.contains = function FMapContains(key) {
  for (var i = 0; i < this.data.length; i++) {
    if (this.eq(this.data[i][0], key)) {
      return true;
    }
  }

  return false;
};

FMap.prototype.insert = function FMapInsert(key, value) {
  for (var i = 0; i < this.data.length; i++) {
    if (this.eq(this.data[i][0], key)) {
      this.data[i] = [key, value];
      return;
    }
  }

  this.data.push([key, value]);
};

FMap.prototype.get = function FMapGet(key) { // eslint-disable-line consistent-return
  for (var i = 0; i < this.data.length; i++) {
    if (this.eq(this.data[i][0], key)) {
      return this.data[i][1];
    }
  }
};

var finitemap = FMap;

/**
  ### Arbitrary functions

  - `fn(arb: arbitrary a): arbitrary (b -> a)`
  - `fun(arb: arbitrary a): arbitrary (b -> a)`
*/

function fn(arb) {
  arb = utils.force(arb || json_1.json);

  return arbitraryBless_1({
    generator: generator.bless(function (size) {
      var m = new finitemap();

      var f = function (arg) {
        if (!m.contains(arg)) {
          var value = arb.generator(size);
          m.insert(arg, value);
        }

        return m.get(arg);
      };

      f.internalMap = m;
      return f;
    }),

    shrink: shrink.noop,
    show: function (f) {
      return "[" + f.internalMap.data.map(function (item) {
        return "" + item[0] + ": " + arb.show(item[1]);
      }).join(", ") + "]";
    },
  });
}

var fn_1 = {
  fn: fn,
  fun: fn,
};

/**
  ### Small arbitraries

  - `generator.small(gen: generator a): generator a`
  - `small(arb: arbitrary a): arbitrary a`

  Create a generator (abitrary) which will generate smaller values, i.e. generator's `size` parameter is decreased logarithmically.

  ```js
  jsc.property("small array of small natural numbers", "small (array nat)", function (arr) {
    return Array.isArray(arr);
  });

  jsc.property("small array of normal natural numbers", "(small array) nat", function (arr) {
    return Array.isArray(arr);
  });
  ```
*/

function smallGenerator(gen) {
  // TODO: assertGenerator(gen)
  return generator.bless(function (size) {
    return gen(utils.ilog2(size));
  });
}

function smallArbitraryImpl(arb) {
  arbitraryAssert_1(arb);
  return arbitraryBless_1({
    generator: smallGenerator(arb.generator),
    shrink: arb.shrink,
    show: arb.show,
  });
}

function smallArbitrary(arb) {
  if (typeof arb === "function") {
    return function () {
      var resArb = arb.apply(arb, arguments);
      return smallArbitraryImpl(resArb);
    };
  } else { /* if (typeof arb === "object") */
    return smallArbitraryImpl(arb);
  }
}

var small = {
  generator: smallGenerator,
  arbitrary: smallArbitrary,
};

var environment = utils.merge(primitive, string_1, {
  pair: arbitrary.pair,
  unit: arbitrary.unit,
  either: arbitrary.either,
  dict: arbitrary.dict,
  array: arbitrary.array,
  nearray: arbitrary.nearray,
  json: arbitrary.json,
  fn: fn_1.fn,
  fun: fn_1.fn,
  nonshrink: arbitrary.nonshrink,
  small: small.arbitrary,
});

var environment_1 = environment;

/**
  # typify type parser

  > Type signature parser for typify

  [![Build Status](https://secure.travis-ci.org/phadej/typify-parser.svg?branch=master)](http://travis-ci.org/phadej/typify-parser)
  [![NPM version](https://badge.fury.io/js/typify-parser.svg)](http://badge.fury.io/js/typify-parser)
  [![Dependency Status](https://david-dm.org/phadej/typify-parser.svg)](https://david-dm.org/phadej/typify-parser)
  [![devDependency Status](https://david-dm.org/phadej/typify-parser/dev-status.svg)](https://david-dm.org/phadej/typify-parser#info=devDependencies)
  [![Code Climate](https://img.shields.io/codeclimate/github/phadej/typify-parser.svg)](https://codeclimate.com/github/phadej/typify-parser)

  Turns `(foo, bar 42) -> quux` into
  ```js
  {
    "type": "function",
    "arg": {
      "type": "product",
      "args": [
        {
          "type": "ident",
          "value": "foo"
        },
        {
          "type": "application",
          "callee": {
            "type": "ident",
            "value": "bar"
          },
          "args": [
            {
              "type": "number",
              "value": 42
            }
          ]
        }
      ]
    },
    "result": {
      "type": "ident",
      "value": "quux"
    }
  }
  ```

  ## Synopsis

  ```js
  var parser = require("typify-parser");

  // Example from above
  var t = parser("(foo, bar 42) -> quux");

  // Free vars
  p.freeVars(t);                             // ['bar', 'foo', 'quux']
  p.freeVars(p("rec list -> () | a & list")) // ['a']
  ```
*/

function unescapeString(str) {
  return str.replace(/\\(?:'|"|\\|n|x[0-9a-fA-F]{2})/g, function (match) {
    switch (match[1]) {
      case "'": return "'";
      case "\"": return "\"";
      case "\\": return "\\";
      case "n": return "\n";
      case "x": return String.fromCharCode(parseInt(match.substr(2), 16));
    }
  });
}

function lex(input) {
  // Unicode
  // top: 22a4
  // bottom: 22a5
  // and: 2227
  // or: 2228
  // times: \u00d7
  // to: 2192
  // ellipsis: 2026
  // blackboard 1: d835 dfd9
  var m = input.match(/^([ \t\r\n]+|[\u22a4\u22a5\u2227\u2228\u00d7\u2192\u2026]|\ud835\udfd9|_\|_|\*|\(\)|"(?:[^"\\]|\\[\\'"n]|\\x[0-9a-fA-F]{2})*"|'(?:[^'\\]|\\[\\'"n]|\\x[0-9a-fA-F]{2})*'|[0-9a-zA-Z_\$@]+|,|->|:|;|&|\||\.\.\.|\(|\)|\[|\]|\{|\}|\?)*$/);
  if (m === null) {
    throw new SyntaxError("Cannot lex type signature");
  }
  m = input.match(/([ \t\r\n]+|[\u22a4\u22a5\u2227\u2228\u00d7\u2192\u2026]|\ud835\udfd9|_\|_|\*|\(\)|"(?:[^"\\]|\\[\\'"n]|\\x[0-9a-fA-F]{2})*"|'(?:[^'\\]|\\[\\'"n]|\\x[0-9a-fA-F]{2})*'|[0-9a-zA-Z_\$@]+|,|->|:|;|&|\||\.\.\.|\(|\)|\[|\]|\{|\}|\?)/g);

  return m
  .map(function (token) {
    switch (token) {
      case "_|_": return { type: "false" };
      case "\u22a5": return { type: "false" };
      case "*": return { type: "true" };
      case "\u22a4": return { type: "true" };
      case "()": return { type: "unit" };
      case "\ud835\udfd9": return { type: "unit" };
      case "true": return { type: "bool", value: true };
      case "false": return { type: "bool", value: false };
      case "rec": return { type: "rec" };
      case "&": return { type: "&" };
      case "\u2227": return { type: "&" };
      case "|": return { type: "|" };
      case "\u2228": return { type: "|" };
      case ",": return { type: "," };
      case "\u00d7": return { type: "," };
      case ";": return { type: ";" };
      case ":": return { type: ":" };
      case "(": return { type: "(" };
      case ")": return { type: ")" };
      case "[": return { type: "[" };
      case "]": return { type: "]" };
      case "{": return { type: "{" };
      case "}": return { type: "}" };
      case "?": return { type: "?" };
      case "->": return { type: "->" };
      case "\u2192": return { type: "->" };
      case "...": return { type: "..." };
      case "\u2026": return { type: "..." };
    }

    // Whitespace
    if (token.match(/^[ \r\r\n]+$/)) {
      return null;
    }

    if (token.match(/^[0-9]+/)) {
      return { type: "number", value: parseInt(token, 10) };
    }

    if (token[0] === "'" || token[0] === "\"") {
      token = token.slice(1, -1);
      return { type: "string", value: unescapeString(token) };
    }

    return { type: "ident", value: token };
  })
  .filter(function (token) {
    return token !== null;
  });
}

function makePunctParser(type) {
  return function (state) {
    if (state.pos >= state.len) {
      throw new SyntaxError("Expecting identifier, end-of-input found");
    }

    var token = state.tokens[state.pos];
    if (token.type !== type) {
      throw new SyntaxError("Expecting '" + type + "', found: " + token.type);
    }
    state.pos += 1;

    return type;
  };
}

var colonParser = makePunctParser(":");
var openCurlyParser = makePunctParser("{");
var closeCurlyParser = makePunctParser("}");
var semicolonParser = makePunctParser(";");
var openParenParser = makePunctParser("(");
var closeParenParser = makePunctParser(")");
var openBracketParser = makePunctParser("[");
var closeBracketParser = makePunctParser("]");
var recKeywordParser = makePunctParser("rec");
var arrowParser = makePunctParser("->");

function nameParser(state) {
  if (state.pos >= state.len) {
    throw new SyntaxError("Expecting identifier, end-of-input found");
  }

  var token = state.tokens[state.pos];
  if (token.type !== "ident") {
    throw new SyntaxError("Expecting 'ident', found: " + token.type);
  }
  state.pos += 1;

  return token.value;
}

function recursiveParser(state) {
  recKeywordParser(state);
  var name = nameParser(state);
  arrowParser(state);
  var value = typeParser(state); // eslint-disable-line no-use-before-define
  return {
    type: "recursive",
    name: name,
    arg: value,
  };
}

function recordParser(state) {
  openCurlyParser(state);

  var token = state.tokens[state.pos];
  if (token && token.type === "}") {
    closeCurlyParser(state);
    return { type: "record", fields: {} };
  }

  var fields = {};

  while (true) { // eslint-disable-line no-constant-condition
    // read
    var name = nameParser(state);
    colonParser(state);
    var value = typeParser(state); // eslint-disable-line no-use-before-define

    // assign to fields
    fields[name] = value;

    // ending token
    token = state.tokens[state.pos];

    // break if }
    if (token && token.type === "}") {
      closeCurlyParser(state);
      break;
    } else if (token && token.type === ";") {
      semicolonParser(state);
    } else {
      throw new SyntaxError("Expecting '}' or ';', found: " + token.type);
    }
  }

  return { type: "record", fields: fields };
}

function postfix(parser, postfixToken, constructor) {
  return function (state) {
    var arg = parser(state);

    var token = state.tokens[state.pos];
    if (token && token.type === postfixToken) {
      state.pos += 1;
      return {
        type: constructor,
        arg: arg,
      };
    } else {
      return arg;
    }
  };
}

// this ties the knot
var optionalParser = postfix(terminalParser, "?", "optional"); // eslint-disable-line no-use-before-define

function applicationParser(state) {
  var rator = optionalParser(state);
  var rands = [];

  while (true) { // eslint-disable-line no-constant-condition
    var pos = state.pos;
    // XXX: we shouldn't use exceptions for this
    try {
      var arg = optionalParser(state);
      rands.push(arg);
    } catch (err) {
      state.pos = pos;
      break;
    }
  }

  if (rands.length === 0) {
    return rator;
  } else {
    return {
      type: "application",
      callee: rator,
      args: rands,
    };
  }
}

function separatedBy(parser, separator, constructor) {
  return function (state) {
    var list = [parser(state)];
    while (true) { // eslint-disable-line no-constant-condition
      // separator
      var token = state.tokens[state.pos];
      if (token && token.type === separator) {
        state.pos += 1;
      } else {
        break;
      }

      // right argument
      list.push(parser(state));
    }

    if (list.length === 1) {
      return list[0];
    } else {
      return {
        type: constructor,
        args: list,
      };
    }
  };
}

var conjunctionParser = separatedBy(applicationParser, "&", "conjunction");
var disjunctionParser = separatedBy(conjunctionParser, "|", "disjunction");

// TODO: combine with optional
var variadicParser = postfix(disjunctionParser, "...", "variadic");

function namedParser(state) {
  var token1 = state.tokens[state.pos];
  var token2 = state.tokens[state.pos + 1];
  if (token1 && token2 && token1.type === "ident" && token2.type === ":") {
    state.pos += 2;
    var arg = namedParser(state);
    return {
      type: "named",
      name: token1.value,
      arg: arg,
    };
  } else {
    return variadicParser(state);
  }
}

var productParser = separatedBy(namedParser, ",", "product");

function functionParser(state) {
  var v = productParser(state);

  var token = state.tokens[state.pos];
  if (token && token.type === "->") {
    state.pos += 1;
    var result = functionParser(state);
    return {
      type: "function",
      arg: v,
      result: result,
    };
  } else {
    return v;
  }
}

function typeParser(state) {
  return functionParser(state);
}

function parenthesesParser(state) {
  openParenParser(state);
  var type = typeParser(state);
  closeParenParser(state);
  return type;
}

function bracketParser(state) {
  openBracketParser(state);
  var type = typeParser(state);
  closeBracketParser(state);
  return {
    type: "brackets",
    arg: type,
  };
}

function terminalParser(state) {
  if (state.pos >= state.len) {
    throw new SyntaxError("Expecting terminal, end-of-input found");
  }

  var token = state.tokens[state.pos];
  switch (token.type) {
    case "false":
    case "true":
    case "unit":
    case "string":
    case "number":
    case "bool":
    case "ident":
      state.pos += 1;
      return token;
    case "{":
      return recordParser(state);
    case "(":
      return parenthesesParser(state);
    case "[":
      return bracketParser(state);
    case "rec":
      return recursiveParser(state);
    default:
      throw new SyntaxError("Expecting terminal, " + token.type + " found");
  }
}

function parse(input) {
  // console.log(input);
  var tokens = lex(input);
  // console.log(tokens);
  var state = {
    pos: 0,
    len: tokens.length,
    tokens: tokens,
  };

  var res = typeParser(state);
  // console.log(state);
  if (state.pos !== state.len) {
    throw new SyntaxError("expecting end-of-input, " + tokens[state.pos].type + " found");
  }
  return res;
}

function recordFreeVars(fields) {
  var res = [];
  for (var k in fields) {
    var t = fields[k];
    res = res.concat(freeVarsImpl(t)); // eslint-disable-line no-use-before-define
  }
  return res;
}

function concatFreeVars(ts) {
  var res = [];
  for (var i = 0; i < ts.length; i++) {
    var t = ts[i];
    res = res.concat(freeVarsImpl(t)); // eslint-disable-line no-use-before-define
  }
  return res;
}

function freeVarsImpl(t) {
  switch (t.type) {
    case "false":
    case "true":
    case "unit":
    case "string":
    case "number":
    case "bool":
      return [];
    case "ident": return [t.value];
    case "record": return recordFreeVars(t.fields);
    case "named": return freeVarsImpl(t.arg);
    case "conjunction": return concatFreeVars(t.args);
    case "disjunction": return concatFreeVars(t.args);
    case "product": return concatFreeVars(t.args);
    case "recursive": return freeVarsImpl(t.arg).filter(function (n) {
      return n !== t.name;
    });
    case "optional": return freeVarsImpl(t.arg);
    case "brackets": return freeVarsImpl(t.arg);
    case "variadic": return freeVarsImpl(t.arg);
    case "application": return freeVarsImpl(t.callee).concat(concatFreeVars(t.args));
    case "function": return freeVarsImpl(t.arg).concat(freeVarsImpl(t.result));
    //default: throw new Error("Unknown type " + t.type);
  }
}

function uniq(arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    var x = arr[i];
    if (res.indexOf(x) === -1) {
      res.push(x);
    }
  }
  return res;
}

function freeVars(t) {
  var fvs = freeVarsImpl(t);
  fvs.sort();
  return uniq(fvs);
}

parse.freeVars = freeVars;

var parser = parse;

/**
  ### DSL for input parameters

  There is a small DSL to help with `forall`. For example the two definitions below are equivalent:
  ```js
  var bool_fn_applied_thrice = jsc.forall("bool -> bool", "bool", check);
  var bool_fn_applied_thrice = jsc.forall(jsc.fn(jsc.bool), jsc.bool, check);
  ```

  The DSL is based on a subset of language recognized by [typify-parser](https://github.com/phadej/typify-parser):
  - *identifiers* are fetched from the predefined environment.
  - *applications* are applied as one could expect: `"array bool"` is evaluated to `jsc.array(jsc.bool)`.
  - *functions* are supported: `"bool -> bool"` is evaluated to `jsc.fn(jsc.bool)`.
  - *square brackets* are treated as a shorthand for the array type: `"[nat]"` is evaluated to `jsc.array(jsc.nat)`.
  - *union*: `"bool | nat"` is evaluated to `jsc.sum([jsc.bool, jsc.nat])`.
      - **Note** `oneof` cannot be shrunk, because the union is untagged, we don't know which shrink to use.
  - *conjunction*: `"bool & nat"` is evaluated to `jsc.tuple(jsc.bool, jsc.nat)`.
  - *anonymous records*: `"{ b: bool; n: nat }"` is evaluated to `jsc.record({ b: jsc.bool, n: jsc.nat })`.
  - *EXPERIMENTAL: recursive types*: `"rec list -> unit | (nat & list)"`.
*/









// Forward declarations
var compileType;
var compileTypeArray;

function compileIdent(env, type) {
  var g = env[type.value];
  if (!g) {
    throw new Error("Unknown arbitrary: " + type.value);
  }
  return g;
}

function compileApplication(env, type) {
  var callee = compileType(env, type.callee);
  var args = compileTypeArray(env, type.args);

  return callee.apply(undefined, args);
}

function compileFunction(env, type) {
  // we don't care about argument type
  var result = compileType(env, type.result);
  return fn_1.fn(result);
}

function compileBrackets(env, type) {
  var arg = compileType(env, type.arg);
  return array_1.array(arg);
}

function compileDisjunction(env, type) {
  var args = compileTypeArray(env, type.args);
  return arbitrary.sum(args);
}

function compileConjunction(env, type) {
  var args = compileTypeArray(env, type.args);
  return arbitrary.tuple(args);
}

function compileRecord(env, type) {
  // TODO: use mapValues
  var spec = {};
  Object.keys(type.fields).forEach(function (key) {
    spec[key] = compileType(env, type.fields[key]);
  });
  return record.arbitrary(spec);
}

function compileRecursive(env, type) {
  assert$2(type.arg.type === "disjunction", "recursive type's argument should be disjunction");

  // bound variable
  var name = type.name;

  var par = utils.partition(type.arg.args, function (t) {
    return parser.freeVars(t).indexOf(name) === -1;
  });

  var terminal = par[0];

  if (terminal.length === 0) {
    throw new Error("Recursive type without non-recursive branch");
  }

  var terminalArb = compileType(env, {
    type: "disjunction",
    args: terminal,
  });

  return arbitrary.recursive(terminalArb, function (arb) {
    var arbEnv = {};
    arbEnv[name] = arb;
    var newEnv = utils.merge(env, arbEnv);
    return compileType(newEnv, type.arg);
  });
}

compileType = function compileTypeFn(env, type) {
  switch (type.type) {
    case "ident": return compileIdent(env, type);
    case "application": return compileApplication(env, type);
    case "function": return compileFunction(env, type);
    case "brackets": return compileBrackets(env, type);
    case "disjunction": return compileDisjunction(env, type);
    case "conjunction": return compileConjunction(env, type);
    case "record": return compileRecord(env, type);
    case "number": return type.value;
    case "recursive": return compileRecursive(env, type);
    default: throw new Error("Unsupported typify ast type: " + type.type);
  }
};

compileTypeArray = function compileTypeArrayFn(env, types) {
  return types.map(function (type) {
    return compileType(env, type);
  });
};

function parseTypify(env, str) {
  var type = parser(str);
  return compileType(env, type);
}

var typify = {
  parseTypify: parseTypify,
};

/**
  ### Arbitrary records

  - `record(spec: { key: arbitrary a... }, userenv: env?): arbitrary { key: a... }`

      Generates a javascript object with given record spec.
*/
function recordWithEnv(spec, userenv) {
  var env = userenv ? utils.merge(environment_1, userenv) : environment_1;

  var parsedSpec = {};
  Object.keys(spec).forEach(function (k) {
    var arb = spec[k];
    parsedSpec[k] = typeof arb === "string" ? typify.parseTypify(env, arb) : arb;
  });

  return record.arbitrary(parsedSpec);
}

var recordWithEnv_1 = recordWithEnv;

var api = {
  arbitrary: {
    small: small.arbitrary,
    bless: bless_1,
    record: recordWithEnv_1,
    nonshrink: arbitrary.nonshrink,
    pair: arbitrary.pair,
    either: arbitrary.either,
    unit: arbitrary.unit,
    dict: arbitrary.dict,
    json: arbitrary.json,
    nearray: arbitrary.nearray,
    array: arbitrary.array,
    tuple: arbitrary.tuple,
    sum: arbitrary.sum,
    oneof: arbitrary.oneof,
    recursive: arbitrary.recursive,
    letrec: arbitrary.letrec,
  },
  generator: {
    dict: dict_1.generator,
    json: json_1.json.generator,
    small: small.generator,
    record: record.generator,
  },
  shrink: {
    record: record.shrink,
  },
};

// Re-export stuff from internal modules
/* eslint-disable guard-for-in */
var k;
for (k in primitive) {
  api.arbitrary[k] = primitive[k];
}
for (k in string_1) {
  api.arbitrary[k] = string_1[k];
}
for (k in shrink) {
  api.shrink[k] = shrink[k];
}
for (k in generator) {
  api.generator[k] = generator[k];
}
var api_1 = api;

/**

# trampa

Trampolines, to emulate tail-call recursion.

[![Build Status](https://secure.travis-ci.org/phadej/trampa.svg?branch=master)](http://travis-ci.org/phadej/trampa)
[![NPM version](https://badge.fury.io/js/trampa.svg)](http://badge.fury.io/js/trampa)
[![Dependency Status](https://david-dm.org/trampa/trampa.svg)](https://david-dm.org/trampa/trampa)
[![devDependency Status](https://david-dm.org/trampa/trampa/dev-status.svg)](https://david-dm.org/trampa/trampa#info=devDependencies)
[![Code Climate](https://img.shields.io/codeclimate/github/phadej/trampa.svg)](https://codeclimate.com/github/phadej/trampa)

## Synopsis

```js
var trampa = require("trampa");

function loop(n, acc) {
  return n === 0 ? trampa.wrap(acc) : trampa.lazy(function () {
    return loop(n - 1, acc + 1);
  });
}

loop(123456789, 0).run(); // doesn't cause stack overflow!
```

## API

*/

// loosely based on https://apocalisp.wordpress.com/2011/10/26/tail-call-elimination-in-scala-monads/



function Done(x) {
  this.x = x;
}

function Cont(tramp, cont) {
  assert$2(typeof cont === "function");
  this.tramp = tramp;
  this.cont = cont;
}

/**
- `isTrampoline(t: obj): bool` &mdash; Returns, whether `t` is a trampolined object.
*/
function isTrampoline(t) {
  return t instanceof Done || t instanceof Cont;
}

/**
- `wrap(t: Trampoline a | a): Trampoline a` &mdash; Wrap `t` into trampoline, if it's not already one.
*/
function wrap(t) {
  return isTrampoline(t) ? t : new Done(t);
}

/**
- `lazy(t : () -> Trampoline a | a)` &mdash; Wrap lazy computation into trampoline. Useful when constructing computations.
*/
function lazy(computation) {
  assert$2(typeof computation === "function", "lazy: computation should be function");
  return wrap().jump(computation);
}

/**
- `Trampoline.jump(f : a -> b | Trampoline b)` &mdash; *map* or *flatmap* trampoline computation. Like `.then` for promises.
*/
Done.prototype.jump = function (f) {
  return new Cont(this, function (x) {
    return wrap(f(x));
  });
};

Cont.prototype.jump = Done.prototype.jump;

function execute(curr, params) {
  params = params || {};
  var debug = params.debug || false;
  var log = params.log || console.log;
  var stack = [];

  while (true) { // eslint-disable-line no-constant-condition
    if (debug) {
      log("trampoline execute: stack size " + stack.length);
    }

    if (curr instanceof Done) {
      if (stack.length === 0) {
        return curr.x;
      } else {
        curr = stack[stack.length - 1](curr.x);
        stack.pop();
      }
    } else {
      assert$2(curr instanceof Cont);
      stack.push(curr.cont);
      curr = curr.tramp;
    }
  }
}

/**
- `Trampoline.run(): a` &mdash; Run the trampoline synchronously resulting a value.
*/
Done.prototype.run = Cont.prototype.run = function (params) {
  return execute(this, params);
};

var trampa = {
  isTrampoline: isTrampoline,
  wrap: wrap,
  lazy: lazy,
};

/**
  #### isPromise p : bool

  Optimistic duck-type check for promises.
  Returns `true` if p is an object with `.then` function property.
*/
function isPromise(p) {
  /* eslint-disable no-new-object */
  return new Object(p) === p && typeof p.then === "function";
  /* eslint-enable non-new-object */
}

/**
  #### map (Functor f) => (p : f a) (g : a -> b) : f b

  This is functor map, known as `map` or `fmap`.
  Essentially `f(p)`. If `p` is promise, returns new promise.
  Using `map` makes code look very much [CPS-style](http://en.wikipedia.org/wiki/Continuation-passing_style).
*/
function map(p, g) {
  if (isPromise(p)) {
    return p.then(function (x) {
      return map(x, g);
    });
  } else if (trampa.isTrampoline(p)) {
    return p.jump(function (x) {
      return map(x, g);
    });
  } else {
    return g(p);
  }
}

/**
  #### bind (Functor f) => (k : a -> f b) (xs : a) (h : b -> f c) -> f c

  This is almost monadic bind.
*/
function bind(f, xs, h) {
  var r;
  var exc;
  try {
    r = f.apply(undefined, xs);
  } catch (e) {
    r = false;
    exc = e;
  }

  if (isPromise(r)) {
    return r.then(
      h,
      function (e) {
        // exc is always unset here
        return h(false, e);
      }
    );
  } else {
    return h(r, exc);
  }
}

// recursively unwrap trampoline and promises
function run(x) {
  if (isPromise(x)) {
    return x.then(run);
  } else if (trampa.isTrampoline(x)) {
    return run(x.run());
  } else {
    return x;
  }
}

function pure(x) {
  if (isPromise(x)) {
    return x;
  } else {
    return trampa.wrap(x);
  }
}

var functor = {
  isPromise: isPromise,
  map: map,
  pure: pure,
  bind: bind,
  run: run,
};

/**
  ### Restricting arbitraries

  - `suchthat(arb: arbitrary a, userenv: env?, p : a -> bool): arbitrary a`
      Arbitrary of values that satisfy `p` predicate. It's advised that `p`'s accept rate is high.
*/
function suchthat(arb, userenv, predicate) {
  var env;
  if (arguments.length === 2) {
    predicate = userenv;
    env = environment_1;
  } else {
    env = utils.merge(environment_1, userenv);
  }

  arb = typeof arb === "string" ? typify.parseTypify(env, arb) : arb;
  arb = utils.force(arb);

  return arbitraryBless_1({
    generator: generator.bless(function (size) {
      for (var i = 0; ; i++) {
        // if 5 tries failed, increase size
        if (i > 5) {
          i = 0;
          size += 1;
        }

        var x = arb.generator(size);
        if (predicate(x)) {
          return x;
        }
      }
    }),

    shrink: shrink.bless(function (x) {
      return arb.shrink(x).filter(predicate);
    }),

    show: arb.show,
  });
}

var suchthat_1 = {
  suchthat: suchthat,
};

/**
  ## Documentation

  ### Usage with [mocha](http://mochajs.org/)

  Using jsverify with mocha is easy, just define the properties and use `jsverify.assert`.

  Starting from version 0.4.3 you can write your specs without any boilerplate:

  ```js
  describe("sort", function () {
    jsc.property("idempotent", "array nat", function (arr) {
      return _.isEqual(sort(sort(arr)), sort(arr));
    });
  });
  ```

  Starting from version 0.8.0 you can write the specs in TypeScript. There are
  typings provided. The drawback is that you cannot use type DSL:

  ```typescript
  describe("basic jsverify usage", () => {
    jsc.property("(b && b) === b", jsc.bool, b => (b && b) === b);

    jsc.property("boolean fn thrice", jsc.fn(jsc.bool), jsc.bool, (f, b) =>
      f(f(f(b))) === f(b)
    );
  });
  ```

  You can also provide `--jsverifyRngState state` command line argument, to run tests with particular random generator state.

  ```
  $ mocha examples/nat.js

  1) natural numbers are less than 90:
   Error: Failed after 49 tests and 1 shrinks. rngState: 074e9b5f037a8c21d6; Counterexample: 90;

  $ mocha examples/nat.js --grep 'are less than' --jsverifyRngState 074e9b5f037a8c21d6

  1) natural numbers are less than 90:
     Error: Failed after 1 tests and 1 shrinks. rngState: 074e9b5f037a8c21d6; Counterexample: 90;
  ```

  Erroneous case is found with first try.

  ### Usage with [jasmine](https://jasmine.github.io/)

  Check [jasmineHelpers.js](helpers/jasmineHelpers.js) and [jasmineHelpers2.js](helpers/jasmineHelpers2.js) for jasmine 1.3 and 2.0 respectively.

  ## API Reference

  > _Testing shows the presence, not the absence of bugs._
  >
  > Edsger W. Dijkstra

  To show that propositions hold, we need to construct proofs.
  There are two extremes: proof by example (unit tests) and formal (machine-checked) proof.
  Property-based testing is somewhere in between.
  We formulate propositions, invariants or other properties we believe to hold, but
  only test it to hold for numerous (randomly generated) values.

  Types and function signatures are written in [Coq](http://coq.inria.fr/)/[Haskell](http://www.haskell.org/haskellwiki/Haskell)-influenced style:
  C# -style `List<T> filter(List<T> v, Func<T, bool> predicate)` is represented by
  `filter(v: array T, predicate: T -> bool): array T` in our style.

  Methods and objects live in `jsc` object, e.g. `shrink.bless` method is used by
  ```js
  var jsc = require("jsverify");
  var foo = jsc.shrink.bless(...);
  ```

  Methods starting with `.dot` are prototype methods:
  ```js
  var arb = jsc.nat;
  var arb2 = jsc.nat.smap(f, g);
  ```

  `jsverify` can operate with both synchronous and asynchronous-promise properties.
  Generally every property can be wrapped inside [functor](http://learnyouahaskell.com/functors-applicative-functors-and-monoids),
  for now in either identity or promise functor, for synchronous and promise properties respectively.
*/


















/**
  ### Properties
*/

function shrinkResult(arbs, x, test, size, shrinksN, exc, transform) {
  assert$2(arbs.length === x.length, "shrinkResult: arbs and x has to be of same size");
  assert$2(typeof size === "number", "shrinkResult: size should be number");
  assert$2(typeof shrinksN === "number", "shrinkResult: shrinkN should be number");

  var shrinks = utils.pluck(arbs, "shrink");
  var shows = utils.pluck(arbs, "show");

  var shrinked = shrink.tuple(shrinks, x);

  var shrinkP = lazySeq.fold(shrinked, true, function (y, rest) {
    var t = test(size, y, shrinksN + 1);
    return functor.map(t, function (tprime) {
      return tprime !== true ? tprime : rest();
    });
  });

  return functor.map(shrinkP, function (shrinkPPrime) {
    if (shrinkPPrime === true) {
      var res = {
        counterexample: x,
        counterexamplestr: show.tuple(shows, x),
        shrinks: shrinksN,
        exc: exc,
      };
      return transform(res);
    } else {
      return shrinkPPrime;
    }
  });
}

function isArbitrary(arb) {
  return (typeof arb === "object" || typeof arb === "function") &&
    typeof arb.generator === "function" &&
    typeof arb.shrink === "function" &&
    typeof arb.show === "function";
}

/**
  - `forall(arbs: arbitrary a ..., userenv: (map arbitrary)?, prop : a -> property): property`

      Property constructor
*/
function forall() {
  var args = Array.prototype.slice.call(arguments);
  var gens = args.slice(0, -1);
  var property = args[args.length - 1];
  var env$$1;

  var lastgen = gens[gens.length - 1];

  if (!isArbitrary(lastgen) && typeof lastgen !== "string") {
    env$$1 = utils.merge(environment_1, lastgen);
    gens = gens.slice(0, -1);
  } else {
    env$$1 = environment_1;
  }

  assert$2(gens.length > 0, "forall requires at least single generator");

  // Map typify-dsl to hard generators
  gens = gens.map(function (g) {
    g = typeof g === "string" ? typify.parseTypify(env$$1, g) : g;
    return utils.force(g);
  });

  assert$2(typeof property === "function", "property should be a function");

  function test(size, x, shrinks) {
    assert$2(Array.isArray(x), "generators results should be always tuple");

    return functor.bind(property, x, function (r, exc) {
      if (r === true) {
        return true;
      } else if (typeof r === "function") {
        var rRec = r(size);

        return functor.map(rRec, function (rRecPrime) {
          if (rRecPrime === true) {
            return true;
          } else {
            return shrinkResult(gens, x, test, size, shrinks, exc, function (rr) {
              return {
                counterexample: rr.counterexample.concat(rRecPrime.counterexample),
                counterexamplestr: rr.counterexamplestr, // + "; " + rRec.counterexamplestr,
                shrinks: rr.shrinks,
                exc: rr.exc || rRecPrime.exc,
              };
            });
          }
        });
      } else {
        return shrinkResult(gens, x, test, size, shrinks, exc || r, utils.identity);
      }
    });
  }

  return function (size) {
    var x = gens.map(function (arb) { return arb.generator(size); });
    var r = test(size, x, 0);
    return r;
  };
}

function formatFailedCase(r, state, includeStack) {
  var msg = "Failed after " + r.tests + " tests and " + r.shrinks + " shrinks. ";
  msg += "rngState: " + (r.rngState || state) + "; ";
  msg += "Counterexample: " + r.counterexamplestr + "; ";
  if (r.exc) {
    if (r.exc instanceof Error) {
      msg += "Exception: " + r.exc.message;
      if (includeStack) {
        msg += "\nStack trace: " + r.exc.stack;
      }
    } else {
      msg += "Error: " + r.exc;
    }
  }
  return msg;
}

function findRngState(argv$$1) { // eslint-disable-line consistent-return
  for (var i = 0; i < argv$$1.length - 1; i++) {
    if (argv$$1[i] === "--jsverifyRngState") {
      return argv$$1[i + 1];
    }
  }
}

/**
  - `check (prop: property, opts: checkoptions?): result`

      Run random checks for given `prop`. If `prop` is promise based, result is also wrapped in promise.

      Options:
      - `opts.tests` - test count to run, default 100
      - `opts.size`  - maximum size of generated values, default 50
      - `opts.quiet` - do not `console.log`
      - `opts.rngState` - state string for the rng

      The `result` is `true` if check succeeds, otherwise it's an object with various fields:
      - `counterexample` - an input for which property fails.
      - `tests` - number of tests run before failing case is found
      - `shrinks` - number of shrinks performed
      - `exc` - an optional exception thrown by property function
      - `rngState` - random number generator's state before execution of the property
*/
function check(property, opts) {
  opts = opts || {};
  opts.size = opts.size || 50;
  opts.tests = opts.tests || 100;
  opts.quiet = opts.quiet || false;

  assert$2(typeof property === "function", "property should be a function");

  var state;

  if (opts.rngState) {
    random.setStateString(opts.rngState);
  } else if (typeof process !== "undefined") {
    var argvState = findRngState(process.argv);
    if (argvState) {
      random.setStateString(argvState);
    }
  }

  function loop(i) {
    state = random.currentStateString();
    if (i > opts.tests) {
      return true;
    }

    var size = random(0, opts.size);

    // wrap non-promises in trampoline
    var r = functor.pure(property(size));

    return functor.map(r, function (rPrime) {
      if (rPrime === true) {
        return loop(i + 1);
      } else {
        rPrime.tests = i;
        /* global console */
        if (!opts.quiet) {
          console.error(formatFailedCase(rPrime, state, true), rPrime.counterexample);
        }
        return rPrime;
      }
    });
  }

  return functor.run(functor.map(loop(1), function (r) {
    if (r === true) {
      if (!opts.quiet) { console.info("OK, passed " + opts.tests + " tests"); }
    } else {
      r.rngState = state;
    }

    return r;
  }));
}

/**
  - `assert(prop: property, opts: checkoptions?) : void`

      Same as `check`, but throw exception if property doesn't hold.
*/
function checkThrow(property, opts) {
  opts = opts || {};
  if (opts.quiet === undefined) {
    opts.quiet = true;
  }

  return functor.run(functor.map(check(property, opts), function (r) {
    if (r !== true) {
      if (r.exc instanceof Error) {
        r.exc.message = formatFailedCase(r);
        throw r.exc;
      } else {
        throw new Error(formatFailedCase(r));
      }
    }
  }));
}

/**
   - `property(name: string, ...)`

      Assuming there is globally defined `it`, the same as:

      ```js
      it(name, function () {
        jsc.assert(jsc.forall(...));
      }
      ```

      You can use `property` to write facts too:
      ```js
      jsc.property("+0 === -0", function () {
        return +0 === -0;
      });
      ```
*/
function bddProperty(name) {
  /* global it: true */
  var args = Array.prototype.slice.call(arguments, 1);
  if (args.length === 1) {
    it(name, function () {
      return functor.run(functor.map(args[0](), function (result) { // eslint-disable-line consistent-return
        if (typeof result === "function") {
          return checkThrow(result);
        } else if (result !== true) {
          throw new Error(name + " doesn't hold");
        }
      }));
    });
  } else {
    var prop = forall.apply(undefined, args);
    it(name, function () {
      return checkThrow(prop);
    });
  }
  /* global it: false */
}

/**
  - `compile(desc: string, env: typeEnv?): arbitrary a`

      Compile the type description in provided type environment, or default one.
*/
function compile(str, env$$1) {
  env$$1 = env$$1 ? utils.merge(environment_1, env$$1) : environment_1;
  return typify.parseTypify(env$$1, str);
}

/**
  - `sampler(arb: arbitrary a, genSize: nat = 10): (sampleSize: nat?) -> a`

      Create a sampler for a given arbitrary with an optional size. Handy when used in
      a REPL:
      ```
      > jsc = require('jsverify') // or require('./lib/jsverify') w/in the project
      ...
      > jsonSampler = jsc.sampler(jsc.json, 4)
      [Function]
      > jsonSampler()
      0.08467432763427496
      > jsonSampler()
      [ [ [] ] ]
      > jsonSampler()
      ''
      > sampledJson(2)
      [-0.4199344692751765, false]
      ```
*/
function sampler(arb, size) {
  size = typeof size === "number" ? Math.abs(size) : 10;
  return function (count) {
    if (typeof count === "number") {
      var acc = [];
      count = Math.abs(count);
      for (var i = 0; i < count; i++) {
        acc.push(arb.generator(size));
      }
      return acc;
    } else {
      return arb.generator(size);
    }
  };
}

/**
  - `throws(block: () -> a, error: class?, message: string?): bool`

    Executes nullary function `block`. Returns `true` if `block` throws. See [assert.throws](https://nodejs.org/api/assert.html#assert_assert_throws_block_error_message)
*/
function throws$1(block, error, message) {
  assert$2(error === undefined || typeof error === "function", "throws: error parameter must be a constructor");
  assert$2(message === undefined || typeof message === "string", "throws: message parameter must be a string");

  try {
    block();
    return false;
  } catch (e) {
    if (error !== undefined) {
      if (e instanceof error) {
        return message === undefined || e.message === message;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}

/**
  - `assertForall(arbs: arbitrary a ..., userenv: (map arbitrary)?, prop : a -> property): void`

     Combines 'assert' and 'forall'.
     Constructs a property with forall from arguments, then throws an exception if the property doesn't hold.
     Options for 'assert' cannot be set here - use assert(forall(...)) if you need that.
*/
function assertForall() {
  return checkThrow(forall.apply(null, arguments));
}

/**
  - `checkForall(arbs: arbitrary a ..., userenv: (map arbitrary)?, prop : a -> property): result`

    Combines 'check' and 'forall'.
    Constructs a property with forall from arguments, and returns a value based on if the property holds or not.
    See 'check' for description of return value.

    Options for 'check' cannot be set here - use check(forall(...)) if you need that.
*/
function checkForall() {
  return check(forall.apply(null, arguments));
}

/**
  ### Types

  - `generator a` is a function `(size: nat) -> a`.
  - `show` is a function `a -> string`.
  - `shrink` is a function `a -> [a]`, returning *smaller* values.
  - `arbitrary a` is a triple of generator, shrink and show functions.
      - `{ generator: nat -> a, shrink : a -> array a, show: a -> string }`

  ### Blessing

  We chose to represent generators and shrinks by functions, yet we would
  like to have additional methods on them. Thus we *bless* objects with
  additional properties.

  Usually you don't need to bless anything explicitly, as all combinators
  return blessed values.

  See [perldoc for bless](http://perldoc.perl.org/functions/bless.html).
*/

/// include ./typify.js
/// include ./arbitraryBless.js
/// include ./bless.js
/// include ./primitive.js
/// include ./arbitrary.js
/// include ./recordWithEnv.js
/// include ./record.js
/// include ./string.js
/// include ./fn.js
/// include ./small.js
/// include ./suchthat.js
/// include ./generator.js
/// include ./shrink.js
/// include ./show.js
/// include ./random.js
/// include ./either.js
/// include ./utils.js

// Export
var jsc = {
  forall: forall,
  check: check,
  assert: checkThrow,
  assertForall: assertForall,
  checkForall: checkForall,
  property: bddProperty,
  sampler: sampler,
  throws: throws$1,

  // generators
  fn: fn_1.fn,
  fun: fn_1.fn,
  suchthat: suchthat_1.suchthat,

  // either
  left: either.left,
  right: either.right,

  // sum
  addend: sum.addend,

  // compile
  compile: compile,

  generator: api_1.generator,
  shrink: api_1.shrink,

  // internal utility lib
  random: random,

  show: show,
  utils: utils,
  _: {
    FMap: finitemap,
  },
};

/* primitives */
/* eslint-disable guard-for-in */
for (var k$1 in api_1.arbitrary) {
  jsc[k$1] = api_1.arbitrary[k$1];
}
/* eslint-enable guard-for-in */

var jsverify = jsc;

export default jsverify;
