describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Superuser',
            username: 'root',
            password: 'markpeng',
        }
        const testUser = {
            name: 'Testuser',
            username: 'user',
            password: 'marky',
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.request('POST', 'http://localhost:3001/api/users/', testUser)
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

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'root', password: 'markpeng' })
        })

        it('A blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#title').type('Example.com')
            cy.get('#author').type('Mark')
            cy.get('#url').type('url')
            cy.contains('create').click()
            cy.get('.message')
                .should('contain', 'a new blog')
                .and('have.css', 'color', 'rgb(0, 128, 0)')
                .and('have.css', 'border-style', 'solid')
            cy.contains('Example.com')
        })

        describe('and blogs exists', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'Example Domain',
                    author: 'example',
                    url: 'http://example.com',
                    likes: 87,
                })
                cy.createBlog({
                    title: 'Test123',
                    author: 'test',
                    url: 'http://test.com',
                    likes: 123,
                })
                cy.createBlog({
                    title: 'Google',
                    author: 'Doogle',
                    url: 'http://google.com',
                    likes: 122,
                })
            })

            it('one of those can be clicked like', function () {
                cy.contains('Test123').parent().parent().as('blog')
                cy.get('@blog').contains('view').click()
                cy.get('@blog').contains('like').click()
                cy.get('@blog').find('.likes').should('include.text', '124')
            })

            it('one of those can be delete', function () {
                cy.contains('Test123').parent().parent().as('blog')
                cy.get('@blog').contains('view').click()
                cy.get('@blog').contains('remove').click()
                cy.get('body').should('not.include.text', 'Test123')
            })

            it('other people can not delete', function () {
                cy.contains('logout').click()
                cy.contains('login').click()
                cy.get('#username').type('user')
                cy.get('#password').type('marky')
                cy.get('#login-button').click()
                cy.contains('Test123').parent().parent().as('blog')
                cy.get('@blog').contains('view').click()
                cy.get('@blog').contains('remove').click()
                cy.get('.message')
                    .should('contain', 'Remove error!')
                    .and('have.css', 'color', 'rgb(255, 0, 0)')
                    .and('have.css', 'border-style', 'solid')
            })

            it('those are sorted', function () {
                cy.get('.detail-blog').then(blogs => {
                    expect(blogs[0]).to.contain('Test123')
                    const likes = blogs.toArray().map(blog => {
                        return Number.parseInt(blog.querySelector('.likes').textContent.slice(7,-4))
                    })
                    let max = likes[0]
                    for (const like of likes){
                        expect(like).to.be.lte(max)
                        max = like
                    }
                })
                cy.contains('Google').parent().parent().as('blog')
                cy.get('@blog').contains('view').click()
                cy.get('@blog').contains('like').click()
                cy.wait(1000)
                cy.get('@blog').contains('like').click()
                cy.wait(1000)
                cy.get('.detail-blog').first().should('include.text', 'Google')
            })
        })
    })
})
