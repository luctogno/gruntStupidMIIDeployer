# sap_stupidMIIDeployer

> The best Grunt plugin ever.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install sap-stupid-mii-deployer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('sap-stupid-mii-deployer');
```

## The "stupidMIIDeployer" task

### Overview
In your project's Gruntfile, add a section named `StupidMIIDeployer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  stupidMIIDeployer: {
    options: {
      // Task-specific options go here.
    }
  },
});
```

### Options

#### options.miiHost
Type: `String`

A string value of the host of MII.

#### options.miiPort
Type: `String`

A string value of the port of MII.

#### options.login
Type: `String`

A string value of the login on MII.

#### options.pass
Type: `String`

A string value of the pass on MII.

#### options.localPath
Type: `String`

A string value of the localPath on project to load on MII.

#### options.remotePath
Type: `String`

A string value of the remotePath on project in MII machine.

### Usage Examples

In this example, get all file in localPath and put into path remotePath + localPath

```js
grunt.initConfig({
  stupidMIIDeployer: {
      options: {
            miiHost: 'localhost',
            miiPort: '50000',
            login: 'admin',
            pass: 'admin',
            localPath: 'test/expected',
            remotePath: '0100/WEB/CAUSFERM'
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
