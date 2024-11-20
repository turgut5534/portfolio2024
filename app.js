const express = require('express')
const path = require('path')

const app = express()

const viewsDir = path.join(__dirname, '/src/views')
const publicDir = path.join(__dirname, 'public/')

app.set('view engine', 'ejs')
app.set('views', viewsDir)

app.use(express.static(publicDir))

const port = process.env.PORT || 8000

app.get('/' , (req,res) => {
    res.render('index')

})

app.listen(port, () => {
    console.log(`App is running on ${port}`)
})