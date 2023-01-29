Cypress._.times(3, function() { //.times é repetir o teste, tem como parametro qntas vezes repetir e a função de calbbak
    it.only('testa a página da política de privacidade de forma independente', function() {
        cy.visit('./src/privacy.html')
        cy.contains('Talking About Testing').should('be.visible')
    })
})