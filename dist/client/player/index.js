'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _PlayerExperience = require('./PlayerExperience.js');

var _PlayerExperience2 = _interopRequireDefault(_PlayerExperience);

var _viewTemplates = require('../shared/viewTemplates');

var _viewTemplates2 = _interopRequireDefault(_viewTemplates);

var _viewContent = require('../shared/viewContent');

var _viewContent2 = _interopRequireDefault(_viewContent);

var _GroupFilter = require('../shared/services/GroupFilter');

var _GroupFilter2 = _interopRequireDefault(_GroupFilter);

var _ImageManager = require('../shared/services/ImageManager');

var _ImageManager2 = _interopRequireDefault(_ImageManager);

var _serviceViews = require('../shared/serviceViews');

var _serviceViews2 = _interopRequireDefault(_serviceViews);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// player specific
// import PlatformAlt from '.services/PlatformAlt'; // override platform to add renderer


// launch application when document is fully loaded
window.addEventListener('load', function () {
  document.body.classList.remove('loading');

  var config = (0, _assign2.default)({ appContainer: '#container' }, window.soundworksConfig);
  soundworks.client.init(config.clientType, config);

  soundworks.client.setServiceInstanciationHook(function (id, instance) {
    if (_serviceViews2.default.has(id)) instance.view = _serviceViews2.default.get(id, config);
  });

  var platformService = soundworks.serviceManager.require('platform');

  platformService.addFeatureDefinition({
    id: 'device-sensor',
    check: function check() {
      return soundworks.client.platform.isMobile; // true if phone or tablet
    },
    interactionHook: function interactionHook() {
      // console.log(soundworks.client.platform.os);
      // console.log(DeviceMotionEvent);
      // console.log(window.DeviceMotionEvent);
      // DeviceMotionEvent.requestPermission().then(response => {
      //   console.log(response);
      // });
      // window.addEventListener('devicemotion', e => {
      //   console.log(e);
      // });
      // return Promise.resolve(true);
      /*
        if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
          console.log(window.DeviceMotionEvent.requestPermission());
        }
      //*/

      //*
      return new _promise2.default(function (resolve, reject) {
        if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
          window.DeviceMotionEvent.requestPermission().then(function (response) {
            console.log(response);
            if (response == 'granted') {
              resolve(true);
            } else {
              resolve(false);
            }
          }).catch(function (err) {
            resolve(false);
          });
        } else {
          resolve(true);
        }
      });
      //*/
    }
  });

  // create client side (player) experience
  var assetsDomain = config.assetsDomain,
      sharedSynthConfig = config.sharedSynthConfig;

  var experience = new _PlayerExperience2.default(assetsDomain, sharedSynthConfig);

  // start the client
  soundworks.client.start();
});

