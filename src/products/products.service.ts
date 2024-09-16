import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Car } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getProducts(params) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'desc',
        order = 'year',
        filtersColor = [],
        filtersModel = [],
        /*         filters = {
          color: [],
          model: [],
        }, */
      } = params;

      const offset = (page - 1) * limit;
      const endIndex = page * limit;

      const results: any = {};

      const uniqueModelsAndColors = await this.databaseService.car.findMany({
        distinct: ['model', 'color'],
        select: { model: true, color: true },
      });

      results.filters = {
        model: [...new Set(uniqueModelsAndColors.map((item) => item.model))],
        color: [...new Set(uniqueModelsAndColors.map((item) => item.color))],
      };

      try {
        const where: any = {};

        if (filtersColor && filtersColor.length > 0) {
          where.color = { in: filtersColor };
        }

        if (filtersModel && filtersModel.length > 0) {
          where.model = { in: filtersModel };
        }

        results.results = await this.databaseService.car.findMany({
          take: +limit,
          skip: offset,
          where,
          orderBy: [
            {
              [order]: sort,
            },
          ],
        });

        const totalRecords = await this.databaseService.car.count({
          where,
        });
        if (endIndex < totalRecords) {
          if (limit < totalRecords) {
            results.next = {
              page: +page + 1,
            };
          }
        }

        if (offset > 0) {
          results.previous = {
            page: page - 1,
          };
        }

        results.currentPage = +page;

        results.length = results.results.length;

        /*     console.log(results); */

        return results;
      } catch (e) {
        throw new Error(e.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProduct(id) {
    try {
      return this.databaseService.car.findUnique({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(car: Car): Promise<Car> {
    try {
      return await this.databaseService.car.create({
        data: car,
      });
    } catch (error) {
      console.log(error.code);
      console.log(error.message);

      throw new NotFoundException({
        description: 'Something wrong with fields',
        statusCode: 500,
      });
    }
  }

  async generateProducts() {
    try {
      const cars = Array(13)
        .fill(0)
        .map((_, i) => {
          const brand = faker.vehicle.manufacturer();
          const model = faker.vehicle.model();

          return {
            image: `https://media.istockphoto.com/id/1316134499/photo/a-concept-image-of-a-magnifying-glass-on-blue-background-with-a-word-example-zoom-inside-the.jpg?s=612x612&w=0&k=20&c=sZM5HlZvHFYnzjrhaStRpex43URlxg6wwJXff3BE9VA=`,
            brand,
            model,
            color: faker.vehicle.color(),
            price: faker.finance.amount(),
            year:
              Math.floor(
                Math.random() * (new Date().getFullYear() - 1900 + 1),
              ) + 1900,
            engine: faker.helpers.arrayElement([
              'GASOLINE',
              'DIESEL',
              'ELECTRIC',
            ]),
            transmission: faker.helpers.arrayElement([
              'AUTOMATIC',
              'MANUAL',
              'ROBOTIC',
            ]),
            range: Math.random(),
          };
        });

      /*    console.log(cars); */

      await this.databaseService.car.createMany({ data: cars });
    } catch (error) {
      console.log(error);
    }
  }
}
