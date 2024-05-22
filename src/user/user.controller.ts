import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionDto } from '../dtos/subscription.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/subscribe/:id')
  getSubscription(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): SubscriptionDto {
    const subscription: SubscriptionDto =
      this.userService.getSubscriptionById(id);

    if (!subscription) throw new NotFoundException();

    return subscription;
  }

  @Get('/sales/:id_sub')
  @UsePipes(ValidationPipe)
  getSales(
    @Param(
      'id_sub',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id_sub: number,
    @Body(
      'id_sales',
      new ParseArrayPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id_sales: number[],
  ) {
    const subscription: SubscriptionDto =
      this.userService.getSubscriptionById(id_sub);

    const sales: number = this.userService.getSalesByIds(id_sales);

    if (!subscription || sales === null) throw new NotFoundException();

    return {
      ...subscription,
      price: subscription.price - (subscription.price * sales) / 100,
    };
  }

  @Get('/sales/:id_sub')
  @UsePipes(ValidationPipe)
  getPenalties(
    @Param(
      'id_sub',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id_sub: number,
    @Body(
      'id_sales',
      new ParseArrayPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id_sales: number[],
    @Body(
      'months_delayed',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    months_delayed: number,
  ) {
    try {
      const subscription: SubscriptionDto = this.getSubscription(id_sub);

      const sales: number = this.userService.getSalesByIds(id_sales);

      if (!subscription || sales === null) throw new NotFoundException();

      if (months_delayed >= 3) throw new ForbiddenException();

      return {
        ...subscription,
        price:
          subscription.price -
          (subscription.price * (sales - 5 * months_delayed)) / 100,
      };
    } catch (e) {
      throw e;
    }
  }
}
