describe("POST /api/auth", () => {
    it("Deve retornar o status 201 quando a autenticação for válida", () => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "DesafioTecnico5150#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("token");
        });
    });

    it("Deve retornar o status 500 quando a autenticação for inválida", () => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "Senha1672#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(500);
        });
    });
});

describe("GET /api/customers", () => {
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "DesafioTecnico5150#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("token");
        });
    })

    it("Deve retornar o status 200 quando consultar a rota /customers", () => {
        cy.request({
            method: "GET",
            url: `${Cypress.env("API_BACKEND")}/api/customers`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("clientes");
        });
    });

    it("Deve retornar o status 200 quando consultar a rota /customers?orderBy=email", () => {
        cy.request({
            method: "GET",
            url: `${Cypress.env("API_BACKEND")}/api/customers?orderBy=email`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("clientes");
        });
    });
});

describe("POST /api/customers", () => {
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "DesafioTecnico5150#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("token");
        });
    })

    it("Deve retornar o status 500 quando enviar payload incompleto", () => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/customers`,
            body: {
                name: "Ruan Vitor",
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body).to.have.property("error", "Missing payload name or email!")
        });
    });

    it("Deve retornar o status 500 quando utilizar um e-mail já existente", () => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/customers`,
            body: {
                name: "Ruan Vitor",
                email: "ruanvitor@hotmail.com",
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body).to.have.property("error", "Email already in user!")
        });
    });

    it("Deve retornar o status 201 quando criar um novo cliente", () => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/customers`,
            body: {
                name: "Usuário de teste cypress",
                email: "cypres-teste-@nextjs.com",
            },
            headers: {
                "origin": "cypress"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("created", true)
        });
    });

    it("Deve deletar o usuário criado", () => {
        cy.request({
            method: "DELETE",
            url: `${Cypress.env("API_BACKEND")}/api/customers/cypress`,
            headers: {
                "origin": "cypress"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("deleted", true)
        });
    });
});

describe("GET /api/customers/:id", () => {
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "DesafioTecnico5150#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("token");
        });
    })

    it("Deve retornar o status 200 quando consultar a rota /customers/:id", () => {
        cy.request({
            method: "GET",
            url: `${Cypress.env("API_BACKEND")}/api/customers/686294b8af5e62a0133330db`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("cliente");
        });
    });
});

describe("PUT /api/customers/:id", () => {
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "DesafioTecnico5150#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("token");
        });
    })

    it("Deve retornar o status 200 quando alterar informações do usuário", () => {
        cy.request({
            method: "PUT",
            url: `${Cypress.env("API_BACKEND")}/api/customers/686294b8af5e62a0133330db`,
            body: {
                name: `Ruan Vitor Elpidio ${Math.random() * 7}`,
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

describe("GET /api/statistics", () => {
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "DesafioTecnico5150#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("token");
        });
    })

    it("Deve retornar o status 200 quando consultar a rota /statistics", () => {
        cy.request({
            method: "GET",
            url: `${Cypress.env("API_BACKEND")}/api/statistics`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("total_sales_per_day")
        });
    });
});

describe("GET /api/statistics/average", () => {
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_BACKEND")}/api/auth`,
            body: {
                email: "ruan.elpidio@hotmail.com",
                password: "DesafioTecnico5150#"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("token");
        });
    })

    it("Deve retornar o status 200 quando consultar a rota /statistics/average", () => {
        cy.request({
            method: "GET",
            url: `${Cypress.env("API_BACKEND")}/api/statistics/average`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("cliente_com_maior_vendas")
            expect(response.body).to.have.property("cliente_com_maior_media_de_vendas")
            expect(response.body).to.have.property("cliente_com_maior_numero_de_dias_unicos_com_vendas_registradas")
        });
    });
});
