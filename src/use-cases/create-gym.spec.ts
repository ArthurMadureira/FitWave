import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('should be able to create gym', async () => {

    const { gym } = await sut.execute({
      title: 'Test Gym',
      description: null,
      latitude: -1.4670579,
      longitude: -48.4887321,
      phone: null
    })

    expect(gym.id).toEqual(expect.any(String))

  })


})