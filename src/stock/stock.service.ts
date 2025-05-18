import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async addStock(data: {
    productId: number;
    quantity: number;
    type: 'ENTREE' | 'SORTIE';
  }) {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw new NotFoundException('Produit introuvable');

    const updatedQuantity =
      data.type === 'ENTREE'
        ? product.stockQuantity + data.quantity
        : product.stockQuantity - data.quantity;

    if (updatedQuantity < 0) {
      throw new Error('Stock insuffisant pour une sortie');
    }

    await this.prisma.product.update({
      where: { id: product.id },
      data: { stockQuantity: updatedQuantity },
    });

    return this.prisma.stock.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        type: data.type,
      },
    });
  }

  async findAll() {
    return this.prisma.stock.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
