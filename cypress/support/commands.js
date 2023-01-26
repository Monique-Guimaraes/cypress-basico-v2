Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes@gmail.com')
        cy.get('#open-text-area').type('Teste comando customizado')
        cy.contains('button', 'Enviar').click() //cy.get('button[type="submit"]').click()
    }) //aqui usei o cypresse.commands.add para add meu comando customizado