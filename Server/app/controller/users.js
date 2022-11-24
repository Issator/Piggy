const getById = (req, res, next) => {
    // Should return user by given id
    // GET user/:ID
    res.send("Get User")
}

const signUp = (req, res, next) => {
    // Should create user
    // POST user/signup
    res.send("Create User")
}

const signIn = (req, res, next) => {
    // Should sign in user
    // POST user/signin
    res.send("Sign in User")
}

const update = (req, res, next) => {
    // Should update user by given id
    // PUT user/:ID
    res.send("Update user")
}

const remove = (req, res, next) => {
    // Should delete user by given id
    // DEL user/:ID
    res.send("Delete user")
}

module.exports = {
    getById,
    signIn,
    signUp,
    update,
    remove
}