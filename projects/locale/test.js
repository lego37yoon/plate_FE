import { all, getByTag } from '.'
import { equal } from 'assert'

equal(all.length > 20, true)
equal(getByTag('pt-br').name, 'Portuguese')
equal(getByTag('pt-br').local, 'Português')
equal(getByTag('js-best'), undefined)

console.log('Done!')
