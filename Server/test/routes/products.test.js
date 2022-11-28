const app = require('../../app/app')
const request = require('supertest')

/**
 * Request for login user into server to receive token.
 * Used in test for code refactor
 * 
 * @param {Object} userData - user data
 * @param {string} userData.password - user password
 * @param {string} userData.login    - user login
 * @returns {Promise<string>} access token
 */
const getToken = async (userData) => {
    const response = await request(app).post('/users/signin').send(userData)
    return response.body.token
}

/**
 * Request for create user and log into server to receive token and id.
 * Used in test for code refactor
 * 
 * @param {Object} userData          - user data
 * @param {string} userData.password - user password
 * @param {string} userData.login    - user login
 * @param {string} userData.email    - user email
 * @returns {Promise<{token: string, id: number}>} access token
 */
const createDummyUser = async (userData) => {
    const response = await request(app).post('/users/signup').send(userData)
    if(response.ok) {
        const token = await getToken({login: userData.login, password: userData.password})
        return {token: token, id: response.body.id}
    }else{
        return {token: null, id: null}
    }
}

/**
 * Request for create product to receive id.
 * Used in test for code refactor
 * @param {string} token - user token
 * 
 * @param {Object} productData          - product data
 * @param {string} productData.name     - product name
 * @param {string} productData.cost     - product cost
 * @param {string} productData.end_date - product end date
 * @returns {Promise<number>} access token
 */
 const createDummyProduct = async (productData, token) => {
    const response = await request(app).post('/products/add').send(productData).set('token', token)
    if(response.ok) {
        return response.body.id
    }else{
        return null
    }
}

