import { faker } from '@faker-js/faker'

describe('smoke tests', () => {
  afterEach(() => {
    cy.cleanupUser()
  })

  it('should allow you to register and login', () => {
    const loginForm = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    cy.then(() => ({ username: loginForm.username })).as('user')

    cy.visitAndCheck('/')

    cy.findByRole('link', { name: /user accounts/i }).click()

    cy.findByRole('link', { name: /sign up/i }).click()

    cy.findByRole('textbox', { name: /username/i }).type(loginForm.username)
    cy.findByLabelText(/password/i).type(loginForm.password)
    cy.findByRole('button', { name: /create account/i }).click()

    cy.findByRole('button', { name: /log out/i }).click()
    cy.findByRole('link', { name: /user accounts/i })
  })
})
