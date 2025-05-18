import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async recordSale(userId: number, productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Produit introuvable');
    if (quantity > product.stockQuantity)
      throw new BadRequestException('Stock insuffisant');

    const total = product.price * quantity;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: product.stockQuantity - quantity,
      },
    });

    return this.prisma.sale.create({
      data: {
        userId,
        productId,
        quantity,
        totalPrice: total,
      },
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        product: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