// application services
// import client side soundworks and player experience
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJib2R5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiY29uZmlnIiwiYXBwQ29udGFpbmVyIiwic291bmR3b3Jrc0NvbmZpZyIsImNsaWVudCIsImluaXQiLCJjbGllbnRUeXBlIiwic2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rIiwiaWQiLCJpbnN0YW5jZSIsInNlcnZpY2VWaWV3cyIsImhhcyIsInZpZXciLCJnZXQiLCJwbGF0Zm9ybVNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlcXVpcmUiLCJhZGRGZWF0dXJlRGVmaW5pdGlvbiIsImNoZWNrIiwicGxhdGZvcm0iLCJpc01vYmlsZSIsImludGVyYWN0aW9uSG9vayIsInJlc29sdmUiLCJyZWplY3QiLCJEZXZpY2VNb3Rpb25FdmVudCIsInJlcXVlc3RQZXJtaXNzaW9uIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJyZXNwb25zZSIsImNhdGNoIiwiYXNzZXRzRG9tYWluIiwic2hhcmVkU3ludGhDb25maWciLCJleHBlcmllbmNlIiwiUGxheWVyRXhwZXJpZW5jZSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0E7O0lBQVlBLFU7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUNBO0FBQ0E7OztBQUdBO0FBQ0FDLE9BQU9DLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFlBQU07QUFDcENDLFdBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QkMsTUFBeEIsQ0FBK0IsU0FBL0I7O0FBRUEsTUFBTUMsU0FBUyxzQkFBYyxFQUFFQyxjQUFjLFlBQWhCLEVBQWQsRUFBOENQLE9BQU9RLGdCQUFyRCxDQUFmO0FBQ0FULGFBQVdVLE1BQVgsQ0FBa0JDLElBQWxCLENBQXVCSixPQUFPSyxVQUE5QixFQUEwQ0wsTUFBMUM7O0FBRUFQLGFBQVdVLE1BQVgsQ0FBa0JHLDJCQUFsQixDQUE4QyxVQUFDQyxFQUFELEVBQUtDLFFBQUwsRUFBa0I7QUFDOUQsUUFBSUMsdUJBQWFDLEdBQWIsQ0FBaUJILEVBQWpCLENBQUosRUFDRUMsU0FBU0csSUFBVCxHQUFnQkYsdUJBQWFHLEdBQWIsQ0FBaUJMLEVBQWpCLEVBQXFCUCxNQUFyQixDQUFoQjtBQUNILEdBSEQ7O0FBS0EsTUFBTWEsa0JBQWtCcEIsV0FBV3FCLGNBQVgsQ0FBMEJDLE9BQTFCLENBQWtDLFVBQWxDLENBQXhCOztBQUVBRixrQkFBZ0JHLG9CQUFoQixDQUFxQztBQUNuQ1QsUUFBSSxlQUQrQjtBQUVuQ1UsV0FBTyxpQkFBWTtBQUNqQixhQUFPeEIsV0FBV1UsTUFBWCxDQUFrQmUsUUFBbEIsQ0FBMkJDLFFBQWxDLENBRGlCLENBQzJCO0FBQzdDLEtBSmtDO0FBS25DQyxtQkFMbUMsNkJBS2pCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0EsYUFBTyxzQkFBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsWUFBSSxPQUFPNUIsT0FBTzZCLGlCQUFQLENBQXlCQyxpQkFBaEMsS0FBc0QsVUFBMUQsRUFBc0U7QUFDcEU5QixpQkFBTzZCLGlCQUFQLENBQXlCQyxpQkFBekIsR0FDR0MsSUFESCxDQUNRLG9CQUFZO0FBQ2hCQyxvQkFBUUMsR0FBUixDQUFZQyxRQUFaO0FBQ0EsZ0JBQUlBLFlBQVksU0FBaEIsRUFBMkI7QUFDekJQLHNCQUFRLElBQVI7QUFDRCxhQUZELE1BRU87QUFDTEEsc0JBQVEsS0FBUjtBQUNEO0FBQ0YsV0FSSCxFQVNHUSxLQVRILENBU1MsZUFBTztBQUNaUixvQkFBUSxLQUFSO0FBQ0QsV0FYSDtBQVlELFNBYkQsTUFhTztBQUNMQSxrQkFBUSxJQUFSO0FBQ0Q7QUFDRixPQWpCTSxDQUFQO0FBa0JBO0FBQ0Q7QUExQ2tDLEdBQXJDOztBQTZDQTtBQTFEb0MsTUEyRDVCUyxZQTNENEIsR0EyRFE5QixNQTNEUixDQTJENUI4QixZQTNENEI7QUFBQSxNQTJEZEMsaUJBM0RjLEdBMkRRL0IsTUEzRFIsQ0EyRGQrQixpQkEzRGM7O0FBNERwQyxNQUFNQyxhQUFhLElBQUlDLDBCQUFKLENBQXFCSCxZQUFyQixFQUFtQ0MsaUJBQW5DLENBQW5COztBQUVBO0FBQ0F0QyxhQUFXVSxNQUFYLENBQWtCK0IsS0FBbEI7QUFDRCxDQWhFRDs7QUFUQTtBQU5BIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IGNsaWVudCBzaWRlIHNvdW5kd29ya3MgYW5kIHBsYXllciBleHBlcmllbmNlXG5pbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBQbGF5ZXJFeHBlcmllbmNlIGZyb20gJy4vUGxheWVyRXhwZXJpZW5jZS5qcyc7XG5pbXBvcnQgdmlld1RlbXBsYXRlcyBmcm9tICcuLi9zaGFyZWQvdmlld1RlbXBsYXRlcyc7XG5pbXBvcnQgdmlld0NvbnRlbnQgZnJvbSAnLi4vc2hhcmVkL3ZpZXdDb250ZW50JztcblxuLy8gYXBwbGljYXRpb24gc2VydmljZXNcbmltcG9ydCBHcm91cEZpbHRlciBmcm9tICcuLi9zaGFyZWQvc2VydmljZXMvR3JvdXBGaWx0ZXInO1xuaW1wb3J0IEltYWdlTWFuYWdlciBmcm9tICcuLi9zaGFyZWQvc2VydmljZXMvSW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBzZXJ2aWNlVmlld3MgZnJvbSAnLi4vc2hhcmVkL3NlcnZpY2VWaWV3cyc7XG4vLyBwbGF5ZXIgc3BlY2lmaWNcbi8vIGltcG9ydCBQbGF0Zm9ybUFsdCBmcm9tICcuc2VydmljZXMvUGxhdGZvcm1BbHQnOyAvLyBvdmVycmlkZSBwbGF0Zm9ybSB0byBhZGQgcmVuZGVyZXJcblxuXG4vLyBsYXVuY2ggYXBwbGljYXRpb24gd2hlbiBkb2N1bWVudCBpcyBmdWxseSBsb2FkZWRcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblxuICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHsgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicgfSwgd2luZG93LnNvdW5kd29ya3NDb25maWcpO1xuICBzb3VuZHdvcmtzLmNsaWVudC5pbml0KGNvbmZpZy5jbGllbnRUeXBlLCBjb25maWcpO1xuXG4gIHNvdW5kd29ya3MuY2xpZW50LnNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vaygoaWQsIGluc3RhbmNlKSA9PiB7XG4gICAgaWYgKHNlcnZpY2VWaWV3cy5oYXMoaWQpKVxuICAgICAgaW5zdGFuY2UudmlldyA9IHNlcnZpY2VWaWV3cy5nZXQoaWQsIGNvbmZpZyk7XG4gIH0pO1xuXG4gIGNvbnN0IHBsYXRmb3JtU2VydmljZSA9IHNvdW5kd29ya3Muc2VydmljZU1hbmFnZXIucmVxdWlyZSgncGxhdGZvcm0nKTtcblxuICBwbGF0Zm9ybVNlcnZpY2UuYWRkRmVhdHVyZURlZmluaXRpb24oe1xuICAgIGlkOiAnZGV2aWNlLXNlbnNvcicsXG4gICAgY2hlY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzb3VuZHdvcmtzLmNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICB9LFxuICAgIGludGVyYWN0aW9uSG9vaygpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNvdW5kd29ya3MuY2xpZW50LnBsYXRmb3JtLm9zKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKERldmljZU1vdGlvbkV2ZW50KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudCk7XG4gICAgICAvLyBEZXZpY2VNb3Rpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgLy8gICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAvLyB9KTtcbiAgICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBlID0+IHtcbiAgICAgIC8vICAgY29uc29sZS5sb2coZSk7XG4gICAgICAvLyB9KTtcbiAgICAgIC8vIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAvKlxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpKTtcbiAgICAgICAgfVxuICAgICAgLy8qL1xuXG4gICAgICAvLypcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkRldmljZU1vdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgd2luZG93LkRldmljZU1vdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKClcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gJ2dyYW50ZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyovXG4gICAgfVxuICB9KTtcblxuICAvLyBjcmVhdGUgY2xpZW50IHNpZGUgKHBsYXllcikgZXhwZXJpZW5jZVxuICBjb25zdCB7IGFzc2V0c0RvbWFpbiwgc2hhcmVkU3ludGhDb25maWcgfSA9IGNvbmZpZztcbiAgY29uc3QgZXhwZXJpZW5jZSA9IG5ldyBQbGF5ZXJFeHBlcmllbmNlKGFzc2V0c0RvbWFpbiwgc2hhcmVkU3ludGhDb25maWcpO1xuXG4gIC8vIHN0YXJ0IHRoZSBjbGllbnRcbiAgc291bmR3b3Jrcy5jbGllbnQuc3RhcnQoKTtcbn0pO1xuIl19