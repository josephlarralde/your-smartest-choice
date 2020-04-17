import { Experience } from 'soundworks/server';

class ControllerExperience extends Experience {
  constructor(clientTypes, options = {}) {
    super(clientTypes);

    this.sharedParams = this.require('shared-params');
    this.errorReporter = this.require('error-reporter');

    if (options.auth)
      this.auth = this.require('auth');
  }

  start() {
    this.errorReporter.addListener('error', (file, line, col, msg, userAgent) => {
      this.broadcast('controller', null, 'log', 'error', file, line, col, msg, userAgent);
    });

    // this is how we get all important information about a shared param :
    // console.log(this.sharedParams.params['compass:instructions'].data);

    // this.sharedParams.addParamListener('compass:instructions', val => {
    //   console.log('new compass:instructions value :');
    //   console.log(val);
    // });

    // setInterval(() => {
    //   this.sharedParams.update('compass:instructions', 'none');
    // }, 1000);
  }
}

export default ControllerExperience;
