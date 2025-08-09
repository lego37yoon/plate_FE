import lcid from 'windows-locale'
import iso from 'iso639-codes'
import langs from 'langs'

const all = []

const lcidKeys = Object.keys(lcid)
const isoKeys = Object.keys(iso)

lcidKeys.map(id => {
	const lcidLanguage = id
	const locale = {
		name: lcid[lcidLanguage].language,
		local: null,
		location: lcid[lcidLanguage].location,
		tag: lcid[lcidLanguage].tag,
		lowerTag: lcid[lcidLanguage].tag.replaceAll('-', '_'),
		lcid: lcid[lcidLanguage].id,
		'iso639-2': null,
		'iso639-1': null
	}

	const isoLanguage = isoKeys.find(name => name.toLowerCase() === lcid[lcidLanguage].language.toLowerCase())
	if (isoLanguage) {
		locale['iso639-2'] = iso[isoLanguage]['iso639-2']
		locale['iso639-1'] = iso[isoLanguage]['iso639-1']

		const nameLocal = langs.find(element => {
			if (element['2T']) {
				return element['2T'].toLowerCase() === locale['iso639-2']
			}

			return false
		})

		if (nameLocal) {
			locale.local = nameLocal.local
		}
	}

	all.push(locale)
})

const where = (key = 'name', text = '') => {
	if (key === 'lcid') {
		return all.find(element => element[key] === text)
	}

	return all.find(element => element[key].toLowerCase() === text.toLowerCase())
}

const getByName = text => where('name', text)

const getByNameLocal = text => where('local', text)

const getByLocation = text => where('location', text)

const getByTag = text => where('tag', text)

const getByLowerTag = text => where('lowerTag', text)

const getByLCID = id => where('lcid', Number(id))

const getByISO6392 = text => where('iso639-2', text)

const getByISO6391 = text => where('iso639-1', text)

export default {
	all,
	where,
	getByName,
	getByNameLocal,
	getByLocation,
	getByTag,
	getByLowerTag,
	getByLCID,
	getByISO6392,
	getByISO6391
}
