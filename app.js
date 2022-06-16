const express = require("express")
const app = express()
const port = 3000

app.use(express.static("public"))
app.use("/css", express.static(__dirname + "css"))
app.use("/js", express.static(__dirname + "js"))
app.use("/image", express.static(__dirname + "images"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})


app.listen(port, () => {
    console.info(`Listening on port ${port}`)
})
