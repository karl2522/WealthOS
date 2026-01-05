import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto);

    // Set HTTP-only cookies
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'Registration successful',
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);

    // Set HTTP-only cookies
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(HttpStatus.OK).json({
      user: result.user,
      message: 'Login successful',
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any, @Res() res: Response) {
    await this.authService.logout(user.userId);

    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.status(HttpStatus.OK).json({
      message: 'Logout successful',
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(@CurrentUser() user: any, @Res() res: Response) {
    const tokens = await this.authService.refreshTokens(
      user.userId,
      user.refreshToken,
    );

    // Set new HTTP-only cookies
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(HttpStatus.OK).json({
      message: 'Token refreshed successfully',
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: any) {
    return this.authService.getCurrentUser(user.userId);
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    // Access token cookie - 15 minutes
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Refresh token cookie - 7 days
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
