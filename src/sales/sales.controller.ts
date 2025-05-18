import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  sellProduct(
    @Req() req: Request,
    @Body() body: { productId: number; quantity: number },
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    return this.salesService.recordSale(userId, body.productId, body.quantity);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
}
