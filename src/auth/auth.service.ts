/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({ email, password });

    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async login(identifier: string, password: string) {
    let email = identifier; // Assume it's an email

    // If it's a username, get the corresponding email
    if (!identifier.includes('@')) {
      const user = await this.prisma.profile.findUnique({
        where: { username: identifier },
        select: { user: { select: { email: true } } },
      });

      if (!user) throw new UnauthorizedException('Invalid credentials');
      email = user.user.email;
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new UnauthorizedException(error.message);

    return data;
  }

  async setUsername(userId: string, username: string) {
    // Check if username already exists
    const existingUser = await this.prisma.profile.findUnique({
      where: { username },
    });

    if (existingUser) throw new BadRequestException('Username already taken');

    // Update username
    return this.prisma.profile.update({
      where: { id: userId },
      data: { username },
    });
  }
}
