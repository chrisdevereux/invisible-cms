import express, { RequestHandler } from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import { CmsBackend, CmsRevisionProps } from '@invisible-cms/core';
import multiparty from 'multiparty'

interface CreateCmsProps {
  prefix?: string
  backend: CmsBackend
}

export const createCms = ({ prefix = '', backend }: CreateCmsProps) => {
  const app = express()

  app.use(cors({ origin: true }))
  app.use(json())

  app.put(prefix + '/file', handleErrors(async (req, res) => {
    const form = new multiparty.Form()
    let done = false

    form.on('error', err => {
      console.error(err)
      res.sendStatus(500)
    })

    form.on('part', async (part) => {
      try {
        if (part.filename && part.name === 'data') {
          done = true
          let response = await backend.putFile(part, part.headers['content-type'])
          res.writeHead(200, { 'content-type': 'application/json' })
          res.write(JSON.stringify(response))
          res.end()

        } else {
          part.resume()
        }

      } catch (err) {
        console.error(err)
        res.sendStatus(500)
      }
    })

    form.on('close', () => {
      if (!done) {
        res.sendStatus(400)
      }
    })

    form.parse(req)
  }))
  app.post(prefix + '/page/:page/revision', handleErrors(async (req, res) => {
    const props: CmsRevisionProps = req.body
    const { page } = req.params

    res.send(await backend.createPageRevision(page, props))
  }))
  app.get(prefix + '/page/:page/revision/latest', handleErrors(async (req, res) => {
    const { page } = req.params

    res.send(await backend.getPageRevision(page))
  }))
  app.get(prefix + '/page/:page/revision/:revision', handleErrors(async (req, res) => {
    const { page, revision } = req.params

    res.send(await backend.getPageRevision(page, revision))
  }))
  app.get(prefix + '/page/:page/revision/published', handleErrors(async (req, res) => {
    const { page } = req.params

    res.send(await backend.getPublishedPageRevision(page))
  }))
  app.put(prefix + '/page/:page/revision/:revision', handleErrors(async (req, res) => {
    const props: CmsRevisionProps = req.body
    const { page, revision } = req.params

    res.send(await backend.putPageRevision(page, revision, props))
  }))
  app.post(prefix + '/page/:page/revision/:revision/publish', handleErrors(async (req, res) => {
    const { page, revision } = req.params

    await backend.publish(page, revision)

    res.sendStatus(204)
  }))

  return app
}

const handleErrors = (fn: RequestHandler): RequestHandler => async (req, res, next) => {
  try {
    await fn(req, res, next)

  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}
