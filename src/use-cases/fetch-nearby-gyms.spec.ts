import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gym Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })


  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      latitude: -1.4670579,
      longitude: -48.4887321,
      phone: null

    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      latitude: -5.5921883,
      longitude: -38.6833915,
      phone: null
    })

    // -5.5921883,-38.6833915

    const { gyms } = await sut.execute({
      userLatitude: -1.4670579,
      userLongitude: -48.4887321,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })

})
