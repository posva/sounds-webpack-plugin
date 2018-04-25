// @ts-check

const player = require('play-sound')()
const { join } = require('path')

/**
 * default sound library
 * @type {SoundsLibrary}
 */
const soundsLib = {
  oof: join(__dirname, 'sounds/oof.mp3'),
  xpError: join(__dirname, 'sounds/xpError.mp3'),
  nope: join(__dirname, 'sounds/nope.mp3'),
  levelUp: join(__dirname, 'sounds/levelUp.mp3'),
}

/**
 * Default notification map
 * @type {Notifications}
 */
const notifs = {
  $hasErrors: 'oof',
  $successAfterErrors: 'levelUp',
  done (stats) {
    if (stats.hasErrors()) {
      this.errorCount++
      typeof notifs.$hasErrors === 'string' && this.play(notifs.$hasErrors, this.playerOptions)
    } else if (stats.hasWarnings() && typeof notifs.$hasWarnings === 'string') {
      this.play(notifs.$hasWarnings, this.playerOptions)
    } else {
      if (this.errorCount > 0) {
        typeof notifs.$successAfterErrors === 'string' &&
          this.play(notifs.$successAfterErrors, this.playerOptions)
      } else {
        typeof notifs.$success === 'string' && this.play(notifs.$success, this.playerOptions)
      }
      this.errorCount = 0
    }
  },
}

/**
 * Apply a hook for webpack 3 and 4
 * @param {*} compiler webpack compiler instance
 * @param {string} hook name of the hook
 * @param {StatsCallback} callback callback passed to the hook
 */
function applyHook (compiler, hook, callback) {
  if (compiler.hooks) {
    const className = 'SoundsPlugin'
    compiler.hooks[hook].tap(className, callback)
  } else {
    compiler.plugin(hook, callback)
  }
}

/**
 * @class Sounds
 */
class Sounds {
  /**
   * Constructor to create a Sounds Plugin instance
   * @param {object} [options={}] - Sounds Plugin Options
   * @param {Notifications?} options.notifications - Notifications map
   * @param {SoundsLibrary?} options.sounds - Sound Library map
   * @param {object?} options.playerOptions - Options passed to the play function
   */
  constructor (
    // for better typing
    options = {}
  ) {
    Object.assign(notifs, options.notifications)
    Object.assign(soundsLib, options.sounds)
    this.playerOptions = options.playerOptions
    this.errorCount = 0
  }

  /**
   * Apply function passed to webpack
   * @param {*} compiler - webpack compiler instance
   * @private
   */
  apply (compiler) {
    Object.keys(notifs)
      .filter(k => !k.startsWith('$'))
      .forEach(hook => {
        const notif = notifs[hook]
        applyHook(compiler, hook, stats => {
          if (typeof notif === 'function') {
            notif.call(this, stats)
          } else {
            this.play(notif, this.playerOptions)
          }
        })
      })
  }

  /**
   * Play a sound
   * @param {string} sound Name of the sound to play
   * @param {object} [options] options passed to the player
   * @returns void
   */
  play (sound, options) {
    if (!soundsLib[sound]) {
      console.log(
        `There is no "${sound}" registered sound, make sure to register it when instantiating SoundsPlugin`
      )
      return
    }
    player.play(soundsLib[sound], options, err => {
      if (err) console.error('Error playing sound:', err)
    })
  }
}

module.exports = Sounds

/**
 * @typedef {{[key: string]: string}} SoundsLibrary
 * @typedef {{[key: string]: string | ((this: Sounds, stats: any) => void)}} Notifications
 * @typedef {(stats: any) => void} StatsCallback
 */
