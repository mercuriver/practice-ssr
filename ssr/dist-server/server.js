"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _server = require("react-dom/server");

var _react = _interopRequireDefault(require("react"));

var url = _interopRequireWildcard(require("url"));

var _App = _interopRequireDefault(require("./App"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var html = _fs["default"].readFileSync(_path["default"].resolve(__dirname, '../dist/index.html'), 'utf8');

app.use('/dist', _express["default"]["static"]('dist'));
app.get('/favicon.ico', function (req, res) {
  return res.sendStatus(204);
});
app.get('*', function (req, res) {
  var parsedUrl = url.parse(req.url, true);
  var page = parsedUrl.pathname !== '/' ? parsedUrl.pathname.substr(1) : 'home';
  var renderString = (0, _server.renderToString)( /*#__PURE__*/_react["default"].createElement(_App["default"], {
    page: page
  }));
  var initialData = {
    page: page
  };
  var result = html.replace('<div id="root"></div>', "<div id=\"root\">".concat(renderString, "</div>")).replace('__DATA_FROM_SERVER__', JSON.stringify(initialData));
  res.send(result);
});
app.listen(3000);