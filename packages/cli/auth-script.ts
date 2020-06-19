import { Browser } from 'puppeteer';

const USER_LOGIN = 'login';
const USER_PASSWORD = 'password';
const INPUT_LOGIN_SELECTOR = 'input[name="login"]';
const INPUT_PASSWORD_SELECTOR = 'input[name="password"]';
const SUBMIT_BUTTON_SELECTOR = 'button[type="submit"]';
const LOGIN_PAGE_URL = 'http://localhost:4100/login';

const authenticate = async ({ browser }: { url: string; browser: Browser }) => {
    const page = await browser.newPage();

    await page.goto(LOGIN_PAGE_URL);
    await page.type(INPUT_LOGIN_SELECTOR, USER_LOGIN);
    await page.type(INPUT_PASSWORD_SELECTOR, USER_PASSWORD);
    await page.click(SUBMIT_BUTTON_SELECTOR);
    await page.close();
};

export default authenticate;
