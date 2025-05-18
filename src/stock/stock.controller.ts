import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Roles('ADMIN')
  @Post()
  addStock(
    @Body()
    body: {
      productId: number;
      quantity: number;
      type: 'ENTREE' | 'SORTIE';
    },
  ) {
    return this.stockService.addStock(body);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }
}
