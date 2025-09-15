import Event from '@ioc:Adonis/Core/Event'
import { inspect } from 'util'

Event.on('db:query', function ({ sql, bindings }) {
  console.log('sql query---->',inspect(sql,{ depth: null, colors: true }))
  console.log('bindings----->',inspect(bindings,{ depth: null, colors: true }))
})