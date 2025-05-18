import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async recordInventory(data: {
    productId: number;
    quantity: number;
    date: Date;
  }) {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw new NotFoundException('Produit introuvable');

    return this.prisma.inventory.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        date: data.date,
      },
    });
  }

  async findAll() {
    return this.prisma.inventory.findMany({
      include: { product: true },
      orderBy: { date: 'desc' },
    });
  }
}
