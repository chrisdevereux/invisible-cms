import express, { RequestHandler } from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import { CmsBackend, CmsDeployTarget, CmsRevisionProps } from '@invisible-cms/core';
import multiparty from 'multiparty'

interface CreateCmsProps {
  prefix?: string
  backend: CmsBackend,
  target: CmsDeployTarget
}

export const createCms = ({ prefix = '', backend, target }: CreateCmsProps) => {
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
  app.get(prefix + '/revision/latest', handleErrors(async (req, res) => {
    res.send(await backend.getRevision())
  }))
  app.get(prefix + '/revision/:id', handleErrors(async (req, res) => {
    res.send(await backend.getRevision(req.params.id))
  }))
  app.put(prefix + '/revision/:id', handleErrors(async (req, res) => {
    const props: CmsRevisionProps = req.body
    const revision = { ...props, id: req.params.id, timestamp: Date.now() }
    await backend.putRevision(revision)

    res.send(revision)
  }))
  app.post(prefix + '/revision', handleErrors(async (req, res) => {
    const props: CmsRevisionProps = req.body

    res.send(await backend.createRevision({ ...props, timestamp: Date.now() }))
  }))
  app.post(prefix + '/revision/:id/publish', handleErrors(async (req, res) => {
    const revision = await backend.getRevision(req.params.id)
    await backend.setPublishedRevision(revision.id)
    await target.publish()

    res.sendStatus(204)
  }))
  app.get(prefix + '/data', handleErrors(async (req, res) => {
    const revisionId = await backend.getPublishedRevisionId()
    const revision = await backend.getRevision(revisionId)

    res.send(revision)
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
