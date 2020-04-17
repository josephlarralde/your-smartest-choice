// import client side soundworks and player experience
import * as soundworks from 'soundworks/client';
import PlayerExperience from './PlayerExperience.js';
import viewTemplates from '../shared/viewTemplates';
import viewContent from '../shared/viewContent';

// application services
import GroupFilter from '../shared/services/GroupFilter';
import ImageManager from '../shared/services/ImageManager';
import serviceViews from '../shared/serviceViews';
// player specific
// import PlatformAlt from '.services/PlatformAlt'; // override platform to add renderer


// launch application when document is fully loaded
window.addEventListener('load', () => {
  document.body.classList.remove('loading');

  const config = Object.assign({ appContainer: '#container' }, window.soundworksConfig);
  soundworks.client.init(config.clientType, config);

  soundworks.client.setServiceInstanciationHook((id, instance) => {
    if (serviceViews.has(id))
      instance.view = serviceViews.get(id, config);
  });

  const platformService = soundworks.serviceManager.require('platform');

  platformService.addFeatureDefinition({
    id: 'device-sensor',
    check: function () {
      return soundworks.client.platform.isMobile; // true if phone or tablet
    },
    interactionHook() {
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
      return new Promise((resolve, reject) => {
        if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
          window.DeviceMotionEvent.requestPermission()
            .then(response => {
              console.log(response);
              if (response == 'granted') {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch(err => {
              resolve(false);
            })
        } else {
          resolve(true);
        }
      });
      //*/
    }
  });

  // create client side (player) experience
  const { assetsDomain, sharedSynthConfig } = config;
  const experience = new PlayerExperience(assetsDomain, sharedSynthConfig);

  // start the client
  soundworks.client.start();
});
