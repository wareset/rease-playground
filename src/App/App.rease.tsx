import 'rease/jsx'
import { TypeReaseContext } from 'rease'

/*
iframe

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe

allow-downloads: Allows for downloads to occur with a gesture from the user.

https://habr.com/ru/post/488516/

Атрибут sandbox
Вот полный список флагов песочницы и их назначение:

Флаг Описание
allow-forms Позволяет отправлять формы
allow-modals Позволяет ресурсу открывать новые модальные окна
allow-orientation-lock Позволяет ресурсу блокировать ориентацию экрана.
allow-pointer-lock Позволяет ресурсу использовать API блокировки указателя (Pointer Lock API)
allow-popups Позволяет ресурсу открывать новые всплывающие окна или вкладки.
allow-popups-to-escape-sandbox Позволяет ресурсу открывать новые окна, которые не наследуют песочницу.
allow-presentation Позволяет ресурсу начать сеанс презентации.
allow-same-origin Позволяет ресурсу сохранять свое происхождение.
allow-scripts Позволяет ресурсу запускать сценарии.
allow-top-navigation Позволяет ресурсу перемещаться по контексту просмотра верхнего уровня.
allow-top-navigation-by-user-activation Позволяет ресурсу перемещаться по контексту просмотра верхнего уровня, но только если он инициирован жестом пользователя.
*/

import { compile } from './compile'

const files: { [key: string]: string } = {
  './index.js': `
import { createReaseApp } from 'rease'
import App from './components/App.rease'

export * from './lib'

createReaseApp(App, {
  target: document.body
})
  `,

  './components/App.rease.jsx': `
import 'rease/jsx'
import { TypeReaseContext } from 'rease'

import { random } from '../lib'

export default function App(
  this: TypeReaseContext
) {
  ;<h1>Rease random: {random()}</h1>
}
  `,

  './lib/index.js': `
export const { random } = Math
  `
}

export function App(
  this: TypeReaseContext
): void {
  console.log(this)

  ;(
    <div>
      <h1>Hello</h1>
      {/* <iframe
        class="frame"
        sandbox={
          'allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation'
        }
        src="frame.html"
      /> */}
      <r-watch
        r-is={compile({ files })}
        r-children={(
          data: Awaited<ReturnType<typeof compile>>
        ) => {
          console.log(data)

          ;(
            <div class="container">
              <h3>ES:</h3>
              <pre>{data.es}</pre>
              <h3>JS:</h3>
              <pre>{data.js}</pre>
            </div>
          )
        }}
      />
    </div>
  )
}
App.css = (<style jsx>{`
.frame {
  width: 200px;
  height: 200px;
  border: none;
  display: block;
}
`}</style>)
