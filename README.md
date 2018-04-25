# Sounds Webpack Plugin [![Build Status](https://img.shields.io/circleci/project/posva/sounds-webpack-plugin/master.svg)](https://circleci.com/gh/posva/sounds-webpack-plugin) [![npm package](https://img.shields.io/npm/v/sounds-webpack-plugin.svg)](https://www.npmjs.com/package/sounds-webpack-plugin)

> Notify or errors, warnings, etc with sounds

[Video](https://twitter.com/posva/status/989189125810073602)

## Installation

```sh
npm install sounds-webpack-plugin
```

## Usage

Basic usage with defaults

```js
// webpack.config.js
const SoundsPlugin = require('sounds-webpack-plugin')

module.exports = {
  plugins: [new SoundsPlugin()],
}
```

You can provide custom sounds to be loaded:

```js
// webpack.config.js
const SoundsPlugin = require('sounds-webpack-plugin')
const path = require('path')

module.exports = {
  plugins: [
    new SoundsPlugin({
      sounds: {
        customSound: path.join(__dirname, 'sounds/error.mp3'),
        customWarning: path.join(__dirname, 'sounds/warn.mp3'),
        customSuccess: path.join(__dirname, 'sounds/ok.mp3'),
      },
      notifications: {
        // invalid is a webpack hook
        // you can check all hooks at https://github.com/webpack/webpack/blob/master/lib/Compiler.js#L32
        // 'customSound' is the key provided in sounds
        invalid: 'customSound',
        // you can provide a function to customize it further
        done(stats) {
          if (stats.hasErrors()) {
            this.play('customSound')
          } else if (stats.hasWarnings()) {
            this.play('customWarning')
          } else {
            this.play('customSuccess')
          }
        },
      },
    }),
  ],
}
```

You can provide 3 special values that are not webpack hooks: `$hasErrors`, `$hasWarnings`, `$success` and `$successAfterError`. You can check default values [here](https://github.com/posva/sounds-webpack-plugin/blob/master/src/index.js#L8). You can of course override any of them in `sounds` option.

SoundsPlugin comes with 4 sounds:

* `oof` - used for errors by default
* `nope`:
* `xpError`:
* `levelUp`: - used when the build succeeds after an error

SoundsPlugin uses [play-sound](https://github.com/shime/play-sound) under the hood. You can pass down options to the player with `playerOptions`:

```js
// webpack.config.js
const SoundsPlugin = require('sounds-webpack-plugin')

module.exports = {
  plugins: [
    new SoundsPlugin({
      playerOptions: {
        // check https://github.com/shime/play-sound#options
        // osx uses afplay
      },
    }),
  ],
}
```

## Related

* [SoundNotificationWebpackPluginn](https://github.com/williamoliveira/sound-notification-webpack-plugin)

## License

[MIT](http://opensource.org/licenses/MIT)
