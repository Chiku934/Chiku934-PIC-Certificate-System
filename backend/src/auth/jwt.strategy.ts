import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // In production, use environment variable
    });
  }

  async validate(payload: any) {
    try {
      console.log('JWT validate called with payload:', payload);
      const user = await this.userService.findOneForAuth(payload.sub);
      console.log('JWT validation: User lookup result for ID', payload.sub, ':', user ? 'Found' : 'Not found');
      if (!user) {
        console.log('JWT validation: User not found for ID:', payload.sub);
        throw new Error('User not found');
      }
      console.log('JWT validation: User authenticated successfully:', user.Id, user.Email);
      return user;
    } catch (error) {
      console.error('JWT validation error:', error);
      throw error;
    }
  }
}
