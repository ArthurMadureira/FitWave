import Fastify from 'fastify'
import { appRoutes } from './http/routes'

// Controller = Função que lida com entrada de dados de uma requisição HTTP e retorna uma resposta

export const app = Fastify()

app.register(appRoutes)

