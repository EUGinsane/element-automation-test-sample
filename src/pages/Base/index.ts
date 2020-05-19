import { Browser, ElementHandle, By } from '@flood/element'

export default class Base {
	protected _browser: Browser

	constructor(browser: Browser) {
		this._browser = browser
	}

	public getElementByCss(selector: string): Promise<ElementHandle> {
		return this._browser.findElement(By.css(selector))
	}

	public getElementByXpath(xpath: string): Promise<ElementHandle> {
		return this._browser.findElement(By.xpath(xpath))
	}

	public getElementById(id:string): Promise<ElementHandle> {
		return this._browser.findElement(By.id(id))
	}
}
