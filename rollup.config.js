import {
  resolve as pathResolve,
  dirname as pathDirname
} from 'path'

// import tsconfig from './tsconfig.json'

import rease from 'rollup-plugin-rease'
import babel from '@rollup/plugin-babel'
import sucrase from '@rollup/plugin-sucrase'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import { livereload } from './cfg/livereload'
// import { tsconfigAliases } from './cfg/tsconfig-aliases'

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    }
  }
}

export default {
  input : [],
  output: {
    sourcemap: false,
    compact  : true,
    format   : 'system',
    dir      : 'app/build',

    chunkFileNames: '[hash].js' // '_[name]-[hash].js'
  },
  plugins: [
    {
      name     : 'json-import',
      transform: (code, id) => /\.json$/.test(id) ? `export default ${code};` : null
    },
    (() => {
      const raws = {}
      return {
        name: 'raw-import',
        resolveId(importree, importer) {
          if (/\?raw$/.test(importree)) {
            importree = pathResolve(pathDirname(importer), importree || '').slice(0, -4)
            return raws[importree] = true, importree
          }
          return null
        },
        transform(code, id) {
          return id in raws ? `export default ${JSON.stringify(code)};` : null
        }
      }
    })(),
    {
      name: 'general',
      buildStart() {
        this.emitFile({
          type             : 'chunk',
          id               : 'src/index.ts',
          fileName         : 'index.js',
          preserveSignature: 'strict'
        })
        this.emitFile({
          type             : 'chunk',
          id               : 'src/frame.ts',
          fileName         : 'frame.js',
          preserveSignature: 'strict'
        })
      }
    },
    rease({
      env       : 'client',
      debug     : false,
      extensions: ['.rease.ts', '.rease.tsx']
    }),
    // tsconfigAliases(tsconfig),
    resolve({
      browser   : true,
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
    }),
    sucrase({ exclude: ['node_modules/**'], transforms: ['typescript'] }),
    commonjs(),

    !production && serve(),

    !production && livereload('app'),

    production && babel({
      babelHelpers: 'bundled',
      // babelrc: false,
      presets     : [
        [
          '@babel/preset-env',
          {
            corejs     : 3,
            loose      : true,
            bugfixes   : true,
            modules    : false,
            useBuiltIns: 'entry', // 'entry', 'usage'
            targets    : '> 1%, not dead'
          }
        ]
      ]
    }),

    production && terser({
      keep_fnames    : true,
      keep_classnames: true
    })
  ],
  watch: { clearScreen: false }
}
