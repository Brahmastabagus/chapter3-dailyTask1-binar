const express = require('express')
const fs = require('fs')

const app = express()
const PORT = 8080

app.use(express.json());

const datas = JSON.parse(fs.readFileSync(`${__dirname}/data.json`))

// GET
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: datas
  })
})

// GET by ID
app.get("/:_id", (req, res) => {
  const id = parseInt(req.params._id)
  const index = datas.findIndex(element => element._id === id);

  if (index === -1) {
    res.status(400).json({
      status: 'failed',
      message: `person dengan id ${id} tersebut invalid/gak ada`
    })
  } else {
    const data = datas.find(e => e._id === id)
    res.status(200).json({
      status: "Data ditemukan",
      data
    })
  }

})

// POST
app.post("/post", (req, res) => {
  const personName = datas.find(el => el.name === req.body.name);
  const cukupUmur = req.body.age < 17
  const checkData = req.body.age === undefined || req.body.eyeColor === undefined || req.body.name === undefined

  if (personName) {
    res.status(400).json({
      status: 'failed',
      message: `name ${req.body.name} already exist`
    })
  } else if (cukupUmur) {
    res.status(400).json({
      status: 'failed',
      message: `umur ${req.body.age} belum cukup`
    })
  } else if (checkData) {
    res.status(400).json({
      status: 'failed',
      message: `Data belum lengkap`
    })
  } else {
    const newId = datas[datas.length - 1]._id + 10
  
    const newData = Object.assign({_id: newId}, req.body)
  
    datas.push(newData)
    fs.writeFile(
      `${__dirname}/data.json`,
      JSON.stringify(datas),
      err => {
        res.status(201).json({
          status: "Data berhasil ditambahkan",
          data: newData
        })
      }
    )
  }
})

// PUT
app.put('/put/:_id', (req, res) => {
  const id = parseInt(req.params._id)
  const index = datas.findIndex(element => element._id === id);
  const personName = datas.findIndex(el => el.name === req.body.name);
  const cukupUmur = parseInt(req.body.age) < 17
  const checkData = req.body.age === undefined || req.body.eyeColor === undefined || req.body.name === undefined

  if (index === -1) {
    res.status(400).json({
      status: 'failed',
      message: `person dengan id ${id} tersebut invalid/gak ada`
    })
  } else if (personName !== -1 && personName !== index) {
    res.status(400).json({
      status: 'failed',
      message: `name ${req.body.name} already exist`
    })
  } else if (checkData) {
    res.status(400).json({
      status: 'failed',
      message: `Data belum lengkap`
    })
  } else if (cukupUmur) {
    res.status(400).json({
      status: 'failed',
      message: `umur ${req.body.age} belum cukup`
    })
  } else {
    // const data = datas.findIndex(e => e._id === parseInt(req.params._id))
  
    let person = {
      "_id": req.body._id,
      "age": req.body.age,
      "eyeColor": req.body.eyeColor,
      "name": req.body.name
    }
    datas.splice(index, 1, person)
  
    // datas.push(newData)
    fs.writeFile(
      `${__dirname}/data.json`,
      JSON.stringify(datas),
      err => {
        res.status(200).json({
          status: `Data dengan id ${index} berhasil diupdate`,
          data: person
        })
      }
    )
  }
})

// DELETE
app.delete('/delete/:_id', (req, res) => {
  const id = parseInt(req.params._id)

  const index = datas.findIndex(element => element._id === id);
  const data = datas.find(el => el._id === id);

  if (index === -1) {
    res.status(400).json({
      status: 'failed',
      message: `person dengan id ${id} tersebut invalid/gak ada`
    })
  } else {
    datas.splice(index, 1);
  }

  fs.writeFile(
    `${__dirname}/data.json`,
    JSON.stringify(datas),
    errr => {
      res.status(200).json({
        status: 'success',
        message: `data dari id ${id} nya berhasil dihapus`
      })
    }
  )
})

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
})