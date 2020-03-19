'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

// Configuration of the application.
// Other entries can be added (as long as their name doesn't conflict with
// existing ones) to define global parameters of the application (e.g. BPM,
// synth parameters) that can then be shared easily among all clients using
// the `shared-config` service.
exports.default = {
  // name of the application, used in the `.ejs` template and by default in
  // the `platform` service to populate its view
  appName: 'Your Smartest Choice',

  // name of the environnement ('production' enable cache in express application)
  env: 'development',

  keyboardOffset: 11,

  BPM: 100,

  // version of application, can be used to force reload css and js files
  // from server (cf. `html/default.ejs`)
  version: '0.0.1',

  // name of the default client type, i.e. the client that can access the
  // application at its root URL
  defaultClient: 'player',

  // define from where the assets (static files) should be loaded, these value
  // could also refer to a separate server for scalability reasons. This value
  // should also be used client-side to configure the `loader` service.
  assetsDomain: '/',

  // port used to open the http server, in production this value is typically 80
  port: 8000,

  // describe the location where the experience takes places, theses values are
  // used by the `placer`, `checkin` and `locator` services.
  // if one of these service is required, this entry shouldn't be removed.
  setup: {
    area: {
      width: 1,
      height: 1,
      // path to an image to be used in the area representation
      background: null
    },
    // list of predefined labels
    labels: null,
    // list of predefined coordinates given as an array of `[x:Number, y:Number]`
    coordinates: null,
    // maximum number of clients allowed in a position
    maxClientsPerPosition: 1,
    // maximum number of positions (may limit or be limited by the number of
    // labels and/or coordinates)
    capacity: Infinity
  },

  // socket.io configuration
  websockets: {
    url: '',
    transports: ['websocket']
    // @note: EngineIO defaults
    // pingTimeout: 3000,
    // pingInterval: 1000,
    // upgradeTimeout: 10000,
    // maxHttpBufferSize: 10E7,
  },

  // define if the HTTP server should be launched using secure connections.
  // For development purposes when set to `true` and no certificates are given
  // (cf. `httpsInfos`), a self-signed certificate is created.
  useHttps: true,

  // paths to the key and certificate to be used in order to launch the https
  // server. Both entries are required otherwise a self-signed certificate
  // is generated.
  httpsInfos: {
    key: null,
    cert: null
  },

  // password to be used by the `auth` service
  password: '',

  // configuration of the `osc` service
  osc: {
    // IP of the currently running node server
    receiveAddress: '127.0.0.1',
    // port listening for incomming messages
    receivePort: 57121,
    // IP of the remote application
    sendAddress: '127.0.0.1',
    // port where the remote application is listening for messages
    sendPort: 57120
  },

  // define if the server should use gzip compression for static files
  enableGZipCompression: true,

  // location of the public directory (accessible through http(s) requests)
  publicDirectory: _path2.default.join(cwd, 'public'),

  // directory where the server templating system looks for the `ejs` templates
  templateDirectory: _path2.default.join(cwd, 'html'),

  // bunyan configuration
  logger: {
    name: 'soundworks',
    level: 'info',
    streams: [{
      level: 'info',
      stream: process.stdout
    }]
  },

  // directory where error reported from the clients are written
  errorReporterDirectory: _path2.default.join(cwd, 'logs', 'clients')
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHQuanMiXSwibmFtZXMiOlsiY3dkIiwicHJvY2VzcyIsImFwcE5hbWUiLCJlbnYiLCJrZXlib2FyZE9mZnNldCIsIkJQTSIsInZlcnNpb24iLCJkZWZhdWx0Q2xpZW50IiwiYXNzZXRzRG9tYWluIiwicG9ydCIsInNldHVwIiwiYXJlYSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFja2dyb3VuZCIsImxhYmVscyIsImNvb3JkaW5hdGVzIiwibWF4Q2xpZW50c1BlclBvc2l0aW9uIiwiY2FwYWNpdHkiLCJJbmZpbml0eSIsIndlYnNvY2tldHMiLCJ1cmwiLCJ0cmFuc3BvcnRzIiwidXNlSHR0cHMiLCJodHRwc0luZm9zIiwia2V5IiwiY2VydCIsInBhc3N3b3JkIiwib3NjIiwicmVjZWl2ZUFkZHJlc3MiLCJyZWNlaXZlUG9ydCIsInNlbmRBZGRyZXNzIiwic2VuZFBvcnQiLCJlbmFibGVHWmlwQ29tcHJlc3Npb24iLCJwdWJsaWNEaXJlY3RvcnkiLCJwYXRoIiwiam9pbiIsInRlbXBsYXRlRGlyZWN0b3J5IiwibG9nZ2VyIiwibmFtZSIsImxldmVsIiwic3RyZWFtcyIsInN0cmVhbSIsInN0ZG91dCIsImVycm9yUmVwb3J0ZXJEaXJlY3RvcnkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDQSxJQUFNQSxNQUFNQyxRQUFRRCxHQUFSLEVBQVo7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtrQkFDZTtBQUNiO0FBQ0E7QUFDQUUsV0FBUyxzQkFISTs7QUFLYjtBQUNBQyxPQUFLLGFBTlE7O0FBUWJDLGtCQUFnQixFQVJIOztBQVViQyxPQUFLLEdBVlE7O0FBWWI7QUFDQTtBQUNBQyxXQUFTLE9BZEk7O0FBZ0JiO0FBQ0E7QUFDQUMsaUJBQWUsUUFsQkY7O0FBb0JiO0FBQ0E7QUFDQTtBQUNBQyxnQkFBYyxHQXZCRDs7QUF5QmI7QUFDQUMsUUFBTSxJQTFCTzs7QUE0QmI7QUFDQTtBQUNBO0FBQ0FDLFNBQU87QUFDTEMsVUFBTTtBQUNKQyxhQUFPLENBREg7QUFFSkMsY0FBUSxDQUZKO0FBR0o7QUFDQUMsa0JBQVk7QUFKUixLQUREO0FBT0w7QUFDQUMsWUFBUSxJQVJIO0FBU0w7QUFDQUMsaUJBQWEsSUFWUjtBQVdMO0FBQ0FDLDJCQUF1QixDQVpsQjtBQWFMO0FBQ0E7QUFDQUMsY0FBVUM7QUFmTCxHQS9CTTs7QUFpRGI7QUFDQUMsY0FBWTtBQUNWQyxTQUFLLEVBREs7QUFFVkMsZ0JBQVksQ0FBQyxXQUFEO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBVLEdBbERDOztBQTREYjtBQUNBO0FBQ0E7QUFDQUMsWUFBVSxJQS9ERzs7QUFpRWI7QUFDQTtBQUNBO0FBQ0FDLGNBQVk7QUFDVkMsU0FBSyxJQURLO0FBRVZDLFVBQU07QUFGSSxHQXBFQzs7QUF5RWI7QUFDQUMsWUFBVSxFQTFFRzs7QUE0RWI7QUFDQUMsT0FBSztBQUNIO0FBQ0FDLG9CQUFnQixXQUZiO0FBR0g7QUFDQUMsaUJBQWEsS0FKVjtBQUtIO0FBQ0FDLGlCQUFhLFdBTlY7QUFPSDtBQUNBQyxjQUFVO0FBUlAsR0E3RVE7O0FBd0ZiO0FBQ0FDLHlCQUF1QixJQXpGVjs7QUEyRmI7QUFDQUMsbUJBQWlCQyxlQUFLQyxJQUFMLENBQVVwQyxHQUFWLEVBQWUsUUFBZixDQTVGSjs7QUE4RmI7QUFDQXFDLHFCQUFtQkYsZUFBS0MsSUFBTCxDQUFVcEMsR0FBVixFQUFlLE1BQWYsQ0EvRk47O0FBaUdiO0FBQ0FzQyxVQUFRO0FBQ05DLFVBQU0sWUFEQTtBQUVOQyxXQUFPLE1BRkQ7QUFHTkMsYUFBUyxDQUFDO0FBQ1JELGFBQU8sTUFEQztBQUVSRSxjQUFRekMsUUFBUTBDO0FBRlIsS0FBRDtBQUhILEdBbEdLOztBQThHYjtBQUNBQywwQkFBd0JULGVBQUtDLElBQUwsQ0FBVXBDLEdBQVYsRUFBZSxNQUFmLEVBQXVCLFNBQXZCO0FBL0dYLEMiLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKTtcblxuXG4vLyBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbi5cbi8vIE90aGVyIGVudHJpZXMgY2FuIGJlIGFkZGVkIChhcyBsb25nIGFzIHRoZWlyIG5hbWUgZG9lc24ndCBjb25mbGljdCB3aXRoXG4vLyBleGlzdGluZyBvbmVzKSB0byBkZWZpbmUgZ2xvYmFsIHBhcmFtZXRlcnMgb2YgdGhlIGFwcGxpY2F0aW9uIChlLmcuIEJQTSxcbi8vIHN5bnRoIHBhcmFtZXRlcnMpIHRoYXQgY2FuIHRoZW4gYmUgc2hhcmVkIGVhc2lseSBhbW9uZyBhbGwgY2xpZW50cyB1c2luZ1xuLy8gdGhlIGBzaGFyZWQtY29uZmlnYCBzZXJ2aWNlLlxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyBuYW1lIG9mIHRoZSBhcHBsaWNhdGlvbiwgdXNlZCBpbiB0aGUgYC5lanNgIHRlbXBsYXRlIGFuZCBieSBkZWZhdWx0IGluXG4gIC8vIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UgdG8gcG9wdWxhdGUgaXRzIHZpZXdcbiAgYXBwTmFtZTogJ1lvdXIgU21hcnRlc3QgQ2hvaWNlJyxcblxuICAvLyBuYW1lIG9mIHRoZSBlbnZpcm9ubmVtZW50ICgncHJvZHVjdGlvbicgZW5hYmxlIGNhY2hlIGluIGV4cHJlc3MgYXBwbGljYXRpb24pXG4gIGVudjogJ2RldmVsb3BtZW50JyxcblxuICBrZXlib2FyZE9mZnNldDogMTEsXG5cbiAgQlBNOiAxMDAsXG5cbiAgLy8gdmVyc2lvbiBvZiBhcHBsaWNhdGlvbiwgY2FuIGJlIHVzZWQgdG8gZm9yY2UgcmVsb2FkIGNzcyBhbmQganMgZmlsZXNcbiAgLy8gZnJvbSBzZXJ2ZXIgKGNmLiBgaHRtbC9kZWZhdWx0LmVqc2ApXG4gIHZlcnNpb246ICcwLjAuMScsXG5cbiAgLy8gbmFtZSBvZiB0aGUgZGVmYXVsdCBjbGllbnQgdHlwZSwgaS5lLiB0aGUgY2xpZW50IHRoYXQgY2FuIGFjY2VzcyB0aGVcbiAgLy8gYXBwbGljYXRpb24gYXQgaXRzIHJvb3QgVVJMXG4gIGRlZmF1bHRDbGllbnQ6ICdwbGF5ZXInLFxuXG4gIC8vIGRlZmluZSBmcm9tIHdoZXJlIHRoZSBhc3NldHMgKHN0YXRpYyBmaWxlcykgc2hvdWxkIGJlIGxvYWRlZCwgdGhlc2UgdmFsdWVcbiAgLy8gY291bGQgYWxzbyByZWZlciB0byBhIHNlcGFyYXRlIHNlcnZlciBmb3Igc2NhbGFiaWxpdHkgcmVhc29ucy4gVGhpcyB2YWx1ZVxuICAvLyBzaG91bGQgYWxzbyBiZSB1c2VkIGNsaWVudC1zaWRlIHRvIGNvbmZpZ3VyZSB0aGUgYGxvYWRlcmAgc2VydmljZS5cbiAgYXNzZXRzRG9tYWluOiAnLycsXG5cbiAgLy8gcG9ydCB1c2VkIHRvIG9wZW4gdGhlIGh0dHAgc2VydmVyLCBpbiBwcm9kdWN0aW9uIHRoaXMgdmFsdWUgaXMgdHlwaWNhbGx5IDgwXG4gIHBvcnQ6IDgwMDAsXG5cbiAgLy8gZGVzY3JpYmUgdGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBleHBlcmllbmNlIHRha2VzIHBsYWNlcywgdGhlc2VzIHZhbHVlcyBhcmVcbiAgLy8gdXNlZCBieSB0aGUgYHBsYWNlcmAsIGBjaGVja2luYCBhbmQgYGxvY2F0b3JgIHNlcnZpY2VzLlxuICAvLyBpZiBvbmUgb2YgdGhlc2Ugc2VydmljZSBpcyByZXF1aXJlZCwgdGhpcyBlbnRyeSBzaG91bGRuJ3QgYmUgcmVtb3ZlZC5cbiAgc2V0dXA6IHtcbiAgICBhcmVhOiB7XG4gICAgICB3aWR0aDogMSxcbiAgICAgIGhlaWdodDogMSxcbiAgICAgIC8vIHBhdGggdG8gYW4gaW1hZ2UgdG8gYmUgdXNlZCBpbiB0aGUgYXJlYSByZXByZXNlbnRhdGlvblxuICAgICAgYmFja2dyb3VuZDogbnVsbCxcbiAgICB9LFxuICAgIC8vIGxpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHNcbiAgICBsYWJlbHM6IG51bGwsXG4gICAgLy8gbGlzdCBvZiBwcmVkZWZpbmVkIGNvb3JkaW5hdGVzIGdpdmVuIGFzIGFuIGFycmF5IG9mIGBbeDpOdW1iZXIsIHk6TnVtYmVyXWBcbiAgICBjb29yZGluYXRlczogbnVsbCxcbiAgICAvLyBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQgaW4gYSBwb3NpdGlvblxuICAgIG1heENsaWVudHNQZXJQb3NpdGlvbjogMSxcbiAgICAvLyBtYXhpbXVtIG51bWJlciBvZiBwb3NpdGlvbnMgKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2ZcbiAgICAvLyBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKVxuICAgIGNhcGFjaXR5OiBJbmZpbml0eSxcbiAgfSxcblxuICAvLyBzb2NrZXQuaW8gY29uZmlndXJhdGlvblxuICB3ZWJzb2NrZXRzOiB7XG4gICAgdXJsOiAnJyxcbiAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIC8vIEBub3RlOiBFbmdpbmVJTyBkZWZhdWx0c1xuICAgIC8vIHBpbmdUaW1lb3V0OiAzMDAwLFxuICAgIC8vIHBpbmdJbnRlcnZhbDogMTAwMCxcbiAgICAvLyB1cGdyYWRlVGltZW91dDogMTAwMDAsXG4gICAgLy8gbWF4SHR0cEJ1ZmZlclNpemU6IDEwRTcsXG4gIH0sXG5cbiAgLy8gZGVmaW5lIGlmIHRoZSBIVFRQIHNlcnZlciBzaG91bGQgYmUgbGF1bmNoZWQgdXNpbmcgc2VjdXJlIGNvbm5lY3Rpb25zLlxuICAvLyBGb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMgd2hlbiBzZXQgdG8gYHRydWVgIGFuZCBubyBjZXJ0aWZpY2F0ZXMgYXJlIGdpdmVuXG4gIC8vIChjZi4gYGh0dHBzSW5mb3NgKSwgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZSBpcyBjcmVhdGVkLlxuICB1c2VIdHRwczogdHJ1ZSxcblxuICAvLyBwYXRocyB0byB0aGUga2V5IGFuZCBjZXJ0aWZpY2F0ZSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIGxhdW5jaCB0aGUgaHR0cHNcbiAgLy8gc2VydmVyLiBCb3RoIGVudHJpZXMgYXJlIHJlcXVpcmVkIG90aGVyd2lzZSBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlXG4gIC8vIGlzIGdlbmVyYXRlZC5cbiAgaHR0cHNJbmZvczoge1xuICAgIGtleTogbnVsbCxcbiAgICBjZXJ0OiBudWxsLFxuICB9LFxuXG4gIC8vIHBhc3N3b3JkIHRvIGJlIHVzZWQgYnkgdGhlIGBhdXRoYCBzZXJ2aWNlXG4gIHBhc3N3b3JkOiAnJyxcblxuICAvLyBjb25maWd1cmF0aW9uIG9mIHRoZSBgb3NjYCBzZXJ2aWNlXG4gIG9zYzoge1xuICAgIC8vIElQIG9mIHRoZSBjdXJyZW50bHkgcnVubmluZyBub2RlIHNlcnZlclxuICAgIHJlY2VpdmVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICAvLyBwb3J0IGxpc3RlbmluZyBmb3IgaW5jb21taW5nIG1lc3NhZ2VzXG4gICAgcmVjZWl2ZVBvcnQ6IDU3MTIxLFxuICAgIC8vIElQIG9mIHRoZSByZW1vdGUgYXBwbGljYXRpb25cbiAgICBzZW5kQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgLy8gcG9ydCB3aGVyZSB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uIGlzIGxpc3RlbmluZyBmb3IgbWVzc2FnZXNcbiAgICBzZW5kUG9ydDogNTcxMjAsXG4gIH0sXG5cbiAgLy8gZGVmaW5lIGlmIHRoZSBzZXJ2ZXIgc2hvdWxkIHVzZSBnemlwIGNvbXByZXNzaW9uIGZvciBzdGF0aWMgZmlsZXNcbiAgZW5hYmxlR1ppcENvbXByZXNzaW9uOiB0cnVlLFxuXG4gIC8vIGxvY2F0aW9uIG9mIHRoZSBwdWJsaWMgZGlyZWN0b3J5IChhY2Nlc3NpYmxlIHRocm91Z2ggaHR0cChzKSByZXF1ZXN0cylcbiAgcHVibGljRGlyZWN0b3J5OiBwYXRoLmpvaW4oY3dkLCAncHVibGljJyksXG5cbiAgLy8gZGlyZWN0b3J5IHdoZXJlIHRoZSBzZXJ2ZXIgdGVtcGxhdGluZyBzeXN0ZW0gbG9va3MgZm9yIHRoZSBgZWpzYCB0ZW1wbGF0ZXNcbiAgdGVtcGxhdGVEaXJlY3Rvcnk6IHBhdGguam9pbihjd2QsICdodG1sJyksXG5cbiAgLy8gYnVueWFuIGNvbmZpZ3VyYXRpb25cbiAgbG9nZ2VyOiB7XG4gICAgbmFtZTogJ3NvdW5kd29ya3MnLFxuICAgIGxldmVsOiAnaW5mbycsXG4gICAgc3RyZWFtczogW3tcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBzdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICAgIH0sIC8qIHtcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICB9ICovXVxuICB9LFxuXG4gIC8vIGRpcmVjdG9yeSB3aGVyZSBlcnJvciByZXBvcnRlZCBmcm9tIHRoZSBjbGllbnRzIGFyZSB3cml0dGVuXG4gIGVycm9yUmVwb3J0ZXJEaXJlY3Rvcnk6IHBhdGguam9pbihjd2QsICdsb2dzJywgJ2NsaWVudHMnKSxcbn1cbiJdfQ==