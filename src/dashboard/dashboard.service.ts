import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const salesToday = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: startOfDay },
      },
    });

    const salesMonth = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    const totalToday = salesToday.reduce((acc, s) => acc + s.totalPrice, 0);

    const totalMonth = salesMonth.reduce((acc, s) => acc + s.totalPrice, 0);

    const productsSoldToday = salesToday.reduce(
      (acc, s) => acc + s.quantity,
      0,
    );

    const lowStockProducts = await this.prisma.product.findMany({
      where: {
        stockQuantity: {
          lte: 5, // ou une valeur dynamique plus tard
        },
      },
    });

    const topProductsRaw = await this.prisma.sale.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const products = await this.prisma.product.findMany();

    const topProducts = topProductsRaw
      .map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (!prod) return null;
        return {
          productId: item.productId,
          name: prod.name,
          totalSold: item._sum.quantity,
        };
      })
      .filter(Boolean); // supprimer les produits null

    const categories = await this.prisma.category.findMany({
      include: {
        products: true,
      },
    });

    const productsByCategory = categories.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
      totalProducts: cat.products.length,
    }));

    return {
      totalSalesToday: totalToday,
      totalSalesMonth: totalMonth,
      numberOfSalesToday: salesToday.length,
      quantitySoldToday: productsSoldToday,
      lowStockProducts,
      topProducts,
      productsByCategory,
    };
  }
}
