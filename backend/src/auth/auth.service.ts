import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithCredentials(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    await this.userService.updateLastLogin(user.Id);
    return this.login(user);
  }

  async login(user: User) {
    const payload = { email: user.Email, sub: user.Id, username: user.UserName };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.Id,
        username: user.UserName,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
    };
  }
}
