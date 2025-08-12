import {equal} from 'node:assert'
import {all, getByTag} from './index.js'

equal(all.length > 20, true)
equal(getByTag('pt-br').name, 'Portuguese')
equal(getByTag('pt-br').local, 'Português')
equal(getByTag('js-best'), undefined)

console.log('Done!')
