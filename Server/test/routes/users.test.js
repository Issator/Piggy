const app = require('../../app/app')
const request = require('supertest')
const { getDB } = require('../../config/mongo')
const {MongoClient} = require('mongodb');
const { ObjectId } = require('mongodb')

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

describe("Test users", () => {

    const ADMIN_DATA = {
        "login": "Test_Admin_for_users",
        "password": "TestAdmin_P455WORD!",
        "status": "admin"
    }

    beforeAll(async () => {
        connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        db = await connection.db(globalThis.__MONGO_DB_NAME__);

        // add admin
        db.collection('users').insertOne(ADMIN_DATA)

        //create
        getDB.mockReturnValue(db)
    });

    afterAll(async () => {
        await connection.close();
    });

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
            expect(response.body._id).toBeDefined()
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
    //TODO: add to swagger
    describe("GET /users", () => {

        test("should return all users", async () => {
            const response = await request(app).get("/users")
            expect(response.statusCode).toBe(200)
            if(response.body.length > 0){
                response.body.forEach(element => {  
                    expect(element._id).toBeDefined()
                    expect(element.login).toBeDefined()
                    expect(element.status).toBeDefined()
                })
            }
        })

    })
    
    describe("GET /users/:id", () => {

        test("should return user", async () => {
            const req = {
                email: "GET_TEST_01@email.com",
                password: "My_P455w0rd",
                login: "GET_TEST_01",
            }
    
            const creteUser = await request(app).post("/users/signup").send(req)
            const userId = creteUser.body._id

            const response = await request(app).get("/users/" + userId)
            expect(response.statusCode).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.login).toBeDefined()
            expect(response.body.status).toBeDefined()
        })
    
        test("should return error because user dont exist", async () => {
            const response = await request(app).get("/users/" + new ObjectId())
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    })
    
    describe("PUT /users/:id", () => {
        test("should update user", async () => {
            
            //login test user to get token
            const dummyUser = {
                "login": "Dummy_User_01",
                "password": "Dummy_User_01_P455WORD!",
                "email": "DummyUser01@piggy.com"
            }
            const {token,_id} = await createDummyUser(dummyUser)
    
    
            // change value
            const req = {
                login: "NEW_Login"
            }
    
            //send request
            const response = await request(app).put("/users/" + _id).send(req).set("token", token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.login).toBe(req.login)
            expect(response.body.status).toBeDefined()
        })
    
        test("should fail (password validation)", async () => {
            
            //login test user to get token
            const token = await getToken(ADMIN_DATA)
    
    
            // change value
            const req = {
                password: "invalidPassword"
            }
    
            //send request
            const response = await request(app).put("/users/1").send(req).set("token", token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    
        test("should fail (Permission denied)", async () => {

            //create test user
            const dummyUser = {
                "login": "Dummy_User_F_01",
                "password": "Dummy_User_F01_P455WORD!",
                "email": "DummyUserF01@piggy.com"
            }
            const {_id} = await createDummyUser(dummyUser)
            
            //login test user to get token
            const dummyUser2 = {
                "login": "Dummy_User_F_02",
                "password": "Dummy_User_F02_P455WORD!",
                "email": "DummyUserF02@piggy.com"
            }

            const {token} = await createDummyUser(dummyUser2)
    
            // change value
            const req = {
                login: "NEW_Login"
            }
    
            //send request
            const response = await request(app).put("/users/" + _id).send(req).set("token", token)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })
    
        test("should update user (admin)", async () => {
            
            //login test user to get token
            const dummyUser = {
                "login": "Dummy_User_02",
                "password": "Dummy_User_02_P455WORD!",
                "email": "DummyUser02@piggy.com"
            }
            const {_id} = await createDummyUser(dummyUser)
    
            // change value
            const req = {
                login: "NEW_Login_02"
            }
    
            // login admin
            const token = await getToken(ADMIN_DATA)
    
            //send request
            const response = await request(app).put("/users/" + _id).send(req).set("token", token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.login).toBe(req.login)
            expect(response.body.status).toBeDefined()
        })
    
        test("should fail (user dont exist)", async () => {
            
            // login test admin to get token
            const token = await getToken(ADMIN_DATA)
    
            // change value
            const req = {
                login: "NEW_Login"
            }
    
            //send request
            const response = await request(app).put("/users/-1").send(req).set("token", token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    })
    
    describe("DEL /users/:id", () => {
    
        let dummyUser = {
            "login": "Dummy_User_Del_01",
            "password": "Dummy_User_Del_01_P455WORD!",
            "email": "DummyUserDEL01@piggy.com"
        }
    
        let dummy_id = 0
        let dummy_token = ''
    
    
        beforeEach(async () => {
            const response = await createDummyUser(dummyUser)
            if (response._id)    { dummy_id = response._id }
            if (response.token) { dummy_token = response.token}
        })
    
        test("should fail (invalid password)", async () => {
    
            // change value
            const req = {
                password: "Wr0ng_Pa55W0RD!"
            }
    
            const response = await request(app).del("/users/" + dummy_id).send(req).set("token",dummy_token)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })
    
        test("Should fail (permission denied)", async () => {

            //login test user to get token
            const dummyUser2 = {
                "login": "Dummy_User_F_03",
                "password": "Dummy_User_F03_P455WORD!",
                "email": "DummyUserF03@piggy.com"
            }

            const {token} = await createDummyUser(dummyUser2)
            
            // change value
            const req = {
                password: dummyUser.password
            }
    
            const response = await request(app).del("/users/" + dummy_id).send(req).set("token",token)
            expect(response.statusCode).toBe(406)
            expect(response.body.message).toBeDefined()
        })
    
        test("should delete user (delete itself)", async () => {
    
            // change value
            const req = {
                password: dummyUser.password
            }
    
            const response = await request(app).del("/users/" + dummy_id).send(req).set("token",dummy_token)
            expect(response.body.message).not.toBeDefined()
            expect(response.statusCode).toBe(200)
            expect(response.body.login).toBeDefined()
            expect(response.body.email).toBeDefined()
            expect(response.body.password).toBeDefined()
        })
    
        test("should delete user (admin permission)", async () => {
            //login test user to get token
            const admin_token = await getToken(ADMIN_DATA)
    
    
            // change value
            const req = {
                password: ADMIN_DATA.password
            }
    
            const response = await request(app).del("/users/" + dummy_id).send(req).set("token",admin_token)
            expect(response.statusCode).toBe(200)
            expect(response.body.login).toBeDefined()
            expect(response.body.email).toBeDefined()
            expect(response.body.password).toBeDefined()
        })
    
        test("should fail (user dont exist)", async () => {
            //login test user to get token
            const admin_token = await getToken(ADMIN_DATA)
    
    
            // change value
            const req = {
                password: ADMIN_DATA.password
            }
    
            const response = await request(app).del("/users/-1").send(req).set("token",admin_token)
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toBeDefined()
        })
    })
})
