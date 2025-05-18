import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    description?: string;
    price: number;
    threshold: number;
    categoryId: number;
  }) {
    return this.prisma.product.create({ data });
  }

  async findAll() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      description?: string;
      price: number;
      threshold: number;
      categoryId: number;
    }>,
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
