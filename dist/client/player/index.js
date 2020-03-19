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
      return new _promise2.default(function (resolve, reject) {
        if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
          window.DeviceMotionEvent.requestPermission().then(function (response) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJib2R5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiY29uZmlnIiwiYXBwQ29udGFpbmVyIiwic291bmR3b3Jrc0NvbmZpZyIsImNsaWVudCIsImluaXQiLCJjbGllbnRUeXBlIiwic2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rIiwiaWQiLCJpbnN0YW5jZSIsInNlcnZpY2VWaWV3cyIsImhhcyIsInZpZXciLCJnZXQiLCJwbGF0Zm9ybVNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlcXVpcmUiLCJhZGRGZWF0dXJlRGVmaW5pdGlvbiIsImNoZWNrIiwicGxhdGZvcm0iLCJpc01vYmlsZSIsImludGVyYWN0aW9uSG9vayIsInJlc29sdmUiLCJyZWplY3QiLCJEZXZpY2VNb3Rpb25FdmVudCIsInJlcXVlc3RQZXJtaXNzaW9uIiwidGhlbiIsInJlc3BvbnNlIiwiY2F0Y2giLCJhc3NldHNEb21haW4iLCJzaGFyZWRTeW50aENvbmZpZyIsImV4cGVyaWVuY2UiLCJQbGF5ZXJFeHBlcmllbmNlIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTs7SUFBWUEsVTs7QUFDWjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBQ0E7QUFDQTs7O0FBR0E7QUFDQUMsT0FBT0MsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBTTtBQUNwQ0MsV0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCQyxNQUF4QixDQUErQixTQUEvQjs7QUFFQSxNQUFNQyxTQUFTLHNCQUFjLEVBQUVDLGNBQWMsWUFBaEIsRUFBZCxFQUE4Q1AsT0FBT1EsZ0JBQXJELENBQWY7QUFDQVQsYUFBV1UsTUFBWCxDQUFrQkMsSUFBbEIsQ0FBdUJKLE9BQU9LLFVBQTlCLEVBQTBDTCxNQUExQzs7QUFFQVAsYUFBV1UsTUFBWCxDQUFrQkcsMkJBQWxCLENBQThDLFVBQUNDLEVBQUQsRUFBS0MsUUFBTCxFQUFrQjtBQUM5RCxRQUFJQyx1QkFBYUMsR0FBYixDQUFpQkgsRUFBakIsQ0FBSixFQUNFQyxTQUFTRyxJQUFULEdBQWdCRix1QkFBYUcsR0FBYixDQUFpQkwsRUFBakIsRUFBcUJQLE1BQXJCLENBQWhCO0FBQ0gsR0FIRDs7QUFLQSxNQUFNYSxrQkFBa0JwQixXQUFXcUIsY0FBWCxDQUEwQkMsT0FBMUIsQ0FBa0MsVUFBbEMsQ0FBeEI7O0FBRUFGLGtCQUFnQkcsb0JBQWhCLENBQXFDO0FBQ25DVCxRQUFJLGVBRCtCO0FBRW5DVSxXQUFPLGlCQUFZO0FBQ2pCLGFBQU94QixXQUFXVSxNQUFYLENBQWtCZSxRQUFsQixDQUEyQkMsUUFBbEMsQ0FEaUIsQ0FDMkI7QUFDN0MsS0FKa0M7QUFLbkNDLG1CQUxtQyw2QkFLakI7QUFDaEIsYUFBTyxzQkFBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsWUFBSSxPQUFPNUIsT0FBTzZCLGlCQUFQLENBQXlCQyxpQkFBaEMsS0FBc0QsVUFBMUQsRUFBc0U7QUFDcEU5QixpQkFBTzZCLGlCQUFQLENBQXlCQyxpQkFBekIsR0FDR0MsSUFESCxDQUNRLG9CQUFZO0FBQ2hCLGdCQUFJQyxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCTCxzQkFBUSxJQUFSO0FBQ0QsYUFGRCxNQUVPO0FBQ0xBLHNCQUFRLEtBQVI7QUFDRDtBQUNGLFdBUEgsRUFRR00sS0FSSCxDQVFTLGVBQU87QUFDWk4sb0JBQVEsS0FBUjtBQUNELFdBVkg7QUFXRCxTQVpELE1BWU87QUFDTEEsa0JBQVEsSUFBUjtBQUNEO0FBQ0YsT0FoQk0sQ0FBUDtBQWlCRDtBQXZCa0MsR0FBckM7O0FBMEJBO0FBdkNvQyxNQXdDNUJPLFlBeEM0QixHQXdDUTVCLE1BeENSLENBd0M1QjRCLFlBeEM0QjtBQUFBLE1Bd0NkQyxpQkF4Q2MsR0F3Q1E3QixNQXhDUixDQXdDZDZCLGlCQXhDYzs7QUF5Q3BDLE1BQU1DLGFBQWEsSUFBSUMsMEJBQUosQ0FBcUJILFlBQXJCLEVBQW1DQyxpQkFBbkMsQ0FBbkI7O0FBRUE7QUFDQXBDLGFBQVdVLE1BQVgsQ0FBa0I2QixLQUFsQjtBQUNELENBN0NEOztBQVRBO0FBTkEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgY2xpZW50IHNpZGUgc291bmR3b3JrcyBhbmQgcGxheWVyIGV4cGVyaWVuY2VcbmltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IFBsYXllckV4cGVyaWVuY2UgZnJvbSAnLi9QbGF5ZXJFeHBlcmllbmNlLmpzJztcbmltcG9ydCB2aWV3VGVtcGxhdGVzIGZyb20gJy4uL3NoYXJlZC92aWV3VGVtcGxhdGVzJztcbmltcG9ydCB2aWV3Q29udGVudCBmcm9tICcuLi9zaGFyZWQvdmlld0NvbnRlbnQnO1xuXG4vLyBhcHBsaWNhdGlvbiBzZXJ2aWNlc1xuaW1wb3J0IEdyb3VwRmlsdGVyIGZyb20gJy4uL3NoYXJlZC9zZXJ2aWNlcy9Hcm91cEZpbHRlcic7XG5pbXBvcnQgSW1hZ2VNYW5hZ2VyIGZyb20gJy4uL3NoYXJlZC9zZXJ2aWNlcy9JbWFnZU1hbmFnZXInO1xuaW1wb3J0IHNlcnZpY2VWaWV3cyBmcm9tICcuLi9zaGFyZWQvc2VydmljZVZpZXdzJztcbi8vIHBsYXllciBzcGVjaWZpY1xuLy8gaW1wb3J0IFBsYXRmb3JtQWx0IGZyb20gJy5zZXJ2aWNlcy9QbGF0Zm9ybUFsdCc7IC8vIG92ZXJyaWRlIHBsYXRmb3JtIHRvIGFkZCByZW5kZXJlclxuXG5cbi8vIGxhdW5jaCBhcHBsaWNhdGlvbiB3aGVuIGRvY3VtZW50IGlzIGZ1bGx5IGxvYWRlZFxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpO1xuXG4gIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oeyBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyB9LCB3aW5kb3cuc291bmR3b3Jrc0NvbmZpZyk7XG4gIHNvdW5kd29ya3MuY2xpZW50LmluaXQoY29uZmlnLmNsaWVudFR5cGUsIGNvbmZpZyk7XG5cbiAgc291bmR3b3Jrcy5jbGllbnQuc2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rKChpZCwgaW5zdGFuY2UpID0+IHtcbiAgICBpZiAoc2VydmljZVZpZXdzLmhhcyhpZCkpXG4gICAgICBpbnN0YW5jZS52aWV3ID0gc2VydmljZVZpZXdzLmdldChpZCwgY29uZmlnKTtcbiAgfSk7XG5cbiAgY29uc3QgcGxhdGZvcm1TZXJ2aWNlID0gc291bmR3b3Jrcy5zZXJ2aWNlTWFuYWdlci5yZXF1aXJlKCdwbGF0Zm9ybScpO1xuXG4gIHBsYXRmb3JtU2VydmljZS5hZGRGZWF0dXJlRGVmaW5pdGlvbih7XG4gICAgaWQ6ICdkZXZpY2Utc2Vuc29yJyxcbiAgICBjaGVjazogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNvdW5kd29ya3MuY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ib29rKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gJ2dyYW50ZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBjcmVhdGUgY2xpZW50IHNpZGUgKHBsYXllcikgZXhwZXJpZW5jZVxuICBjb25zdCB7IGFzc2V0c0RvbWFpbiwgc2hhcmVkU3ludGhDb25maWcgfSA9IGNvbmZpZztcbiAgY29uc3QgZXhwZXJpZW5jZSA9IG5ldyBQbGF5ZXJFeHBlcmllbmNlKGFzc2V0c0RvbWFpbiwgc2hhcmVkU3ludGhDb25maWcpO1xuXG4gIC8vIHN0YXJ0IHRoZSBjbGllbnRcbiAgc291bmR3b3Jrcy5jbGllbnQuc3RhcnQoKTtcbn0pO1xuIl19