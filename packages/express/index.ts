import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import { CmsBackend, CmsDeployTarget, CmsRevisionProps } from '@invisible-cms/core';

interface CreateCmsProps {
  prefix?: string
  backend: CmsBackend,
  target: CmsDeployTarget
}

export const createCms = ({ prefix = '', backend, target }: CreateCmsProps) => {
  const app = express()

  app.use(cors({ origin: true }))
  app.use(json())

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

const handleErrors = fn => async (req, res, next) => {
  try {
    await fn(req, res, next)

  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}