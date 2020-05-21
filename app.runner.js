const execSync = require('child_process').execSync
const { readdirSync } = require('fs')
const fs = require('fs')
const chalk = require('chalk')
const logger = require('./logger')

const testSample = `
import { step, By } from '@flood/element'
import * as assert from 'assert'
import settings from '../../config'

export { settings }

export default () => {
    step('add step title here', async browser => {
        // Add some code
    })
}
`

const MODES = {
	ALL: '-a',
	SINGLE: '-s',
	GENERATE: '-g',
	INFO: '-i',
}

const scenariosPath = './src/scenarios'
const mode = process.argv[2]
const noHeadless = process.argv[process.argv.length - 1]
// const options = isSingle ? process.argv.splice(4) : process.argv.splice(3)

function clear() {
	execSync('clear', { stdio: [0, 1, 2] })
}

function getAllScenarios() {
	return readdirSync(scenariosPath)
}

function getTestCases(scenario) {
	const scenarioPath = `${scenariosPath}/${scenario}`
	return fs
		.readdirSync(scenarioPath)
		.filter(file => file !== 'tmp')
		.map(testCase => testCase.split('.')[0])
}

function runTestCase(scenario, testCase) {
	logger.info(`\n${chalk.gray.bgYellow.bold(`  ${testCase}  `)} test case is running...\n`, false)
	execSync(`element run ${scenariosPath}/${scenario}/${testCase}.ts ${noHeadless}`, {
		stdio: [0, 1, 2],
	})
}

function runScenario(scenario, testCases) {
	const allTestCases = getTestCases(scenario)
	const currentNumberOfTestCases = testCases.length || allTestCases.length
	logger.info(
		`\n\n${chalk.white.bgBlue.bold(`  ${scenario}  `)} scenario with ${chalk.yellow.bold(
			currentNumberOfTestCases,
		)} test cases are about to be running....`,
		false,
	)
	if (testCases.length) {
		testCases.forEach(testCase => {
			if (allTestCases.includes(testCase)) {
				runTestCase(scenario, testCase)
			}
		})
	} else {
		allTestCases.forEach(testCase => {
			runTestCase(scenario, testCase)
		})
	}
}

function runSingle() {
	clear()
	const scenario = process.argv[3]
	const testCases = process.argv.splice(4)

	runScenario(scenario, testCases)
}

function runAll() {
	clear()
	const scenarios = getAllScenarios()

	scenarios.forEach(scenario => {
		const testCases = getTestCases(scenario)
		runScenario(scenario, testCases)
	})
}

function generate() {
	clear()
	const scenario = process.argv[3]
	const testCases = process.argv.splice(4)
	const scenarioPath = `${scenariosPath}/${scenario}`
	if (!scenario || !testCases.length) {
		logger.error('You need to specify at least 1 Scenario and 1 Test case')
		return
	}

	logger.info(
		`Generating ${chalk.yellow.bold(testCases.length)} test cases for screnario ${chalk.blue.bold(
			scenario,
		)}......`,
		false,
	)

	try {
		fs.mkdirSync(scenarioPath)
	} catch (e) {
		if (e && e.errno !== -17) {
			logger.error('There is a problem while creating screnario. Please contact someone!')
		}
	}

	const existedTestCases = getTestCases(scenario)
	testCases.forEach(testCase => {
		if (existedTestCases.includes(testCase)) {
			logger.info(
				`    ${chalk.yellow.bold(testCase)} ............. already exists. Ignored!`,
				false,
			)
		} else {
			fs.writeFile(`${scenarioPath}/${testCase}.ts`, testSample, e => {
				if (!e) {
					logger.info(
						`    Creating ${chalk.yellow.bold(testCase)} ............... ${chalk.green.bold('OK')}`,
						false,
					)
				} else {
					logger.error('There is a problem while creating screnario. Please contact someone!')
				}
			})
		}
	})
}

function showInfo() {
	clear()
	const scenarios = getAllScenarios()
	const testCasesSize = scenarios.reduce((sum, nextScenario) => {
		const currentTestCase = getTestCases(nextScenario)
		return (sum += currentTestCase.length)
	}, 0)
	logger.info(
		`There are ${chalk.blue.bold(`${scenarios.length} scenarios`)} with ${chalk.yellow.bold(
			`${testCasesSize} test cases`,
		)} in this project:`,
		false,
	)
	scenarios.forEach(scenario => {
		const testCases = getTestCases(scenario)
		logger.info(
			`\n${chalk.blue.bold(` ${scenario} `)} has ${chalk.yellow.bold(testCases.length)} test cases`,
			false,
		)
		testCases.forEach(testCase => {
			logger.info(`    ${chalk.yellow.bold(` ${testCase} `)}`, false)
		})
	})
}

switch (mode) {
	case MODES.ALL:
		runAll()
		break
	case MODES.SINGLE:
		runSingle()
		break
	case MODES.GENERATE:
		generate()
		break
	case MODES.INFO:
		showInfo()
		break
	default:
		break
}
