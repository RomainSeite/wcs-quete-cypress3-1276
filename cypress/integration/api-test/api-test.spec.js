const datas = require('../../fixtures/query-data');

datas.forEach(data => {
    
    describe(`API TEST case ${data.testCase}`, () => {
        
        beforeEach(() => {
            cy.requestApi(data.query.q, data.query.type, data.query.limit).then(response => {
                cy.wrap(response).as('response')
                })
            })
        
        it(`has ${data.expected.status} status`, () => {
            cy.get('@response').its('status').should('eq', 200)
        })

        it(`has ${data.expected.format} format`, () => {
            cy.get("@response")
                .its("headers")
                .its('content-type').should('include', data.expected.format);
        });

        it(`Response has "info" property which is an array of length ${data.query.q.length}`, () => {
            cy.get("@response").then(response => {
                expect(response.body).has.property('Similar')
                expect(response.body.Similar)
                    .has.property("Info")
                    .is.an("array")
                    .has.lengthOf(data.query.q.length);
            })
        });

        const resultCount = !isNaN(data.query.limit) ? data.query.limit : 20
        it(`Response has "results" property which is an array of length <= ${resultCount}`, () => {
            cy.get("@response").then(response => {
                expect(response.body).has.property('Similar')
                expect(response.body.Similar).has.property('Results').is.an('array').has.lengthOf.lte(resultCount)
            })
        });

        it(`Each result has type = "${data.expected.type}"`, () => {
            cy.get("@response").then(response => {
                response.body.Similar.Results.forEach(result => {
                    expect(result.Type).to.eq(data.expected.type)
                })
            })
        });
    })  
})