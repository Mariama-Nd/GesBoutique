import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin-zone')
  getAdminZone(@Req() req: Request) {
    return {
      message: 'Bienvenue ADMIN',
      user: req.user,
    };
  }
}
