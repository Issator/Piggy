const Validate = require("../../app/Functions/Validate")

describe("password", () => {
    const validate = Validate.password
    test("correct", () => {
        expect(validate("ExamplePassword123!@#")).toBe(true)
        expect(validate("S0m3Pa55woRD!")).toBe(true)
        expect(validate("Hel!c0pTeR")).toBe(true)
        expect(validate("mY_sUPER_P455woRD")).toBe(true)
    })

    test("incorrect", () => {
        expect(validate("Aa!0")).toBe(false)
        expect(validate("password123!@#")).toBe(false)
        expect(validate("PASSWORD123!@#")).toBe(false)
        expect(validate("Password123")).toBe(false)
        expect(validate("Password!")).toBe(false)
    })
})

describe("email", () => {
    const validate = Validate.email
    test("correct", () => {
        expect(validate("example@email.com")).toBe(true)
        expect(validate("myEmail123@shop.ofice.eu")).toBe(true)
        expect(validate("university@Uni.student.pl")).toBe(true)
        expect(validate("SuperMail123@myMail.com")).toBe(true)
    })

    test("incorrect", () => {
        expect(validate("mail")).toBe(false)
        expect(validate("myMail.com")).toBe(false)
        expect(validate("john@mail")).toBe(false)
        expect(validate("@mail.com")).toBe(false)
        expect(validate("john123@.com")).toBe(false)
        expect(validate("john.com@mail")).toBe(false)
    })
})

describe("post user", () => {
    const validate = Validate.postUser
    test("correct", () => {

        const test1 = {
            login: "john123",
            password: "My_Password123!",
            email: "johny@mail.com"
        }
        expect(validate(test1)).toBe(true)

        const test2 = {
            login: "-_U55er_-",
            password: "H3l|c0pT3R",
            email: "jahal45@supermail.eu"
        }
        expect(validate(test2)).toBe(true)

        const test3 = {
            login: "Thomas Johns",
            password: "P4ssW0RD!",
            email: "TJohns@company.tech.com"
        }
        expect(validate(test3)).toBe(true)
    })

    test("correct", () => {

        //wrong password
        const test1 = {
            login: "john123",
            password: "Password",
            email: "johny@mail.com"
        }
        expect(validate(test1)).toBe(false)

        //no login
        const test2 = {
            password: "H3l|c0pT3R",
            email: "jahal45@supermail.eu"
        }
        expect(validate(test2)).toBe(false)

        //no mail
        const test3 = {
            login: "Thomas Johns",
            password: "P4ssW0RD!",
        }
        expect(validate(test3)).toBe(false)
    })
})

describe("time", () => {
    const validate = Validate.time
    test("correct", () => {
        // string value
        expect(validate("2040-12-7")).toBe(true)

        //different structure
        expect(validate("8.07.2040")).toBe(true)

        // date
        let tenDays = new Date()
        tenDays.setDate(tenDays.getDate() + 10)
        expect(validate(tenDays)).toBe(true)
    })

    test("incorrect", () => {
        // not a date
        expect(validate("Aa!0")).toBe(false)

        // date too old
        expect(validate("2010-5-4")).toBe(false)
    })
})