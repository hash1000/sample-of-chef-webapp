import { Controller, Get, Param, Query } from '@nestjs/common';
import { RestaurantsQueryDto } from './dto/restaurants-query.dto';
import { RestaurantsService } from './restaurants.service';

@Controller()
export class RestaurantsController {
  constructor(private readonly restaurants: RestaurantsService) {}

  @Get('restaurants')
  list(@Query() query: RestaurantsQueryDto) {
    return this.restaurants.list(query);
  }

  @Get('restaurant/:id')
  get(@Param('id') id: string) {
    return this.restaurants.get(id);
  }
}
