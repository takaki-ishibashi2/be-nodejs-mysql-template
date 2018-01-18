import * as express from 'express'
import { homeRoute } from './home'
import { healthRoute } from './health'

export const routes = (server: express.Application) => {
  homeRoute(server)
  healthRoute(server)
}