describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Superuser',
            username: 'root',
            password: 'markpeng',
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('login').click()
        cy.contains('Log in to application')
        cy.get('input').should((input) => {
            console.log(input.length)
            expect(input).to.have.length(2)
            expect(input[0]).to.have.id('username')
            expect(input[1]).to.have.id('password')
        })
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.contains('login').click()
            cy.get('#username').type('root')
            cy.get('#password').type('markpeng')
            cy.get('#login-button').click()
            cy.contains('Superuser logged-in')
        })

        it('fails with wrong credentials', function () {
            cy.contains('login').click()
            cy.get('#username').type('root')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.get('.message')
                .should('contain', 'Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')

            cy.get('html').should('not.contain', 'Superuser logged-in')
        })
    })
})
