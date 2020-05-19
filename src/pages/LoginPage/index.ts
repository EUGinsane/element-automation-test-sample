import { Browser } from '@flood/element'
import Base from '../Base'

export default class LoginPage extends Base {
    private _url: string = 'https://app.flood.io/login'
    private _userNameFieldId: string = '1-email'
    private _passwordFieldSelector: string = 'input[type=password]'
    private _loginButtonXpath: string = '//*[@id="auth0-lock-container-1"]/div/div[2]/form/div/div/div/button'

	constructor(browser: Browser) {
		super(browser)
	}

	public async visit(): Promise<void> {
		await this._browser.visit(this._url)
	}

	public async authenticate(userName: string, password: string): Promise<void> {
        const userNameField = await this.getElementById(this._userNameFieldId)
        const passwordField = await this.getElementByCss(this._passwordFieldSelector)
        const loginButton = await this.getElementByXpath(this._loginButtonXpath)

        await userNameField.type(userName)
        await passwordField.type(password)
        await loginButton.click()
    }
}
