import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reservation } from './schemas/reservation.schema';
import { Model } from 'mongoose';

const mockReservation = {
  room: '60c72b9f9b1d8c001f8e4a2a',
  user: '60c72b9f9b1d8c001f8e4a2b',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-05'),
  active: true,
};

describe('ReservationService', () => {
  let service: ReservationService;
  let model: Model<Reservation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getModelToken(Reservation.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockReservation),
            constructor: jest.fn().mockResolvedValue(mockReservation),
            find: jest.fn(),
            create: jest.fn().mockResolvedValue(mockReservation),
            save: jest.fn().mockResolvedValue(mockReservation),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    model = module.get<Model<Reservation>>(getModelToken(Reservation.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new reservation', async () => {
    const createDto = {
      room: '60c72b9f9b1d8c001f8e4a2a',
      user: '60c72b9f9b1d8c001f8e4a2b',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-05'),
      active: true,
    };
    const reservation = await service.create(createDto);
    expect(reservation).toEqual(mockReservation);
  });
});
