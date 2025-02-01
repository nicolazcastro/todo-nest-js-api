import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Registration function
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { username, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash password
    let hashedPassword: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      hashedPassword = await bcrypt.hash(password, 10);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Error hashing password');
    }

    // Create and save the new user
    const createdUser = new this.userModel({
      username,
      password: hashedPassword,
    });
    await createdUser.save();

    return { message: 'User registered successfully' };
  }

  // Login function
  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { username, password } = loginUserDto;

    // Find the user by username
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    let passwordValid: boolean;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      passwordValid = await bcrypt.compare(password, user.password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Error comparing passwords');
    }

    // Generate JWT token
    const payload = { username: user.username, sub: user._id };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
