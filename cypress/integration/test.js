describe('correct content', function () {
    it('shows correct content', function () {
        cy.visit('http://localhost:3000')
        cy.get('h1').contains('Todos')
        cy.get('h2').contains('Finished')
        cy.get('li').contains('Finish coding exercise')
        cy.get('button').contains('Remove Todo')
        cy.get('button').contains('Mark Finished')
    })
    it('functioning todos', function (){
        cy.get('input').type('Finish Homework {enter}')
        cy.get('button').contains('Mark Finished').click()
        cy.get('button').contains('Remove Todo').click()
    })
})