// TODO: Connect with payments logic
describe("Test products", () => {

    let dummy_token = ''
    let dummy_id = 0

    beforeAll(async () => {
        const dummyUser = {
            "login": "Dummy_User_Products",
            "password": "Dummy_User_Products_P455WORD!",
            "email": "DummyUserProducts@piggy.com"
        }

        const response = await createDummyUser(dummyUser)
        if (response.token){
            dummy_token = response.token
            dummy_id = response.id
        }
    })

    describe("POST /products/add", () => {
        test("should create product", async () => {
            const req = {
                name: "New shiny TV",
                cost: "2500",
                end_date: "2024-12-31"
            }
    
            const response = await request(app).post("/products/add").send(req).set("token", dummy_token)
            expect(response.statusCode).toBe(201)
            expect(response.body.id).toBeDefined()
            expect(response.body.name).toBe(req.name)
            expect(response.body.cost).toBe(+req.cost)
            expect(response.body.end_date).toBe(req.end_date)
            expect(response.body.end_savings).toBeDefined()
            expect(response.body.user_id).toBe(dummy_id)
        })
    
        test("should fail validation (invalid price)", async () => {
            const req = {
                name: "Fancy T-shirt",
                cost: "-10.50",
                end_date: "2024-12-31"
            }
    
            const response = await request(app).post("/products/add").send(req).set("token", dummy_token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    
        test("should fail validation (invalid time)", async () => {
            const req = {
                name: "Time machine",
                cost: "199.99",
                end_date: "2018-12-31"
            }
    
            const response = await request(app).post("/products/add").send(req).set("token", dummy_token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })

    })

    describe("GET /products/:id", () => {
        test("id: 1-> should return product with id = 1", async () => {
            const response = await request(app).get("/products/1").set("token",dummy_token)
            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBeDefined()
            expect(response.body.name).toBeDefined()
            expect(response.body.cost).toBeDefined()
            expect(response.body.end_date).toBeDefined()
            expect(response.body.end_savings).toBeFalsy()
        })
    
        test("id: -1 -> should return error because product dont exist", async () => {
            const response = await request(app).get("/products/-1").set("token",dummy_token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    })

    describe("PUT /products/:id", () => {

        let dummyProduct = {
            "name": "Dummy to deleting",
            "cost": "2050.50",
            "end_date": "2030-12-12"
        }
    
        let dummy_id = 0
    
    
        beforeEach(async () => {
            const product_id = await createDummyProduct(dummyProduct,dummy_token)
            if (product_id) { dummy_id = product_id }
        })

        afterEach(async () => {
            const response = await request(app).del("/products/" + dummy_id).set("token",dummy_token)
        })


        test("should update product", async () => {

            // change value
            const req = {
                name: "Even more shinny TV!"
            }
    
            //send request
            const response = await request(app).put("/products/" + dummy_id).send(req).set("token", dummy_token)
            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBeDefined()
            expect(response.body.name).toBe(req.name)
            expect(response.body.end_date).toBeDefined()
            expect(response.body.cost).toBeDefined()
            expect(response.body.end_savings).toBeDefined()
        })
    
        test("should fail (price validation)", async () => {
    
            // change value
            const req = {
                name: "TV with nice promo!",
                cost: "-100.95"
            }
    
            //send request
            const response = await request(app).put("/products/" + dummy_id).send(req).set("token", dummy_token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    
        test("should fail (Permission denied)", async () => {
            
            //login test user to get token
            const login = {
                "login": "Test_User_02",
                "password": "TestUser_02_P455WORD!"
            }
            const token = await getToken(login)
    
            // change value
            const req = {
                name: "Plot twist, its a scam TV",
                cost: "1999.99"
            }
    
            //send request
            const response = await request(app).put("/products/" + dummy_id).send(req).set("token", token)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })
    
        test("should update product (admin)", async () => {
    
            // login test admin to get token
            const login = {
                "login": "Test_Admin",
                "password": "TestAdmin_P455WORD!"
            }
            
            const token = await getToken(login)
            
            // change value
            const req = {
                name: "No, its good TV!",
                cost: "750.00"
            }
    
            //send request
            const response = await request(app).put("/products/" + dummy_id).send(req).set("token", token)
            expect(response.statusCode).toBe(200)
            expect(response.body.id).toBeDefined()
            expect(response.body.login).toBe(req.login)
            expect(response.body.name).toBe(req.name)
            expect(+response.body.cost).toBe(+req.cost)
        })
    
        // NOTE: It work itself but not with rest? (when is lest than 0 ????)
        test("should fail (product dont exist)", async () => {
            
            // login test admin to get token
            const login = {
                "login": "Test_Admin",
                "password": "TestAdmin_P455WORD!"
            }
    
            const token = await getToken(login)
    
            // change value
            const req = {
                name: "Its not even exist"
            }
    
            //send request
            const response = await request(app).put("/products/10000").send(req).set("token", token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    })

    describe("DEL /products/:id", () => {
    
        let dummyProduct = {
            "name": "Dummy to deleting",
            "cost": "2050.50",
            "end_date": "2030-12-12"
        }
    
        let dummy_id = 0
    
    
        beforeEach(async () => {
            const product_id = await createDummyProduct(dummyProduct,dummy_token)
            if (product_id) { dummy_id = product_id }
        })
    
        test("Should fail (permission denied)", async () => {

            //log different user
            const login = {
                "login": "Test_User",
                "password": "TestUser_P455WORD!",
            }
            const token = await getToken(login)

            const response = await request(app).del("/products/" + dummy_id).set("token",token)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })

        test("should delete product (delete by ower)", async () => {
    
            const response = await request(app).del("/products/" + dummy_id).set("token",dummy_token)
            expect(response.statusCode).toBe(200)
            expect(response.body.name).toBeDefined()
            expect(response.body.end_date).toBeDefined()
            expect(response.body.cost).toBeDefined()
        })

        // TODO: Add admin permission
        // test("should delete product (admin permission)", async () => {
        //     //login test user to get token
        //     const login = {
        //         "login": "Test_Admin",
        //         "password": "TestAdmin_P455WORD!"
        //     }
        //     const admin_token = await getToken(login)
    
        //     const response = await request(app).del("/products/" + dummy_id).set("token",admin_token)
        //     expect(response.statusCode).toBe(200)
        //     expect(response.body.name).toBeDefined()
        //     expect(response.body.end_date).toBeDefined()
        //     expect(response.body.cost).toBeDefined()
        // })

        // NOTE: It work itself but not with rest? (when is lest than 0 ????)
        test("should fail (product dont exist)", async () => {
            //login test user to get token
            const login = {
                "login": "Test_Admin",
                "password": "TestAdmin_P455WORD!"
            }
            const admin_token = await getToken(login)
    
            const response = await request(app).del("/products/100").set("token",admin_token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    })

})



