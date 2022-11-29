const { CalculateCosts } = require("../../app/functions/CalculateCosts")

describe("CalculateCosts tests", () => {

    let tenDaysLater = new Date()
    tenDaysLater = tenDaysLater.setDate(tenDaysLater.getDate() + 10);

    const DEFAULT = {
        total: 2000,
        endDate: tenDaysLater,
        payments: [
            {amount: 100},
            {amount: 150},
            {amount: 200},
        ]
    }
    test("should throw error - invalid cost", () => {

        const result = () => {CalculateCosts(-200, DEFAULT.endDate, DEFAULT.payments)}
        expect(result).toThrow("Invalid Total!")
    })

    test("should throw error - invalid cost", () => {
        let date = new Date()
        date = date.setDate(date.getDate() - 1);

        const result = () => {CalculateCosts(DEFAULT.total, date, DEFAULT.payments)}
        expect(result).toThrow("Invalid Date!")
    })

    test("should return rest and daily cost | test-1", () => {

        const result = CalculateCosts(DEFAULT.total, DEFAULT.endDate, DEFAULT.payments)
        expect(result.left).toBe(1550)
        expect(result.daily).toBe('155.00')
    })

    test("should return rest and daily cost | test-2", () => {
        let hundredDaysLater = new Date()
        hundredDaysLater = hundredDaysLater.setDate(hundredDaysLater.getDate() + 100);

        const result = CalculateCosts(DEFAULT.total, hundredDaysLater, DEFAULT.payments)
        expect(result.left).toBe(1550)
        expect(result.daily).toBe('15.50')
    })

    test("should return rest and daily cost | test-3", () => {
        const newPayments = [
            {amount: 100},
            {amount: 150},
            {amount: 200},
            {amount: 600},
        ]

        const result = CalculateCosts(DEFAULT.total, DEFAULT.endDate, newPayments)
        expect(result.left).toBe(950)
        expect(result.daily).toBe('95.00')
    })

    test("should return total cost and daily cost (no payments)", () => {
        const newPayments = []

        const result = CalculateCosts(DEFAULT.total, DEFAULT.endDate, newPayments)
        expect(result.left).toBe(DEFAULT.total)
        expect(result.daily).toBe('200.00')
    })
})