const { CalculateCosts } = require("../../app/functions/CalculateCosts")

describe("CalculateCosts tests", () => {
    const DEFAULT = {
        total: 2000,
        endDate: '2022-01-12',
        payments: [
            {amount: 100},
            {amount: 150},
            {amount: 200},
        ]
    }
    test("should return null - invalid cost", () => {
        const values = DEFAULT
        values.total = -200

        const result = CalculateCosts(values.total,values.endDate,values.payments)
        expect(result).toThrow("Invalid Total!")
    })

    test("should return rest and daily cost", () => {

        const result = CalculateCosts(DEFAULT.total,DEFAULT.endDate,DEFAULT.payments)
        expect(result.left).toBe(1550)
        expect(result.daily).toBeDefined()
    })
})