import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return basic subscription', () => {
    expect(controller.getSubscription(1)).toEqual({
      name: 'Basic',
      screens: 1,
      resolution: 'SD',
      price: 10,
    });
  });

  it('should return standard subscription', () => {
    expect(controller.getSubscription(2)).toEqual({
      name: 'Standard',
      screens: 2,
      resolution: 'HD',
      price: 15,
    });
  });

  it('should return premium subscription', () => {
    expect(controller.getSubscription(3)).toEqual({
      name: 'Premium',
      screens: 4,
      resolution: 'UHD',
      price: 20,
    });
  });

  it('should return an error', () => {
    try {
      controller.getSubscription(8);

      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return basic with new subscriber sale', () => {
    expect(controller.getSales(1, [1])).toEqual({
      name: 'Basic',
      screens: 1,
      resolution: 'SD',
      price: 8,
    });
  });

  it('should return premium with old subscriber sale and sponsoring', () => {
    expect(controller.getSales(3, [2, 3])).toEqual({
      name: 'Premium',
      screens: 4,
      resolution: 'UHD',
      price: 17,
    });
  });

  it('should return standard with sponsoring sale', () => {
    expect(controller.getSales(2, [3])).toEqual({
      name: 'Standard',
      screens: 2,
      resolution: 'HD',
      price: 14.25,
    });
  });

  it('should return basic without sales', () => {
    expect(controller.getSales(1, [])).toEqual({
      name: 'Basic',
      screens: 1,
      resolution: 'SD',
      price: 10,
    });
  });

  it('should return not found error', () => {
    try {
      controller.getSales(2, [4]);

      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return premium without sales and 1 month penalty', () => {
    expect(controller.getPenalties(3, [], 1)).toEqual({
      name: 'Premium',
      screens: 4,
      resolution: 'UHD',
      price: 21,
    });
  });

  it('should return basic with new account sales and 2 months penalty', () => {
    expect(controller.getPenalties(1, [1], 2)).toEqual({
      name: 'Basic',
      screens: 1,
      resolution: 'SD',
      price: 9,
    });
  });

  it('should return forbidden error (account closed)', () => {
    try {
      controller.getPenalties(1, [], 10);

      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
    }
  });
});
