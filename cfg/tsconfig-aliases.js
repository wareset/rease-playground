import * as path from 'path'

import rollupAlias from '@rollup/plugin-alias'

/*
 * BEGIN ALIASES
 */
export const tsconfigAliases = (tsconfig) => {
  const aliases = {
    entries: [
      // { find: '#routes', replacement: path.resolve('./src/routes') },
    ]
  }
  for (const k in tsconfig.compilerOptions.paths) {
    aliases.entries.push({
      find       : k.slice(0, -2),
      replacement: path.resolve(
        tsconfig.compilerOptions.baseUrl, tsconfig.compilerOptions.paths[k][0].slice(0, -2)
      )
    })
  }

  return rollupAlias(aliases)
}
/*
 * END ALIASES
 */
