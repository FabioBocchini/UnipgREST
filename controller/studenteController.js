const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'Unipg',
	password: 'postgres'
})

//ritorna la lista degli studenti iscritti
const getStudente = (request, response) => {
	pool.query('SELECT matricola FROM studente', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

//controlla l'esistenza di una email o di una matricola durante la registrazione
const checkEmail = (request, response) => {
	const { email, matricola } = request.body
	let value = false
	pool.query('SELECT * FROM studente WHERE email = $1 OR matricola = $2', [ email, matricola ], (error, results) => {
		if (error) {
			throw error
		}
		if (results.rows.length < 1) {
			return response.status(201).send(`Nuovo Studente: ${matricola}`)
		}
		response.sendStatus(401)
	})
}

//usato per login studente
const postStudLogin = (request, response) => {
	const { email, password } = request.body
	pool.query(
		'SELECT matricola, nome, cognome, password FROM studente WHERE email = $1',
		[ email ],
		(error, results) => {
			if (error) {
				throw error
			}
			if (results.rows.length > 0) {
				const user = results.rows[0]
				if (user.password === password) {
					delete user.password
					return response.status(200).json(user)
				}
			}
			response.sendStatus(401)
		}
	)
}

//usato per la registrazione di un nuovo studente
const postNuovoStudente = (request, response) => {
	const { matricola, nome, cognome, email, password } = request.body
	pool.query(
		'INSERT INTO studente VALUES($1,$2,$3,$4,$5)',
		[ matricola, nome, cognome, email, password ],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(`Studente added: ${matricola}`)
		}
	)
}

module.exports = {
	getStudente,
	postStudLogin,
	postNuovoStudente,
	checkEmail
}
