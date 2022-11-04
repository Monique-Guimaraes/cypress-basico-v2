/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() { // beforeeach é antes de cada.. antes de cada teste faça a visita no site
        cy.visit('./src/index.html') // visitar o site 
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT') // onde o titulo deverá ser igual a Central de atendimento..

    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'VAMO GANHAAAAAR FURIIAAAAAA VAMO GANHAAAAAR FURIIAAAAAA VAMO GANHAAAAAR FURIIAAAAAA VAMO GANHAAAAAR FURIIAAAAAA VAMO GANHAAAAAR FURIIAAAAAA VAMO GANHAAAAAR FURIIAAAAAA'
        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 }) //em const, criei uma constante chamada long text e escrevi um longo texto nela, em type eu chamei essa constante; o delay zero é para escrever rapido e o teste ser mais rapido
        cy.get('button[type="submit"]').click() //pega uma classe do tipo botao com a propriedade de submit
            //ate aqui são apenas ações, com a linha abaixo que é uma verificação, temos o resultado esperado
        cy.get('.success').should('be.visible') //uma mensagem de sucesso com a classe chamada success deve ser visivil
            // aqui ele encontra o elemento success que tem como dever ser visivel, validando o teste
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {

        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes,gmail.com')
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible') // no caso para validar um erro.. o campo email está invalido para esse teste

    })

    it('validar que, se um valor não-numérico for digitado, seu valor continuará vazio', function() {

        cy.get('#phone') //o campo telefone
            .type('aygduyage') // preencher com nao numerico
            .should('have.value', '') //ja que nao passei numeros mas letras.. ele deve ficar vazio

    })

    it.only('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes@gmail.com')
        cy.get('#phone-checkbox').click() //o checkbox do telefone será ticado, o que torna o campo o campo telefone obrigatório (mas nao sera preenchido)
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName') //passo o campo
            .type('Monique') //passo o que preencher no campo
            .should('have.value', 'Monique') // valido o nome
            .clear() //limpo o campo
            .should('have.value', '') // falo que o campo deve ser vazio, ja que antediormente o apaguei

        cy.get('#lastName') //mesmo para o campo sobrenome
            .type('Guimaraes')
            .should('have.value', 'Guimaraes')
            .clear()
            .should('have.value', '')

        cy.get('#email') //mesmo para o campo email
            .type('monique@teste.com')
            .should('have.value', 'monique@teste.com')
            .clear()
            .should('have.value', '')

        cy.get('#phone') //mesmo para o campo texto
            .type('13991999999')
            .should('have.value', '13991999999')
            .clear()
            .should('have.value', '')

    })

})