const path = require('path')
const express = require('express')

const pathProvider = path.join(__dirname + '/')
// console.log(pathProvider);


const PORT = process.env.PORT || 3000

const app = express()

app.use(express.static(pathProvider + 'public/'))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.listen(PORT, () => {
    console.log(`server is up listenig ${PORT}`)
    console.log(`http://localhost:${PORT}`)

})