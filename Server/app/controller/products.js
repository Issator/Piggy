const getById = (req, res, next) => {
    // Should return product by given id
    // GET product/:ID
    res.send("Get Products")
}

const post = (req, res, next) => {
    // Should create product
    // POST product/add
    res.send("Create Product")
}

const update = (req, res, next) => {
    // Should update product by given id
    // PUT product/:ID
    res.send("Update Product")
}

const remove = (req, res, next) => {
    // Should delete product by given id
    // DEL product/:ID
    res.send("Delete Product")
}

module.exports = {
    getById,
    post,
    update,
    remove
}