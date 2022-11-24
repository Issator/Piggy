const app = require('../../app/app')
const request = require('supertest')

describe("POST /users/signup", () => {
    test("should create user", async () => {
        const req = {
            email: "example@email.com",
            password: "My_P455w0rd",
            login: "exampleUser",
        }

        const response = await request(app).post("/users/signup").send(req)
        expect(response.statusCode).toBe(201)
        expect(response.body.email).toBe(req.email)
        expect(response.body.login).toBe(req.login)
    })

    test("should fail validation (no email)", async () => {
        const req = {
            password: "My_P455w0rd",
            login: "exampleUser",
        }

        const response = await request(app).post("/users/signup").send(req)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })

    test("should fail password validation", async () => {
        const req = {
            password: "password",
            login: "exampleUser",
            email: "example@email.com"
        }

        const response = await request(app).post("/users/signup").send(req)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })
})

describe("POST /users/signin", () => {
    const params = {
        email: "signIn@Test.com",
        password: "My_P455w0rd",
        login: "signIn",
    }

    beforeAll(async () => {
        await request(app).post('/users/signup').send(params)
    })

    test("should login user user", async () => {
        const req = {
            password: params.password,
            login: params.login,
        }

        const response = await request(app).post("/users/signin").send(req)
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBeDefined()
        expect(response.body.token).toBeDefined()
    })

    test("should fail validation (user dont exist)", async () => {
        const req = {
            password: params.password,
            login: "Non_existing_user",
        }

        const response = await request(app).post("/users/signin").send(req)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })

    test("should fail password validation", async () => {
        const req = {
            password: "wrong_password",
            login: params.login,
        }

        const response = await request(app).post("/users/signin").send(req)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })
})