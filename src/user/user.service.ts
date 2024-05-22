import { Injectable } from '@nestjs/common';
import { SubscriptionDto } from '../dtos/subscription.dto';

@Injectable()
export class UserService {
  getSubscriptionById(id: number): SubscriptionDto {
    let subscription: SubscriptionDto;

    switch (id) {
      case 1:
        subscription = {
          name: 'Basic',
          screens: 1,
          resolution: 'SD',
          price: 10,
        };

        break;
      case 2:
        subscription = {
          name: 'Standard',
          screens: 2,
          resolution: 'HD',
          price: 15,
        };

        break;
      case 3:
        subscription = {
          name: 'Premium',
          screens: 4,
          resolution: 'UHD',
          price: 20,
        };

        break;
      default:
        subscription = null;
    }

    return subscription;
  }

  getSalesByIds(ids: number[]): number {
    return ids.reduce((acc: number, curr: number) => {
      if (acc === null) return acc;

      switch (curr) {
        case 1:
          acc += 20;
          break;
        case 2:
          acc += 10;
          break;
        case 3:
          acc += 5;
          break;
        default:
          acc = null;
      }

      return acc;
    }, 0);
  }
}
