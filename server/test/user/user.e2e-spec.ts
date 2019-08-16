import {HttpModule, INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {UserModule} from '../../src/port/module/user.module';
import {User} from '../../src/domain/user/user.entity';
import {DatabaseModule} from '../../src/port/module/database.module';
import {ConfigModule, ConfigService} from 'nestjs-config';
import * as path from 'path';
import {getConnection} from 'typeorm';
import * as assert from 'assert';

describe('UserController', () => {
  let app: INestApplication;
  const initUserFirst = {id: 1, address: 'firstAddress', name: 'firstName', point: 10, level: 0};
  const initUserSecond = {id: 2, address: 'secondAddress', name: 'secondName', point: 10, level: 0};

  beforeAll(async () => {
    ConfigService.rootPath = path.resolve(__dirname, '../../src');
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.resolveRootPath(__dirname).load('config/**/!(*.d).{ts,js}'),
        UserModule,
        DatabaseModule,
      ],
    })
      .compile();

    app = module.createNestApplication();
    await app.init();

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        initUserFirst,
        initUserSecond,
      ])
      .execute();

  });

  afterAll(async () => await app.close());

  describe('#get()', () => {
    let validId: number;
    let url: string;

    it('should return 200', () => {
      validId = initUserFirst.id;
      url = '/users/' + validId;

      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.address, initUserFirst.address);
          assert.strictEqual(response.body.name, initUserFirst.name);
          assert.strictEqual(response.body.point, initUserFirst.point);
          assert.strictEqual(response.body.level, initUserFirst.level);
        });
    });
    it('should return 404 with invalid id', () => {
      const invalidId = 100;
      url = '/users/' + invalidId;

      return request(app.getHttpServer())
        .get(url)
        .expect(404)
        .then(response => {
          assert.strictEqual(response.body.message, 'user with the id is not found');
        });
    });
  });

  describe('#increaseLevel()', () => {
    let url: string;
    let validId: number;
    let invalidId: number;
    const validAmount = 1;
    let invalidAmount: number;

    it('should return 200', () => {
      validId = initUserFirst.id;
      url = '/users/' + validId + '/increase-level?amount=' + validAmount;

      return request(app.getHttpServer())
        .put(url)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.address, initUserFirst.address);
          assert.strictEqual(response.body.level, initUserFirst.level + validAmount);
        });
    });
    it('should return 404 with invalid id', () => {
      invalidId = 100;
      url = '/users/' + invalidId + '/increase-level?amount=' + validAmount;

      return request(app.getHttpServer())
        .put(url)
        .expect(404)
        .then(response => {
          assert.strictEqual(response.body.message, 'user with the id is not found');
        });
    });
    it('should return 422 when amount is negative', () => {
      validId = initUserFirst.id;
      invalidAmount = -1;
      url = '/users/' + validId + '/increase-level?amount=' + invalidAmount;
      return request(app.getHttpServer())
        .put(url)
        .expect(422)
        .then(response => {
          assert.strictEqual(response.body.message, 'amount should be positive');
        });

    });
    it('should return 422 when level becomes more than MAX_LEVEL', () => {
      validId = initUserFirst.id;
      invalidAmount = 101;
      url = '/users/' + validId + '/increase-level?amount=' + invalidAmount;

      return request(app.getHttpServer())
        .put(url)
        .expect(422)
        .then(response => {
          assert.strictEqual(response.body.message, 'can not increase level over MAX_LEVEL');
        });
    });
  });

  describe('#increasePoint()', () => {
    let url: string;
    let validId: number;
    let invalidId: number;
    const validAmount = 1;
    let invalidAmount: number;

    it('should return 200', () => {
      validId = initUserFirst.id;
      url = '/users/' + validId + '/increase-point?amount=' + validAmount;
      return request(app.getHttpServer())
        .put(url)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.address, initUserFirst.address);
          assert.strictEqual(response.body.point, initUserFirst.point + validAmount);
        });
    });
    it('should return 404 with invalid id', () => {
      invalidId = 100;
      url = '/users/' + invalidId + '/increase-point?amount=' + validAmount;

      return request(app.getHttpServer())
        .put(url)
        .expect(404)
        .then(response => {
          assert.strictEqual(response.body.message, 'user with the id is not found');
        });
    });
    it('should return 422 when amount is negative', () => {
      validId = initUserFirst.id;
      invalidAmount = -1;
      url = '/users/' + validId + '/increase-point?amount=' + invalidAmount;
      return request(app.getHttpServer())
        .put(url)
        .expect(422)
        .then(response => {
          assert.strictEqual(response.body.message, 'amount should be positive');
        });
    });
  });

  describe('#decreasePoint()', () => {
    let url: string;
    let validId: number;
    let invalidId: number;
    let validAmount: number;
    let invalidAmount: number;

    it('should return 200', () => {
      validId = initUserSecond.id;
      validAmount = 1;
      url = '/users/' + validId + '/decrease-point?amount=' + validAmount;

      return request(app.getHttpServer())
        .put(url)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.address, initUserSecond.address);
          assert.strictEqual(response.body.point, initUserSecond.point - validAmount);
        });
    });
    it('should return 404 with invalid id', () => {
      invalidId = 100;
      validAmount = 1;
      url = '/users/' + invalidId + '/decrease-point?amount=' + validAmount;

      return request(app.getHttpServer())
        .put(url)
        .expect(404)
        .then(response => {
          assert.strictEqual(response.body.message, 'user with the id is not found');
        });
    });
    it('should return 422 when amount is negative', () => {
      validId = initUserSecond.id;
      invalidAmount = -1;
      url = '/users/' + validId + '/decrease-point?amount=' + invalidAmount;
      return request(app.getHttpServer())
        .put(url)
        .expect(422)
        .then(response => {
          assert.strictEqual(response.body.message, 'amount should be positive');
        });
    });
    it('should return 422 when point becomes less than MIN_POINT', () => {
      invalidId = initUserSecond.id;
      invalidAmount = initUserSecond.point + 1;
      url = '/users/' + invalidId + '/decrease-point?amount=' + invalidAmount;

      return request(app.getHttpServer())
        .put(url)
        .expect(422)
        .then(response => {
          assert.strictEqual(response.body.message, 'can not decrease point under MIN_POINT');
        });
    });
  });

  describe('#delete()', () => {
    let url: string;
    let validId: number;
    let invalidId: number;
    it('should return 200 and affected 1', async () => {
      validId = initUserFirst.id;
      url = '/users/' + validId;

      return request(app.getHttpServer())
        .delete(url)
        .expect(200)
        .expect({raw: [], affected: 1});
    });
    it('should return 200 but affected 0', async () => {
      invalidId = 100;
      url = '/users/' + invalidId;

      return request(app.getHttpServer())
        .delete(url)
        .expect(200)
        .expect({raw: [], affected: 0});
    });
  });
});
