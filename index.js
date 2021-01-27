require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
var encrypt = require("mongoose-encryption")
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/dosyalar"))
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

mongoose.connect(
  process.env.BAGLANTI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

const Schema = mongoose.Schema

const uyeSemasi = new mongoose.Schema({
  email: String,
  password: String,
})

uyeSemasi.plugin(encrypt, {
  secret: process.env.SECRETKEY,
  encryptedFields: ["password"],
})

const Kullanici = new mongoose.model("Kullanici", uyeSemasi)

app.get("/", function (req, res) {
  res.render("anasayfa")
})

app.get("/kayitol", function (req, res) {
  res.render("kayitol")
})

app.post("/kayitol", async (req, res) => {
  let email = req.body.email
  let password = req.body.password

  let user1 = new Kullanici({
    email: email,
    password: password,
  })
  user1.save()

  res.render("gizlisayfa")
})

app.get("/giris", function (req, res) {
  res.render("giris")
})

app.post("/girisyap", (req, res) => {
  let useremail = req.body.email
  let userpassword = req.body.password

  Kullanici.findOne(
    {
      email: useremail,
    },
    (err, results) => {
      if (err) {
        console.log(err)
      } else {
        if (results) {
          if (results.email == useremail && results.password == userpassword) {
            res.render("gizlisayfa")
          } else {
            res.send("sifre hatali")
          }
        } else {
          res.send("Böyle bir kullanici yok")
        }
      }
    }
  )
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  console.log("connected!")
})

app.listen(5000, function () {
  console.log("5000 port'a bağlandık.")
})
