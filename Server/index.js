const app = require('./app/app')

const PORT = 4200

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})