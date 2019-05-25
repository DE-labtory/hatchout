import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {UserModule} from '../../src/port/module/user.module';
import {UserServiceImpl} from '../../src/app/user/user.service.impl';
import {User} from '../../src/domain/user/user.entity';
import createMockInstance from "jest-create-mock-instance";
import {UserService} from "../../src/app/user/user.service";


describe('User', () => {
   let app: INestApplication;

   const mockUserServiceImpl = createMockInstance(UserServiceImpl);

   afterAll(async () => await app.close());

   describe('#get()',  () => {
       let url: string;
       let user: User;
       let response;

       it('should return 200', async () => {
           url = '/users/1';
           user = new User('testAddress', 'testName');
           response = { address: 'testAddress', name: 'testName', point: 0, level: 0 };

           mockUserServiceImpl.get = jest.fn().mockReturnValue(user);

           const module = await Test.createTestingModule({
               imports: [UserModule],
           })
               .overrideProvider('UserService')
               .useValue(mockUserServiceImpl)
               .compile();

           app = module.createNestApplication();
           await app.init();

           return request(app.getHttpServer())
               .get(url)
               .expect(200)
               .expect(response);
       });
       it('should return 400', async () => {
           url = '/users/1';
           response = { statusCode: 400, error: 'Bad Request', message: 'no user with the id' };
           mockUserServiceImpl.get = jest.fn().mockReturnValue(undefined);
           const module = await Test.createTestingModule({
               imports: [UserModule],
           })
               .overrideProvider('UserService')
               .useValue(mockUserServiceImpl)
               .compile();

           app = module.createNestApplication();
           await app.init();

           return request(app.getHttpServer())
               .get(url)
               .expect(400)
               .expect(response);
       });
   });
   describe('#create()', () => {
       it('should return 200', async () => {

       });
       it('should return 400', async () => {

       });
   });
   describe('#delete()',  () => {
       it('should return 200', async () => {

       });
       it('should return 400', async () => {

       });
   });
});
