import {INestApplication} from '@nestjs/common';
import {ConfigModule, ConfigService} from 'nestjs-config';
import * as path from 'path';
import {Test} from '@nestjs/testing';
import * as assert from 'assert';
import request from 'supertest';
import {getConnection} from 'typeorm';
import {Ghost} from '../../src/domain/ghost/ghost.entity';
import {GhostModule} from '../../src/port/module/ghost.module';
import {DatabaseModule} from '../../src/port/module/database.module';

describe('GhostController', () => {
  let app: INestApplication;
  const initGhostFirst = {id: 1, gene: 'FF9182839', tokenId: 1, level: 0, userAddress: 'userAddress1'};
  const initGhostSecond = {id: 2, gene: 'FF9182840', tokenId: 2, level: 0, userAddress: 'userAddress1'};

  const domain = 'ghosts';

  beforeAll(async () => {
    ConfigService.rootPath = path.resolve(__dirname, '../../src');
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.resolveRootPath(__dirname).load('config/**/!(*.d).{ts,js}'),
        GhostModule,
        DatabaseModule,
      ],
    })
      .compile();

    app = module.createNestApplication();
    await app.init();

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Ghost)
      .values([
        initGhostFirst,
        initGhostSecond,
      ])
      .execute();
  });

  afterAll(async () => await app.close());

  describe('#getById()', () => {
    let url: string;

    it('should return 200', () => {
      const validId = initGhostFirst.id;
      url = `/${domain}/` + validId;

      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.id, initGhostFirst.id);
          assert.strictEqual(response.body.gene, initGhostFirst.gene);
          assert.strictEqual(response.body.tokenId, initGhostFirst.tokenId);
          assert.strictEqual(response.body.userAddress, initGhostFirst.userAddress);
          assert.strictEqual(response.body.level, initGhostFirst.level);
          assert.strictEqual(response.body.userAddress, initGhostFirst.userAddress);
        });
    });
    it('should return 404 with invalid id', () => {
      const invalidId = -1;
      url = `/${domain}/` + invalidId;

      return request(app.getHttpServer())
        .get(url)
        .expect(404)
        .then( response => {
          assert.strictEqual(response.body.message, 'ghost with the id is not found');
        });
    });
  });
  describe('#get()', () => {
    let url: string;
    it('should return 200 when searching with gene', () => {
      const validGene = initGhostFirst.gene;
      url = `/${domain}?gene=` + validGene;

      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body[0].id, initGhostFirst.id);
          assert.strictEqual(response.body[0].gene, initGhostFirst.gene);
          assert.strictEqual(response.body[0].tokenId, initGhostFirst.tokenId);
          assert.strictEqual(response.body[0].userAddress, initGhostFirst.userAddress);
          assert.strictEqual(response.body[0].level, initGhostFirst.level);
          assert.strictEqual(response.body[0].userAddress, initGhostFirst.userAddress);
        });
    });
    it('should return 404 with invalid gene', () => {
      const invalidGene = 'wrongGene';
      url = `/${domain}?gene=` + invalidGene;

      return request(app.getHttpServer())
        .get(url)
        .expect(404)
        .then( response => {
          assert.strictEqual(response.body.message, 'ghost with the gene is not found');
        });
    });
    it('should return 200 when searching with userAddress', () => {
      const validUserAddress = initGhostFirst.userAddress;
      url = `/${domain}?userAddress=` + validUserAddress;

      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .then(response => {
          // todo: rafac - remove index
          assert.strictEqual(response.body.length, [initGhostFirst, initGhostSecond].length);
          assert.strictEqual(response.body[0].id, initGhostFirst.id);
          assert.strictEqual(response.body[0].gene, initGhostFirst.gene);
          assert.strictEqual(response.body[0].tokenId, initGhostFirst.tokenId);
          assert.strictEqual(response.body[0].userAddress, initGhostFirst.userAddress);
          assert.strictEqual(response.body[0].level, initGhostFirst.level);
          assert.strictEqual(response.body[0].userAddress, initGhostFirst.userAddress);
        });
    });
    it('should return 404 with invalid userAddress', () => {
      const invalidUserAddress = 'wrongUserAddress';
      url = `/${domain}?userAddress=` + invalidUserAddress;

      return request(app.getHttpServer())
        .get(url)
        .expect(404)
        .then( response => {
          assert.strictEqual(response.body.message, 'ghost with the userAddress is not found');
        });
    });
    it('should return 200 when searching with valid pageNum which have ghosts', () => {
      const validPageNum = 1;
      url = `/${domain}?page=` + validPageNum;

      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .then(response => {
          // todo: rafac - remove index
          assert.strictEqual(response.body.length, [initGhostFirst, initGhostSecond].length);
          assert.strictEqual(response.body[0].id, initGhostFirst.id);
          assert.strictEqual(response.body[0].gene, initGhostFirst.gene);
          assert.strictEqual(response.body[0].tokenId, initGhostFirst.tokenId);
          assert.strictEqual(response.body[0].userAddress, initGhostFirst.userAddress);
          assert.strictEqual(response.body[0].level, initGhostFirst.level);
          assert.strictEqual(response.body[0].userAddress, initGhostFirst.userAddress);
        });
    });
    it('should return 200 when searching with pageNum which do not have ghosts', () => {
      const validPageNum = 2;
      url = `/${domain}?page=` + validPageNum;

      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .then(response => {
          assert.strictEqual(response.body.length, [].length);
        });
    });
    it('should return 422 when searching with invalid pageNum', () => {
      const invalidPageNum = 0;
      url = `/${domain}?page=` + invalidPageNum;

      return request(app.getHttpServer())
        .get(url)
        .expect(422)
        .then(response => {
          assert.strictEqual(response.body.message, 'not allowed page');
        });
    });
  });

  // todo: add other tests
});
