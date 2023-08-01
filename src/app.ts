import fastifyJwt from '@fastify/jwt'

import Fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

// Controller = Função que lida com entrada de dados de uma requisição HTTP e retorna uma resposta
//Repositories = Toda modificação que faremos no banco de dados

export const app = Fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format()
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

