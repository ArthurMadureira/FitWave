import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInRepository
let gymsRepository: GymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia JS Gym',
      description: '',
      latitude: -1.4670579,
      longitude: -48.4887321,
      phone: null
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4670579,
      userLongitude: -48.4887321,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check on twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4670579,
      userLongitude: -48.4887321,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -1.4670579,
        userLongitude: -48.4887321,
      })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check on twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4670579,
      userLongitude: -48.4887321,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))


    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -1.4670579,
      userLongitude: -48.4887321,
    })


    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in on distant gym', async () => {

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia JS Gym',
      description: '',
      latitude: new Decimal(-1.4212128),
      longitude: new Decimal(-48.4585739),
      phone: null
    })


    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -1.4670579,
        userLongitude: -48.4887321,
      })).rejects.toBeInstanceOf(MaxDistanceError)

  })
})