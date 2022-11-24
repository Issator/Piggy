const getById = (req, res, next) => {
    // Should return one payment by given id
    // GET payment/:ID
    res.send("Get Payments")
}

const getByProductId = (req, res, next) => {
    // Should get all payments for one product
    // GET payment/list/:ID
    res.send("Get payments list")
}

const post = (req, res, next) => {
    // Should create payment
    // POST payment/add
    res.send("Create Payment")
}

const update = (req, res, next) => {
    // Should update payment by given id
    // PUT payment/:ID
    res.send("Update Payment")
}

const remove = (req, res, next) => {
    // Should delete payment by given id
    // DEL payment/:ID
    res.send("Delete Payment")
}

module.exports = {
    getById,
    post,
    update,
    remove,
    getByProductId
}