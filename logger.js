const chalk = require('chalk')

function error(message) {
	const errorBadge = chalk.white.bgRed.bold('   ERROR   ')
	console.log(`${errorBadge} ${message}`)
}

function info(message, withBadge = true) {
	const infoBadge = chalk.white.bgGray.bold('   INFO   ')
	if (withBadge) {
		console.log(`${infoBadge} ${message}`)
	} else {
		console.log(message)
	}
}

module.exports = {
	error,
	info,
}
