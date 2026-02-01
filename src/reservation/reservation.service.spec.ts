import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reservation } from './schemas/reservation.schema';
import { Room } from 'src/rooms/schemas/room.schema';
import { FestiveCalendar } from 'src/festive-calendar/schmes/festive.calendar.schema';

const mockReservation = {
  room: '60c72b9f9b1d8c001f8e4a2a',
  user: '60c72b9f9b1d8c001f8e4a2b',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-05'),
  active: true,
  finalCost: 100, // Add finalCost for mock
  status: 0, // Add status for mock
};

const mockRoom = {
  _id: '60c72b9f9b1d8c001f8e4a2a',
  price: 50,
  hotel: 'someHotelId',
};

const mockFestiveCalendar = {
  findOne: jest.fn().mockResolvedValue(null), // Mock findOne to return null by default
};

describe('ReservationService', () => {
  let service: ReservationService;

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
            findById: jest.fn().mockResolvedValue(mockReservation), // Add findById mock
            create: jest.fn().mockResolvedValue(mockReservation),
            save: jest.fn().mockResolvedValue(mockReservation),
            findOne: jest.fn().mockResolvedValue(null), // Mock findOne to return null for availability check
          },
        },
        {
          provide: getModelToken(Room.name),
          useValue: {
            findById: jest.fn().mockResolvedValue(mockRoom),
          },
        },
        {
          provide: getModelToken(FestiveCalendar.name),
          useValue: mockFestiveCalendar,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new reservation', async () => {
    const createDto = {
      roomId: '60c72b9f9b1d8c001f8e4a2a',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-05'),
    };
    const userId = '60c72b9f9b1d8c001f8e4a2b';

    const reservation = await service.create(createDto, userId);
    expect(reservation).toEqual(mockReservation);
  });
});
