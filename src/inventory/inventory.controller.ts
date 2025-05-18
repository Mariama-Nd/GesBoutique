import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles('ADMIN', 'SUPERVISEUR')
  @Post()
  record(@Body() body: { productId: number; quantity: number; date: string }) {
    return this.inventoryService.recordInventory({
      productId: body.productId,
      quantity: body.quantity,
      date: new Date(body.date),
    });
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }
}
