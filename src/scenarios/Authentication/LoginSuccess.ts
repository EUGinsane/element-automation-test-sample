import { step, By, TestData } from '@flood/element';
import * as assert from 'assert';
import settings from '../../config';
import { LoginPage } from '../../pages';

export { settings };

export default () => {
	step('Go to Flood login page', async browser => {
		const loginPage = new LoginPage(browser)
		await loginPage.visit()
		await loginPage.authenticate('youremailhere', 'yourpasswordhere')

		await browser.wait(15)
	});
};
