const app = require('./app/app');
const { PORT } = require('./config/config');
const { mongoConnect } = require('./config/mongo');

mongoConnect(() => {
    console.log("Mongo connected!")
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
})