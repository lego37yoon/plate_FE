/* eslint-disable no-unused-expressions */
import { all, getByTag, where } from '.'

all // [language: '...']
getByTag('pt-br').name // 'Portuguese'
where('tag', 'pt-br').name // 'Portuguese'
