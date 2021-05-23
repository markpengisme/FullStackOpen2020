describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('login').click()
        cy.contains('Log in to application')
        cy.get('input').should(input => {
            console.log(input.length)
            expect(input).to.have.length(2)
            expect(input[0]).to.have.id('username')
            expect(input[1]).to.have.id('password')
        })
    })
})
