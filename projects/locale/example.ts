import locale from './index.js'
import type {ILocale} from './index.js'

locale.all // [language: '...']
const localeSelect: ILocale = locale.all[0]

locale.getByTag('pt-br').name // 'Portuguese'
locale.where('tag', 'pt-br').name // 'Portuguese'
console.log(localeSelect)
