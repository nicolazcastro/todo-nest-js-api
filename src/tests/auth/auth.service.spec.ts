import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../modules/auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../modules/auth/schemas/user.schema';
import { Model } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests here
});
