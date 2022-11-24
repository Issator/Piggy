const getById = (req, res, next) => {
    // Should return saving by given id
    // GET saving/:ID
    res.send("Get Saving")
}

const getByUserId = (req, res, next) => {
    // Should return all product user is saving
    // show currently saving / saved / all
    // GET saving/user/:ID
    res.send("Get savings of user")
}

const post = (req, res, next) => {
    // Should create saving
    // POST saving/add
    res.send("Create Saving")
}

const update = (req, res, next) => {
    // Should update saving by given id
    // PUT saving/:ID
    res.send("Update Saving")
}

const remove = (req, res, next) => {
    // Should delete saving by given id
    // DEL saving/:ID
    res.send("Delete Saving")
}

module.exports = {
    getById,
    post,
    update,
    remove,
    getByUserId
}