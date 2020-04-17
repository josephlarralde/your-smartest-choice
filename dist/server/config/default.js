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
  // useHttps: false,

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHQuanMiXSwibmFtZXMiOlsiY3dkIiwicHJvY2VzcyIsImFwcE5hbWUiLCJlbnYiLCJrZXlib2FyZE9mZnNldCIsIkJQTSIsInZlcnNpb24iLCJkZWZhdWx0Q2xpZW50IiwiYXNzZXRzRG9tYWluIiwicG9ydCIsInNldHVwIiwiYXJlYSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFja2dyb3VuZCIsImxhYmVscyIsImNvb3JkaW5hdGVzIiwibWF4Q2xpZW50c1BlclBvc2l0aW9uIiwiY2FwYWNpdHkiLCJJbmZpbml0eSIsIndlYnNvY2tldHMiLCJ1cmwiLCJ0cmFuc3BvcnRzIiwidXNlSHR0cHMiLCJodHRwc0luZm9zIiwia2V5IiwiY2VydCIsInBhc3N3b3JkIiwib3NjIiwicmVjZWl2ZUFkZHJlc3MiLCJyZWNlaXZlUG9ydCIsInNlbmRBZGRyZXNzIiwic2VuZFBvcnQiLCJlbmFibGVHWmlwQ29tcHJlc3Npb24iLCJwdWJsaWNEaXJlY3RvcnkiLCJwYXRoIiwiam9pbiIsInRlbXBsYXRlRGlyZWN0b3J5IiwibG9nZ2VyIiwibmFtZSIsImxldmVsIiwic3RyZWFtcyIsInN0cmVhbSIsInN0ZG91dCIsImVycm9yUmVwb3J0ZXJEaXJlY3RvcnkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDQSxJQUFNQSxNQUFNQyxRQUFRRCxHQUFSLEVBQVo7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtrQkFDZTtBQUNiO0FBQ0E7QUFDQUUsV0FBUyxzQkFISTs7QUFLYjtBQUNBQyxPQUFLLGFBTlE7O0FBUWJDLGtCQUFnQixFQVJIOztBQVViQyxPQUFLLEdBVlE7O0FBWWI7QUFDQTtBQUNBQyxXQUFTLE9BZEk7O0FBZ0JiO0FBQ0E7QUFDQUMsaUJBQWUsUUFsQkY7O0FBb0JiO0FBQ0E7QUFDQTtBQUNBQyxnQkFBYyxHQXZCRDs7QUF5QmI7QUFDQUMsUUFBTSxJQTFCTzs7QUE0QmI7QUFDQTtBQUNBO0FBQ0FDLFNBQU87QUFDTEMsVUFBTTtBQUNKQyxhQUFPLENBREg7QUFFSkMsY0FBUSxDQUZKO0FBR0o7QUFDQUMsa0JBQVk7QUFKUixLQUREO0FBT0w7QUFDQUMsWUFBUSxJQVJIO0FBU0w7QUFDQUMsaUJBQWEsSUFWUjtBQVdMO0FBQ0FDLDJCQUF1QixDQVpsQjtBQWFMO0FBQ0E7QUFDQUMsY0FBVUM7QUFmTCxHQS9CTTs7QUFpRGI7QUFDQUMsY0FBWTtBQUNWQyxTQUFLLEVBREs7QUFFVkMsZ0JBQVksQ0FBQyxXQUFEO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBVLEdBbERDOztBQTREYjtBQUNBO0FBQ0E7QUFDQUMsWUFBVSxJQS9ERztBQWdFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQUMsY0FBWTtBQUNWQyxTQUFLLElBREs7QUFFVkMsVUFBTTtBQUZJLEdBckVDOztBQTBFYjtBQUNBQyxZQUFVLEVBM0VHOztBQTZFYjtBQUNBQyxPQUFLO0FBQ0g7QUFDQUMsb0JBQWdCLFdBRmI7QUFHSDtBQUNBQyxpQkFBYSxLQUpWO0FBS0g7QUFDQUMsaUJBQWEsV0FOVjtBQU9IO0FBQ0FDLGNBQVU7QUFSUCxHQTlFUTs7QUF5RmI7QUFDQUMseUJBQXVCLElBMUZWOztBQTRGYjtBQUNBQyxtQkFBaUJDLGVBQUtDLElBQUwsQ0FBVXBDLEdBQVYsRUFBZSxRQUFmLENBN0ZKOztBQStGYjtBQUNBcUMscUJBQW1CRixlQUFLQyxJQUFMLENBQVVwQyxHQUFWLEVBQWUsTUFBZixDQWhHTjs7QUFrR2I7QUFDQXNDLFVBQVE7QUFDTkMsVUFBTSxZQURBO0FBRU5DLFdBQU8sTUFGRDtBQUdOQyxhQUFTLENBQUM7QUFDUkQsYUFBTyxNQURDO0FBRVJFLGNBQVF6QyxRQUFRMEM7QUFGUixLQUFEO0FBSEgsR0FuR0s7O0FBK0diO0FBQ0FDLDBCQUF3QlQsZUFBS0MsSUFBTCxDQUFVcEMsR0FBVixFQUFlLE1BQWYsRUFBdUIsU0FBdkI7QUFoSFgsQyIsImZpbGUiOiJkZWZhdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5jb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5cbi8vIENvbmZpZ3VyYXRpb24gb2YgdGhlIGFwcGxpY2F0aW9uLlxuLy8gT3RoZXIgZW50cmllcyBjYW4gYmUgYWRkZWQgKGFzIGxvbmcgYXMgdGhlaXIgbmFtZSBkb2Vzbid0IGNvbmZsaWN0IHdpdGhcbi8vIGV4aXN0aW5nIG9uZXMpIHRvIGRlZmluZSBnbG9iYWwgcGFyYW1ldGVycyBvZiB0aGUgYXBwbGljYXRpb24gKGUuZy4gQlBNLFxuLy8gc3ludGggcGFyYW1ldGVycykgdGhhdCBjYW4gdGhlbiBiZSBzaGFyZWQgZWFzaWx5IGFtb25nIGFsbCBjbGllbnRzIHVzaW5nXG4vLyB0aGUgYHNoYXJlZC1jb25maWdgIHNlcnZpY2UuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIG5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uLCB1c2VkIGluIHRoZSBgLmVqc2AgdGVtcGxhdGUgYW5kIGJ5IGRlZmF1bHQgaW5cbiAgLy8gdGhlIGBwbGF0Zm9ybWAgc2VydmljZSB0byBwb3B1bGF0ZSBpdHMgdmlld1xuICBhcHBOYW1lOiAnWW91ciBTbWFydGVzdCBDaG9pY2UnLFxuXG4gIC8vIG5hbWUgb2YgdGhlIGVudmlyb25uZW1lbnQgKCdwcm9kdWN0aW9uJyBlbmFibGUgY2FjaGUgaW4gZXhwcmVzcyBhcHBsaWNhdGlvbilcbiAgZW52OiAnZGV2ZWxvcG1lbnQnLFxuXG4gIGtleWJvYXJkT2Zmc2V0OiAxMSxcblxuICBCUE06IDEwMCxcblxuICAvLyB2ZXJzaW9uIG9mIGFwcGxpY2F0aW9uLCBjYW4gYmUgdXNlZCB0byBmb3JjZSByZWxvYWQgY3NzIGFuZCBqcyBmaWxlc1xuICAvLyBmcm9tIHNlcnZlciAoY2YuIGBodG1sL2RlZmF1bHQuZWpzYClcbiAgdmVyc2lvbjogJzAuMC4xJyxcblxuICAvLyBuYW1lIG9mIHRoZSBkZWZhdWx0IGNsaWVudCB0eXBlLCBpLmUuIHRoZSBjbGllbnQgdGhhdCBjYW4gYWNjZXNzIHRoZVxuICAvLyBhcHBsaWNhdGlvbiBhdCBpdHMgcm9vdCBVUkxcbiAgZGVmYXVsdENsaWVudDogJ3BsYXllcicsXG5cbiAgLy8gZGVmaW5lIGZyb20gd2hlcmUgdGhlIGFzc2V0cyAoc3RhdGljIGZpbGVzKSBzaG91bGQgYmUgbG9hZGVkLCB0aGVzZSB2YWx1ZVxuICAvLyBjb3VsZCBhbHNvIHJlZmVyIHRvIGEgc2VwYXJhdGUgc2VydmVyIGZvciBzY2FsYWJpbGl0eSByZWFzb25zLiBUaGlzIHZhbHVlXG4gIC8vIHNob3VsZCBhbHNvIGJlIHVzZWQgY2xpZW50LXNpZGUgdG8gY29uZmlndXJlIHRoZSBgbG9hZGVyYCBzZXJ2aWNlLlxuICBhc3NldHNEb21haW46ICcvJyxcblxuICAvLyBwb3J0IHVzZWQgdG8gb3BlbiB0aGUgaHR0cCBzZXJ2ZXIsIGluIHByb2R1Y3Rpb24gdGhpcyB2YWx1ZSBpcyB0eXBpY2FsbHkgODBcbiAgcG9ydDogODAwMCxcblxuICAvLyBkZXNjcmliZSB0aGUgbG9jYXRpb24gd2hlcmUgdGhlIGV4cGVyaWVuY2UgdGFrZXMgcGxhY2VzLCB0aGVzZXMgdmFsdWVzIGFyZVxuICAvLyB1c2VkIGJ5IHRoZSBgcGxhY2VyYCwgYGNoZWNraW5gIGFuZCBgbG9jYXRvcmAgc2VydmljZXMuXG4gIC8vIGlmIG9uZSBvZiB0aGVzZSBzZXJ2aWNlIGlzIHJlcXVpcmVkLCB0aGlzIGVudHJ5IHNob3VsZG4ndCBiZSByZW1vdmVkLlxuICBzZXR1cDoge1xuICAgIGFyZWE6IHtcbiAgICAgIHdpZHRoOiAxLFxuICAgICAgaGVpZ2h0OiAxLFxuICAgICAgLy8gcGF0aCB0byBhbiBpbWFnZSB0byBiZSB1c2VkIGluIHRoZSBhcmVhIHJlcHJlc2VudGF0aW9uXG4gICAgICBiYWNrZ3JvdW5kOiBudWxsLFxuICAgIH0sXG4gICAgLy8gbGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVsc1xuICAgIGxhYmVsczogbnVsbCxcbiAgICAvLyBsaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMgZ2l2ZW4gYXMgYW4gYXJyYXkgb2YgYFt4Ok51bWJlciwgeTpOdW1iZXJdYFxuICAgIGNvb3JkaW5hdGVzOiBudWxsLFxuICAgIC8vIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgYWxsb3dlZCBpbiBhIHBvc2l0aW9uXG4gICAgbWF4Q2xpZW50c1BlclBvc2l0aW9uOiAxLFxuICAgIC8vIG1heGltdW0gbnVtYmVyIG9mIHBvc2l0aW9ucyAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZlxuICAgIC8vIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpXG4gICAgY2FwYWNpdHk6IEluZmluaXR5LFxuICB9LFxuXG4gIC8vIHNvY2tldC5pbyBjb25maWd1cmF0aW9uXG4gIHdlYnNvY2tldHM6IHtcbiAgICB1cmw6ICcnLFxuICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgLy8gQG5vdGU6IEVuZ2luZUlPIGRlZmF1bHRzXG4gICAgLy8gcGluZ1RpbWVvdXQ6IDMwMDAsXG4gICAgLy8gcGluZ0ludGVydmFsOiAxMDAwLFxuICAgIC8vIHVwZ3JhZGVUaW1lb3V0OiAxMDAwMCxcbiAgICAvLyBtYXhIdHRwQnVmZmVyU2l6ZTogMTBFNyxcbiAgfSxcblxuICAvLyBkZWZpbmUgaWYgdGhlIEhUVFAgc2VydmVyIHNob3VsZCBiZSBsYXVuY2hlZCB1c2luZyBzZWN1cmUgY29ubmVjdGlvbnMuXG4gIC8vIEZvciBkZXZlbG9wbWVudCBwdXJwb3NlcyB3aGVuIHNldCB0byBgdHJ1ZWAgYW5kIG5vIGNlcnRpZmljYXRlcyBhcmUgZ2l2ZW5cbiAgLy8gKGNmLiBgaHR0cHNJbmZvc2ApLCBhIHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlIGlzIGNyZWF0ZWQuXG4gIHVzZUh0dHBzOiB0cnVlLFxuICAvLyB1c2VIdHRwczogZmFsc2UsXG5cbiAgLy8gcGF0aHMgdG8gdGhlIGtleSBhbmQgY2VydGlmaWNhdGUgdG8gYmUgdXNlZCBpbiBvcmRlciB0byBsYXVuY2ggdGhlIGh0dHBzXG4gIC8vIHNlcnZlci4gQm90aCBlbnRyaWVzIGFyZSByZXF1aXJlZCBvdGhlcndpc2UgYSBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZVxuICAvLyBpcyBnZW5lcmF0ZWQuXG4gIGh0dHBzSW5mb3M6IHtcbiAgICBrZXk6IG51bGwsXG4gICAgY2VydDogbnVsbCxcbiAgfSxcblxuICAvLyBwYXNzd29yZCB0byBiZSB1c2VkIGJ5IHRoZSBgYXV0aGAgc2VydmljZVxuICBwYXNzd29yZDogJycsXG5cbiAgLy8gY29uZmlndXJhdGlvbiBvZiB0aGUgYG9zY2Agc2VydmljZVxuICBvc2M6IHtcbiAgICAvLyBJUCBvZiB0aGUgY3VycmVudGx5IHJ1bm5pbmcgbm9kZSBzZXJ2ZXJcbiAgICByZWNlaXZlQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgLy8gcG9ydCBsaXN0ZW5pbmcgZm9yIGluY29tbWluZyBtZXNzYWdlc1xuICAgIHJlY2VpdmVQb3J0OiA1NzEyMSxcbiAgICAvLyBJUCBvZiB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uXG4gICAgc2VuZEFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIC8vIHBvcnQgd2hlcmUgdGhlIHJlbW90ZSBhcHBsaWNhdGlvbiBpcyBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzXG4gICAgc2VuZFBvcnQ6IDU3MTIwLFxuICB9LFxuXG4gIC8vIGRlZmluZSBpZiB0aGUgc2VydmVyIHNob3VsZCB1c2UgZ3ppcCBjb21wcmVzc2lvbiBmb3Igc3RhdGljIGZpbGVzXG4gIGVuYWJsZUdaaXBDb21wcmVzc2lvbjogdHJ1ZSxcblxuICAvLyBsb2NhdGlvbiBvZiB0aGUgcHVibGljIGRpcmVjdG9yeSAoYWNjZXNzaWJsZSB0aHJvdWdoIGh0dHAocykgcmVxdWVzdHMpXG4gIHB1YmxpY0RpcmVjdG9yeTogcGF0aC5qb2luKGN3ZCwgJ3B1YmxpYycpLFxuXG4gIC8vIGRpcmVjdG9yeSB3aGVyZSB0aGUgc2VydmVyIHRlbXBsYXRpbmcgc3lzdGVtIGxvb2tzIGZvciB0aGUgYGVqc2AgdGVtcGxhdGVzXG4gIHRlbXBsYXRlRGlyZWN0b3J5OiBwYXRoLmpvaW4oY3dkLCAnaHRtbCcpLFxuXG4gIC8vIGJ1bnlhbiBjb25maWd1cmF0aW9uXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKiB7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgcGF0aDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdsb2dzJywgJ3NvdW5kd29ya3MubG9nJyksXG4gICAgfSAqL11cbiAgfSxcblxuICAvLyBkaXJlY3Rvcnkgd2hlcmUgZXJyb3IgcmVwb3J0ZWQgZnJvbSB0aGUgY2xpZW50cyBhcmUgd3JpdHRlblxuICBlcnJvclJlcG9ydGVyRGlyZWN0b3J5OiBwYXRoLmpvaW4oY3dkLCAnbG9ncycsICdjbGllbnRzJyksXG59XG4iXX0=