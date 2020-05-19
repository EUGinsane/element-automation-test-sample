const execSync = require('child_process').execSync
const { readdirSync } = require('fs')
const fs = require('fs')

const MODES = {
	ALL: '-a',
	SINGLE: '-s',
	GENERATE: '-g',
}

const scenariosPath = './src/scenarios'
const mode = process.argv[2]
const isSingle = mode === MODES.SINGLE
const isGenerating = mode === MODES.GENERATE
const scenarioName = isSingle || isGenerating ? process.argv[3] : null
const options = isSingle ? process.argv.splice(4) : process.argv.splice(3)

function getScenarios(path) {
	return readdirSync(path, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
}

function runScenario(scenario) {
	execSync(`echo "------------RUNNING: ${scenario}------------"`, { stdio: [0, 1, 2] })
	execSync(`element run ${scenariosPath}/${scenario}/index.ts ${options.join(' ')}`, {
		stdio: [0, 1, 2],
	})
	execSync(`echo "------------DONE: ${scenario}------------"`, { stdio: [0, 1, 2] })
}

function runAll() {
	const scenarios = getScenarios(scenariosPath)
	execSync(`echo "------------RUNNING ALL ${scenarios.length} SCENARIOS------------"`, {
		stdio: [0, 1, 2],
	})
	scenarios.forEach(scenario => runScenario(scenario))
	execSync(`echo "------------DONE------------"`, { stdio: [0, 1, 2] })
}

function generate(scenario) {
	execSync(`echo "------------GENERATING: ${scenario}---------------"`)
	fs.mkdir(`./src/scenarios/${scenario}`, { recursive: true }, err => {
		if (err) throw err
	})
	fs.writeFile(
		`./src/scenarios/${scenario}/index.ts`,
		`
import { step, By } from '@flood/element'
import * as assert from 'assert'
import settings from '../../config'

export { settings }

export default () => {
    step('hello', async browser => {
        
    })
}
`,
		err => {
			if(err) {
				console.error(err)
			} else {
				console.log('DONE')
			}
		},
	)
	execSync(`echo "------------DONE GENERATING---------------"`)
}

switch (mode) {
	case MODES.ALL:
		runAll()
		break
	case MODES.SINGLE:
		runScenario(scenarioName)
		break
	case MODES.GENERATE:
		generate(scenarioName)
		break
}
