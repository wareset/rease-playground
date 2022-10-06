/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { rollup, rastree, Babel, sucrase, prettier } from '../include'

/*
PATH
*/
// @ts-ignore
if (!window.process) window.process = { cwd: () => '/' }
import { resolve as pathResolve } from 'path-browserify'

const EXTENSIONS = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
const IMPORTREES = ['', ...EXTENSIONS, ...EXTENSIONS.map((v) => '/index' + v)]

const GLOBALS = { rease: 'rease' } as const

const toPosix = (str: string): string =>
  str.replace(/[\\/]+/g, '/')

export const compile = async ({
  input = './index.js',
  files = {} as { [key: string]: string }
} = {}) => {
  let esCode = ''
  let iifeCode = ''
  const logs: any = []

  try {
    input = pathResolve(toPosix(input))
    const _files = files; files = {}
    for (const k in _files) files[pathResolve(toPosix(k))] = _files[k]

    const bundle = await rollup({
      input,

      inlineDynamicImports: true,

      onwarn(data) {
        // console.log(warning)
        logs.push({ type: 'warn', data })
      },

      external: Object.keys(GLOBALS),

      plugins: [
        {
          name: 'general',
          resolveId(importee) {
            importee = toPosix(importee)
            if (importee[0] === '.' || importee[0] === '/') {
              importee = pathResolve(importee)
              for (let a = IMPORTREES, i = 0; i < a.length; i++) {
                if (importee + a[i] in files) return importee + a[i]
              }
            }
            return null
          },

          load(resolved) {
            return files[resolved]
          },

          transform(code, id) {
            if (/\.rease\.[tj]sx?$/.test(id)) {
              code = rastree(code, {
                env      : 'client',
                salt     : id,
                useJSX   : /x$/.test(id),
                tsNocheck: false
              })
            }

            if (/\.[tj]sx?$/.test(id)) {
              code = sucrase(code, { transforms: ['typescript'] }).code
            }

            return code
          },
        },
        {
          name: 'json',
          transform(code, id) {
            return /\.json$/.test(id) ? `export default ${code};` : null
          }
        },
      ]
    })

    // console.log(bundle)

    const [es, iife] = (await Promise.all([
      bundle.generate({
        format   : 'es',
        exports  : 'named',
        sourcemap: false,
        globals  : GLOBALS,
        plugins  : [
          {
            name: 'babel',
            renderChunk(code) {
              return prettier(code, { parser: 'typescript' })
            }
          }
        ]
      }),
      bundle.generate({
        format   : 'iife',
        name     : 'App',
        exports  : 'named',
        sourcemap: false,
        globals  : GLOBALS,
        plugins  : [
          {
            name: 'babel',
            renderChunk(code) {
              return Babel.transform(code, { presets: ['env'] }).code!
            }
          }
        ]
      })
    ])).map((v) => v && v.output[0])

    // console.log([es, iife])
    if (es) esCode = es.code
    if (iife) iifeCode = iife.code
  } catch (data) {
    logs.push({ type: 'error', data })
  }

  return {
    es: esCode,
    js: iifeCode,
    logs
  }
}

// import { compile } from './compile'

// const files: { [key: string]: string } = {
//   './index.js': `
// import { createReaseApp } from 'rease'
// import App from './components/App.rease'

// export * from './lib'

// createReaseApp(App, {
//   target: document.body
// })
//   `,

//   './components/App.rease.jsx': `
// import { random } from '../lib'

// export default function App() {
//   <h1>Rease</h1>
// }
//   `,

//   './lib/index.js': `
// export const { random } = Math
//   `
// }

// console.log(compile({ files }))
