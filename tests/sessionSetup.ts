import { test as setup, expect } from '@playwright/test';


const authFile = 'herokuapp/session.json';

setup('Session storage state', async ({ page }) => {

    console.log('Setup saving storage state...');

    await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
    await page.getByPlaceholder('Email').fill('john.rambo@test.com');
    await page.getByPlaceholder('Password').fill('myPassword');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForLoadState();

    // Storing the session state

    await page.context().storageState({ path: authFile });
    await page.close();

});