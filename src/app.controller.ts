import { CreateCarDto } from './../dto/index';
// app.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ProductsService } from './products/products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Swagger') // Tag for this controller
@Controller('api')
export class AppController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @UsePipes(new ValidationPipe())
  getProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('filtersColor') filtersColor: any,
    @Query('filtersModel') filtersModel: any,
  ) {
    filtersColor = filtersColor
      ? filtersColor.includes(',')
        ? filtersColor.split(',')
        : [filtersColor]
      : undefined;

    filtersModel = filtersModel
      ? filtersModel.includes(',')
        ? filtersModel.split(',')
        : [filtersModel]
      : undefined;
    /*    console.log(filterColor); */

    /*     console.log(filters);

    const filtersObject = JSON.parse(decodeURIComponent(filters));
    console.log(filtersObject);  */

    return this.productsService.getProducts({
      page,
      limit,
      sort,
      order,
      filtersColor,
      filtersModel,
    });
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Post('products/create')
  @UsePipes(new ValidationPipe())
  create(@Body() dto: any) {
    return this.productsService.createProduct(dto);
  }

  @Get('generate')
  generateProducts() {
    return this.productsService.generateProducts();
  }
}
