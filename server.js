const path = require('path')
const express = require('express')

const pathProvider = path.join(__dirname + '/');
// console.log(pathProvider);


const port = process.env.PORT || 3000

const app = express()

app.use(express.static(pathProvider + 'public/'))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.listen(port, () => {
    console.log(`server is up listenig ${port}`);
})