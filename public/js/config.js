const _protocol = window.location.protocol;
const _wsProtocol = _protocol === 'https:' ? 'wss:' : 'ws:';
const _host = window.location.host;

const HTTP_BASE = `${_protocol}//${_host}`;
const WS_BASE = `${_wsProtocol}//${_host}`;
