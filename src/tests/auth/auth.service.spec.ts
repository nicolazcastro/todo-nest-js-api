/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../modules/auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../modules/auth/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../modules/auth/dto/create-user.dto';
import { LoginUserDto } from '../../modules/auth/dto/login-user.dto';

// Simulate the Mongoose model as a constructor function so that "new this.userModel({...})" works.
const mockUserModel = jest.fn(function (this: any, data: any) {
  return {
    ...data,
    save: jest.fn().mockResolvedValue({ _id: '123', ...data }),
  };
}) as any;

// Attach static methods to the mockUserModel.
mockUserModel.findOne = jest.fn();
mockUserModel.create = jest.fn();

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockedJwtToken'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newUser',
        password: 'newPassword',
      };

      // Ensure no user exists.
      mockUserModel.findOne.mockResolvedValue(null);

      // Set up bcrypt.hash to return a hashed password.
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce((): Promise<string> => {
          return Promise.resolve('hashedPassword');
        });

      // When the service calls new this.userModel({...}), our constructor mock returns an object with a save() method.
      // No further mocking for .save() is needed because it's provided by the constructor mock.

      const result = await service.register(createUserDto);
      expect(result).toEqual({ message: 'User registered successfully' });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: 'newUser',
      });
      expect(hashSpy).toHaveBeenCalledWith('newPassword', 10);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existingUser',
        password: 'password',
      };

      // Simulate that the user already exists.
      mockUserModel.findOne.mockResolvedValue({ _id: 'existingId' });

      await expect(service.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: 'existingUser',
      });
    });

    it('should throw BadRequestException if hashing fails', async () => {
      const createUserDto: CreateUserDto = {
        username: 'failHashUser',
        password: 'password',
      };

      mockUserModel.findOne.mockResolvedValue(null);

      // Force an error from bcrypt.hash.
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(async (): Promise<string> => {
          throw new Error('Hash failure');
        });

      await expect(service.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should log in user with correct credentials and return a token', async () => {
      const loginDto: LoginUserDto = {
        username: 'testUser',
        password: 'testPass',
      };

      const mockUser = {
        _id: 'userId',
        username: 'testUser',
        password: 'hashedPass',
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // Set up bcrypt.compare to return true.
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce((): Promise<boolean> => {
          return Promise.resolve(true);
        });

      const result = await service.login(loginDto);
      expect(result).toEqual({ access_token: 'mockedJwtToken' });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: 'testUser',
      });
      expect(compareSpy).toHaveBeenCalledWith('testPass', 'hashedPass');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'testUser',
        sub: 'userId',
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto: LoginUserDto = {
        username: 'nonExistentUser',
        password: 'anyPass',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginUserDto = {
        username: 'testUser',
        password: 'wrongPass',
      };

      const mockUser = {
        _id: 'userId',
        username: 'testUser',
        password: 'hashedPass',
      };

      // Ensure that findOne returns the mock user.
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // Override bcrypt.compare so that it always returns false for this test.
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((): Promise<boolean> => Promise.resolve(false));

      // Call the service.login method and expect it to throw UnauthorizedException.
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      // Verify that bcrypt.compare was called with the provided credentials.
      expect(compareSpy).toHaveBeenCalledWith('wrongPass', 'hashedPass');

      // Verify that JwtService.sign was not called.
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password compare fails', async () => {
      const loginDto: LoginUserDto = {
        username: 'testUser',
        password: 'anyPass',
      };

      const mockUser = {
        _id: 'userId',
        username: 'testUser',
        password: 'hashedPass',
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // Force an error from bcrypt.compare.
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce((): Promise<boolean> => {
          return Promise.reject(new Error('Compare error'));
        });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(compareSpy).toHaveBeenCalledWith('anyPass', 'hashedPass');
    });
  });
});
