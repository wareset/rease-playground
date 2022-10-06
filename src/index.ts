// import * as rease from 'rease'
// console.log(rease)

import { createReaseApp } from 'rease'

window.addEventListener('load', () => {
  import('./App').then((chunk) => {
    createReaseApp(chunk.default, {
      target: document.body,
    
      onInitial: () => {
        console.time('ReaseApp')
      },
      onCreated: () => {
        console.timeEnd('ReaseApp')
      }
    })
  })
})

// const qq = new Set([0 / -1, 2, 3, 4, 5])
// qq.add(-0)

// console.log(qq)

// import srcdoc from './srcdoc.html'

// console.log(srcdoc)
