/*
ROLLUP
*/
// @ts-ignore
import { rollup as rollupOrigin } from 'rollup/dist/es/rollup.browser.js'
import type { rollup as TypeRollup } from 'rollup'
export const rollup = rollupOrigin as typeof TypeRollup

/*
RASTREE
*/
export { compiler as rastree } from 'rastree'

/*
BABEL
*/
import type TypeBabel from '@babel/standalone'
// @ts-ignore
export const Babel = window.Babel as typeof TypeBabel

/*
SUCRASE
*/
export { transform as sucrase } from 'sucrase'

/*
PRETTIER
*/
import type { Options as TypePrettierOptions } from 'prettier'
// @ts-ignore
const _prettier = window.prettier, _prettierPlugins = window.prettierPlugins
export const prettier = (code: string, options: TypePrettierOptions): string =>
  _prettier.format(code, { semi: false, ...options || {}, plugins: _prettierPlugins })
