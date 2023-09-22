import dotenv from 'dotenv'
dotenv.config()
if (process.env.PORT === undefined) {
  throw new Error('PORT is undefined')
}

import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express()
app.use(express.static('/', { index: false }))
app.use(cors())

/** gets list of items in folder, path is provided by query param names 'path',
 * if path is undefined then it returns items of root directory '/'
 */
app.get('/get-content', (req, res) => {
  const path = req.query.path

  // checks if path is string or undefined
  if (typeof path !== 'string' && path !== undefined) {
    res.status(400)
    res.json({
      error: 'path must be string or undefined'
    })
    return
  }

  // if path is undefined then send list of files from root directory
  if (path === undefined || path === '') {
    res.status(200);
    const items = fs.readdirSync('/', { recursive: false, withFileTypes: true })
    res.json({
      directories: items.filter(v => v.isDirectory()).map(v => v.name),
      files: items.filter(v => v.isFile()).map(v => v.name)
    })
  } else {
    try {
      res.status(200)
      const items = fs.readdirSync(path, { recursive: false, withFileTypes: true })
      res.json({
        directories: items.filter(v => v.isDirectory()).map(v => v.name),
        files: items.filter(v => v.isFile()).map(v => v.name)
      })
    } catch (e: any) { // in case path is invalid or not exist
      res.status(400)
      res.json ({
        error: e
      })
    }
  }
})

app.get('/*', (req, res) => {
  res.sendStatus(404)
})
app.listen(process.env.PORT, () => {
  console.log('TestTask-backend application listening on port ' + process.env.PORT)
})
