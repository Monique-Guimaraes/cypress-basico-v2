/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000 //criada uma variavel de 3 segundos para usar no cy.tick(passando ela aqui)

    beforeEach(function() { // beforeeach é antes de cada.. antes de cada teste faça a visita no site
        cy.visit('./src/index.html') // visitar o site 
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT') // onde o titulo deverá ser igual a Central de atendimento..

    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'texto grande texto grande texto grande texto grande texto grande texto grande texto grande texto grande texto grande texto grande '
        cy.clock()
        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 }) //em const, criei uma constante chamada long text e escrevi um longo texto nela, em type eu chamei essa constante; o delay zero é para escrever rapido e o teste ser mais rapido
        cy.contains('button', 'Enviar').click() // ver no doc sobre contain //cy.get('button[type="submit"]').click() = pega uma classe do tipo botao com a propriedade de submit
            //ate aqui são apenas ações, com a linha abaixo que é uma verificação, temos o resultado esperado
        cy.get('.success').should('be.visible') //uma mensagem de sucesso com a classe chamada success deve ser visivil
            // aqui ele encontra o elemento success que tem como dever ser visivel, validando o teste
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {

        cy.clock()

        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes,gmail.com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click() //cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible') // no caso para validar um erro.. o campo email está invalido para esse teste
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    Cypress._.times(3, function() { //valida 3x esse mesmo teste
        it('validar que, se um valor não-numérico for digitado, seu valor continuará vazio', function() {

            cy.get('#phone') //o campo telefone
                .type('aygduyage') // preencher com nao numerico
                .should('have.value', '') //ja que nao passei numeros mas letras.. ele deve ficar vazio

        })
    })


    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()
        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes@gmail.com')
        cy.get('#phone-checkbox').click() //o checkbox do telefone será ticado, o que torna o campo o campo telefone obrigatório (mas nao sera preenchido)
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click() //cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')

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

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios',
        function() {
            cy.contains('button', 'Enviar').click()
            cy.get('.error').should('be.visible')
        })


    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit() //comando customizado criado em cypress/support/commands.js

        cy.get('.success').should('be.visible')
    })


    it('seleciona um produto (YouTube) por seu texto', function() { //observação, tem um por linha pois foi feito de forma encadeada
        cy.get('#product') //indico o seletor usando o cyget (seletor product(product é o ID)) 
            .select('YouTube') // uso o select indicando por texto que quero a opção youtbe
            .should('have.value', 'youtube') // aqui estou colocando a verificação do que deve ser (aqui está com minuscula pois estamos verif o valor e nao texto)
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback', function() {
        cy.get('input[type="radio"][value="feedback"]') // vou pegar um imput que vi usando o inspecionar, esse input é do tipo radio e tem valor feedback 
            .check() //e dou check para validar
            .should('have.value', 'feedback') // por fim, indicou que estou validando meu teste
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]') // aqui ele pega todas as opções de input do tipo radio
            .should('have.length', 3) //length é o comprimento, e temos 3 opções de radio
            .each(function($radio) { //o each recebe uma função de callback como argumento, que recebe como argumento cada um dos elementos que foi selecionado
                cy.wrap($radio).check() // uso o wrap para empacotar cada um desses radios
                cy.wrap($radio).should('be.checked') //do mesmo radio, para verificar que deve ter sido marcado, os 3.
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]') //pega todos os inputs do tipo checkbox, que sao dois
            .check() //faço a marcação
            .should('be.checked') //validei que ambos estão marcados
            .last() //escolho o ultimo, dos imputs de checkbox
            .uncheck() // dou nao check
            .should('not.be.checked') // e faço a validação
    })

    it('Revise mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()
        cy.get('#firstName').type('Monique')
        cy.get('#lastName').type('Guimarães')
        cy.get('#email').type('monique.pguimaraes@gmail.com')
        cy.get('#phone-checkbox').check() //alteramos o .click para o .check por uma questão de semantica
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click() //cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]') // poderia usar o ID que é cy.get('#file-upload')
            .should('not.have.value') // confirmo que ainda nao tem nada selecionado
            .selectFile('./cypress/fixtures/example.json') //add um arquivo nele
            .should(function($input) { //passei uma função que tem como argumento o input do file (que é o elemento)
                expect($input[0].files[0].name).to.equal('example.json') //passo o caminho do arquivo com o nome para verificar
            })

    })

    it('seleciona um arquivo simulando um drag-and-drop', function() { //drag-and-drop é arrastar e soltar
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' }) //simula que está arrastando e soltando para anexar actior é a ação 
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json') //passo o caminho do arquivo com o nome para verificar
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile') //cy.fixture para pegar a fixture example, as é como 
        cy.get('input[type="file"]')
            .selectFile('@sampleFile') //ao inves de passar todo o caminho anterior, passa o alias
            .should(function($input) { //copio a verificação anterior
                expect($input[0].files[0].name).to.equal('example.json') //passo o caminho do arquivo com o nome para verificar
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank') //o elemento chama privacy mas o link é um a. Faz uma verificação de que tem um atributo (attr), o atributo que iremos verificar pe o target, e  valor do target é _blank
            //esse teste valida que quando clicado em polita de provacidade, o link será aberto em uma nova aba
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //removi o target
            .click()
        cy.contains('Talking About Testing').should('be.visible') //fazendo a validação que a pagina foi aberta na mesma aba, só que validando atraves do texto    
    })

    //ex aula 11, com .clock e .tick no teste de 'preenche os campos obrigatórios e envia o formulário'

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', function() {
        const longText = Cypress._.repeat('0123456789', 20) //texto longo que repetira 20x os numeros na string

        cy.get('#open-text-area') //area de texto
            .invoke('val', longText) //incova um valor dessa area de texto, e seta nesse valoro longtext passado anteriomente
            .should('have.value', longText)
    })

    it('faz uma requisição HTTP', function() {

        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html') //passo como parametro a url da requisição
            .should(function(resposta) { //na minha validação, meu argumento é uma função de callback, que vai receber a resposta da requisição
                //console.log(resposta) //vejo pelo log o que acontece quando a requisição é passada, body, headers, status, status text e outros
                const { status, statusText, body } = resposta // desestruturo a resposta do console, criando 3 variaveis numa linha só que me traz apenas as infos que quero para o ex. tudo isso a partir da 'resposta'
                expect(status).to.equal(200) // esperado que status é = 200
                expect(statusText).to.equal('OK') // esperado que status texto é uma string OK
                expect(body).to.include('CAC TAT') // esperado que o body inclua a string cac tat
            })

    })

    it.only('Encontre o gato', function() {
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT')
        cy.get('#subtitle')
            .invoke('text', 'OLHEM ESSA JUJUBINHA')
    })
})