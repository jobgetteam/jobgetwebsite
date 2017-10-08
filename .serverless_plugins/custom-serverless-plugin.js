'use strict';

class Deploy {
  constructor(serverless, options) {
    console.log(serverless);
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      deploy: {
        lifecycleEvents: [
          'functions'
        ],
        options: {
          function: {
            usage: 'Specify the function you want to deploy (e.g. "--function myFunction")',
            shortcut: 'f',
            required: true
          },
          stage: {
            usage: 'Specify the stage you want to deploy to. (e.g. "--stage prod")',
            shortcut: 's',
            default: 'dev'
          }
        }
      },
    };

    this.hooks = {
      'after:deploy:functions': this.deployFunction.bind(this)
    }
  }

  deployFunction() {
    console.log(serverless)
    console.log('Deploying function: ', this.options.function);
  }
}

module.exports = Deploy;