import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * =========================
   * LOGIN
   * =========================
   */
  @Post('login')
  @ApiOperation({
    summary: 'Login using phone or username and password',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT access token returned',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs...',
        user: {
          id: 1,
          role: 'MANAGER',
          phone: '2567xxxxxxx',
          username: 'john_doe',
        },
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.identifier, dto.password);
  }

  /**
   * =========================
   * REGISTER MANAGER
   * =========================
   * (Admin-only in later phase)
   */
  @Post('register-manager')
  @ApiOperation({
    summary: 'Register a new manager (admin-only later)',
  })
  @ApiResponse({
    status: 201,
    description: 'Manager registered successfully',
    schema: {
      example: {
        ok: true,
        message: 'Manager registered successfully',
        managerId: 5,
      },
    },
  })
  async registerManager(
    @Body()
    dto: {
      phone: string;
      username: string;
      password: string;
      businessName: string; // ✅ REQUIRED
    },
  ) {
    return this.authService.registerManager(dto);
  }
}