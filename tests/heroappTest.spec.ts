import { faker } from '@faker-js/faker';
import {expect, test} from '@playwright/test';


test.describe('API test for Herokuapp @APITEST', async () => {

    let userToken;

    test.beforeAll('User Authentication', async ({ request}) => {

        const userAuthentication = await request.post(process.env.HEROKU_BASEURL + 'users/login', {
            data: { "email": "john.rambo@test.com", "password": process.env.PASSWORD }
        });

        const authResponseBody = JSON.stringify(await userAuthentication.json());
        userToken = JSON.parse(authResponseBody).token;
        console.log("Token : ", userToken);
        expect(userAuthentication.status()).toEqual(200);

    })

    test.afterAll('User Logout', async({ request }) => {
        const logout = await request.post(process.env.HEROKU_BASEURL + 'users/logout', {
            headers : {"Authorization" : "Bearer " + userToken}
        })

        expect(logout.status()).toEqual(200)

    })

    test('Add contact to the user', async({ request }) => {

        const addContact = await request.post(process.env.HEROKU_BASEURL + 'contacts', {

            headers: {"Authorization": "Bearer " + userToken},
            data: {
                "firstName": faker.person.firstName(),
                "lastName": faker.person.lastName(),
                "birthdate": "1970-01-01",
                "email": faker.internet.email(),
                "phone": "8099899998",
                "street1": faker.location.streetAddress(),
                "street2": faker.location.secondaryAddress(),
                "city": faker.location.city(),
                "stateProvince": faker.location.state(),
                "postalCode": faker.location.zipCode(),
                "country": faker.location.countryCode()
            }

        });
        expect(addContact.status()).toEqual(201);
    })

    test('Get user contact list', async({ request }) => {

        const getUserContactListRequest = await request.get(process.env.HEROKU_BASEURL + 'contacts', {
            headers: {"Authorization": "Bearer " + userToken}
        });

        expect(getUserContactListRequest.status()).toEqual(200);
        const constactList = JSON.stringify(await getUserContactListRequest.json());
        console.log(JSON.parse(constactList));

    })

    test.skip('Delete user contacts', async({ request }) => {

        const getUserContactListRequest = await request.delete(process.env.HEROKU_BASEURL + 'contacts/', {
            headers: {"Authorization": "Bearer " + userToken}
        });

        expect.soft(getUserContactListRequest.status()).toEqual(200);

    })

})