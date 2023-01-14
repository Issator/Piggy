const app = require('../../app/app')
const request = require('supertest')
const { getDB } = require('../../config/mongo')
const {MongoClient} = require('mongodb');

let connection;
let db;

jest.mock('../../config/mongo', () => ({
    getDB: jest.fn()
}))

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
        return {token: token, _id: response.body._id}
    }else{
        return {token: null, _id: null}
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
        return response.body._id
    }else{
        return null
    }
}

describe("Test products", () => {

    let dummy_token = ''
    let dummy_id = 0

    const ADMIN_DATA = {
        "login": "Test_Admin_for_users",
        "password": "TestAdmin_P455WORD!",
        "status": "admin"
    }

    beforeAll(async () => {
        // connect to db
        connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        db = await connection.db(globalThis.__MONGO_DB_NAME__);
        await db.collection('users').insertOne(ADMIN_DATA)
        getDB.mockReturnValue(db)

        // create dummy user
        const dummyUser = {
            "login": "Dummy_User_Products",
            "password": "Dummy_User_Products_P455WORD!",
            "email": "DummyUserProducts@piggy.com"
        }

        const response = await createDummyUser(dummyUser)
        if (response.token){
            dummy_token = response.token
            dummy_id = response._id
        }
    });

    afterAll(async () => {
        await connection.close();
    });

    describe("POST /products/add", () => {
        test("should create product", async () => {
            const req = {
                name: "New shiny TV",
                cost: "2500",
                end_date: "2024-12-31"
            }
    
            const response = await request(app).post("/products/add").send(req).set("token", dummy_token)
            expect(response.statusCode).toBe(201)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe(req.name)
            expect(response.body.cost).toBe(+req.cost)
            expect(response.body.end_date).toBe(req.end_date)
            expect(response.body.end_saving).toBeDefined()
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

    describe("GET /product/getUsers/:id", () => {

        test("should get products", async () => {
            
            //send request
            const response = await request(app).get("/products/getUsers/" + dummy_id).set("token", dummy_token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeDefined()

            // if array not empty
            if(response.body.length > 0){
                response.body.forEach(element => {                   
                    expect(element._id).toBeDefined()
                    expect(element.name).toBeDefined()
                    expect(element.cost).toBeDefined()
                    expect(element.left).toBeDefined()
                    expect(element.daily).toBeDefined()
                    expect(element.end_date).toBeDefined()
                    expect(element.end_savings).toBeFalsy()
                });
            }
        })

        test("should fail (Permission denied)", async () => {
            
            //login test user to get token
            const dummyUser = {
                "login": "Dummy_User_GUP_F01",
                "password": "Dummy_User_GUP_F01_P455WORD!",
                "email": "DummyUser_GUP_F01@piggy.com"
            }
            const {token,_id} = await createDummyUser(dummyUser)
    
    
            //send request
            const response = await request(app).get("/products/getUsers/" + dummy_id).set("token", token)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })
    })

    describe("POST /product/payment", () => {

        let dummyProduct = {
            "name": "Dummy for testing payments",
            "cost": "2050.00",
            "end_date": "2030-12-12"
        }
    
        let dummy_id = 0
    
    
        beforeAll(async () => {
            const product_id = await createDummyProduct(dummyProduct,dummy_token)
            if (product_id) { dummy_id = product_id }
        })

        test("should fail - invalid value", async () => {
            const req = {
                id: dummy_id,
                amount: -100
            }

            const response = await request(app).post("/products/payment").set("token", dummy_token).send(req)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })

        test("should fail - product dont exist", async () => {
            const req = {
                id: -100,
                amount: 100
            }

            const response = await request(app).post("/products/payment").set("token", dummy_token).send(req)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })

        test("should fail - permission denied", async () => {
            //login test user to get token
            const dummyUser = {
                "login": "Dummy_User_GUP_F02",
                "password": "Dummy_User_GUP_F02_P455WORD!",
                "email": "DummyUser_GUP_F02@piggy.com"
            }
            const {token} = await createDummyUser(dummyUser)

            const req = {
                id: dummy_id,
                amount: 100
            }

            const response = await request(app).post("/products/payment").set("token", token).send(req)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })

        test("should add payment to product", async () => {

            const req = {
                id: dummy_id,
                amount: 50
            }

            const response = await request(app).post("/products/payment").set("token", dummy_token).send(req)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(201)
            expect(response.body._id).toBeDefined()
            expect(response.body.product_id).toBe(req.id)
            expect(response.body.amount).toBe(req.amount)
            expect(response.body.pay_date).toBeDefined()
        })

        test("should add payment to product and change flag to of end_savings", async () => {

            const req = {
                id: dummy_id,
                amount: 2000
            }

            const response = await request(app).post("/products/payment").set("token", dummy_token).send(req)
            expect(response.statusCode).toBe(201)
            expect(response.body._id).toBeDefined()
            expect(response.body.product_id).toBe(req.id)
            expect(response.body.amount).toBe(req.amount)
            expect(response.body.pay_date).toBeDefined()

            const  prodResponse = await request(app).get("/products/" + dummy_id).set("token",dummy_token)
            expect(prodResponse.body.message).not.toBeDefined()
            expect(prodResponse.statusCode).toBe(200)
            expect(prodResponse.body._id).toBeDefined()
            expect(prodResponse.body.name).toBeDefined()
            expect(prodResponse.body.cost).toBeDefined()
            expect(prodResponse.body.end_date).toBeDefined()
            expect(+prodResponse.body.left).toBe(0)
            expect(+prodResponse.body.daily).toBe(0)
            expect(prodResponse.body.end_saving).toBeTruthy()
        })
    })

    describe("GET /products/:id", () => {

        let dummyProduct = {
            "name": "Dummy for testing Get",
            "cost": "2050.50",
            "end_date": "2030-12-12"
        }
    
        let dummy_id = 0
    
    
        beforeAll(async () => {
            const product_id = await createDummyProduct(dummyProduct,dummy_token)
            if (product_id) { dummy_id = product_id }
        })

        test("should return product", async () => {
            const response = await request(app).get("/products/" + dummy_id).set("token",dummy_token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBeDefined()
            expect(response.body.cost).toBeDefined()
            expect(response.body.end_date).toBeDefined()
            expect(response.body.end_savings).toBeFalsy()
            expect(response.body.daily).toBeDefined()
            expect(response.body.left).toBeDefined()
        })

        test("full -> should return full product", async () => {
            const response = await request(app).get("/products/" + dummy_id + "?full=true").set("token",dummy_token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBeDefined()
            expect(response.body.cost).toBeDefined()
            expect(response.body.end_date).toBeDefined()
            expect(response.body.end_savings).toBeFalsy()
            expect(response.body.payments).toBeDefined()
            expect(response.body.daily).toBeDefined()
            expect(response.body.left).toBeDefined()
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
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe(req.name)
            expect(response.body.end_date).toBeDefined()
            expect(response.body.cost).toBeDefined()
            expect(response.body.end_saving).toBeDefined()
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
            const dummyUser = {
                "login": "Dummy_User_GUD_F01",
                "password": "Dummy_User_GUD_F01_P455WORD!",
                "email": "DummyUser_GUD_F01@piggy.com"
            }
            const {token} = await createDummyUser(dummyUser)
    
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
            
            // change value
            const req = {
                name: "No, its good TV!",
                cost: "750.00"
            }

            const admin_token = await getToken(ADMIN_DATA)

            //send request
            const response = await request(app).put("/products/" + dummy_id).send(req).set("token", admin_token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.login).toBe(req.login)
            expect(response.body.name).toBe(req.name)
            expect(+response.body.cost).toBe(+req.cost)
        })
    
        test("should fail (product dont exist)", async () => {   
            // change value
            const req = {
                name: "Its not even exist"
            }
    
            //send request
            const response = await request(app).put("/products/10000").send(req).set("token", dummy_token)
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
            const dummyUser = {
                "login": "Dummy_User_GUP_F03",
                "password": "Dummy_User_GUP_F03_P455WORD!",
                "email": "DummyUser_GUP_F03@piggy.com"
            }
            const {token} = await createDummyUser(dummyUser)

            const response = await request(app).del("/products/" + dummy_id).set("token",token)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })

        test("should delete product (delete by ower)", async () => {
    
            const response = await request(app).del("/products/" + dummy_id).set("token",dummy_token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body.name).toBeDefined()
            expect(response.body.end_date).toBeDefined()
            expect(response.body.cost).toBeDefined()
        })

        test("should delete product (admin permission)", async () => {

            const admin_token = await getToken(ADMIN_DATA)
    
            const response = await request(app).del("/products/" + dummy_id).set("token", admin_token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body.name).toBeDefined()
            expect(response.body.end_date).toBeDefined()
            expect(response.body.cost).toBeDefined()
        })

        test("should fail (product dont exist)", async () => {
    
            const response = await request(app).del("/products/100").set("token", dummy_token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    })

})