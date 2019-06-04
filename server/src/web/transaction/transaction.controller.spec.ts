import {instance, mock, when} from 'ts-mockito';
import {TransactionService} from '../../app/transaction/transaction.service.impl';
import {Transaction} from '../../domain/transaction/transaction.entity';
import {TransactionController} from './transaction.contoller';
import {Test, TestingModule} from '@nestjs/testing';
import {CreateTransactionDto} from '../../app/transaction/dto/create-transaction.dto';

describe('TransactionController', () => {
    const blockHash = '0x0000000000000000000000000000000000000000000000000000000012345678';
    const blockNumber = 0;
    const txHash = '0x0000000000000000000000000000000000000000000000000000000009101112';
    const txIndex = 1;
    const from = '0x1234000000000000000000000000000000000000';
    const to = '0x5678000000000000000000000000000000000000';
    const contractAddress = '0x0910000000000000000000000000000000000000';
    const status = '0x0';

    const mockService = mock(TransactionService);
    const transaction: Transaction = new Transaction(
        blockHash,
        blockNumber,
        txHash,
        txIndex,
        from,
        to,
        contractAddress,
        status,
    );
    let controller: TransactionController;

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            // given
            const module: TestingModule = await Test.createTestingModule({
                controllers: [
                    TransactionController,
                ],
                providers: [
                    {
                        provide: 'TransactionService',
                        useValue: instance(mockService),
                    },
                ],
            }).compile();

            // when
            controller = module.get<TransactionController>(TransactionController);

            // then
            expect(controller).toBeDefined();
        });
    });

    describe('#get()', () => {
        it('should return transaction', async () => {
            when(mockService.get(txHash)).thenReturn(new Promise(resolve => {
                resolve(transaction);
            }));
            controller = new TransactionController(instance(mockService));

            expect(await controller.get(txHash)).toBe(transaction);
        });

        it('should return undefined', async () => {
            when(mockService.get(txHash)).thenReturn(new Promise(resolve => {
                resolve(undefined);
            }));
            controller = new TransactionController(instance(mockService));

            expect(await controller.get(txHash)).toBeUndefined();
        });
    });

    describe('#getAll()', () => {
        let page: number;
        let txList: Transaction[];

        it('should return transaction list', async () => {
            page = 1;
            txList = [transaction];
            when(mockService.getAll(page)).thenReturn(new Promise(resolve => {
                resolve(txList);
            }));
            controller = new TransactionController(instance(mockService));

            expect(await controller.getAll(page)).toBe(txList);
        });

        it('should return undefined', async () => {
            page = 2;
            when(mockService.getAll(page)).thenReturn(new Promise(resolve => {
                resolve(undefined);
            }));
            controller = new TransactionController(instance(mockService));

            expect(await controller.getAll(page)).toBeUndefined();
        });
    });

    describe('#create', () => {
        let transactionDto: CreateTransactionDto;

        it('should return created transaction', async () => {
            transactionDto = new CreateTransactionDto(
                blockHash,
                blockNumber,
                txHash,
                txIndex,
                from,
                to,
                contractAddress,
                status,
            );
            when(mockService.create(transactionDto)).thenReturn(new Promise(resolve => {
                resolve(transaction);
            }));
            controller = new TransactionController(instance(mockService));

            expect(await controller.create(transactionDto)).toBe(transaction);
        });

        it('should throw "txHash should be defined"', async () => {
            transactionDto = new CreateTransactionDto();
            when(mockService.create(transactionDto))
                .thenReject()
                .thenThrow(new Error('txHash should be defined'));
            controller = new TransactionController(instance(mockService));

            await expect(controller.create(transactionDto))
                .rejects
                .toThrowError('txHash should be defined');
        });

        it('should throw "txHash is already registered"', async () => {
            transactionDto = new CreateTransactionDto(
                blockHash,
                blockNumber,
                txHash,
                txIndex,
                from,
                to,
                contractAddress,
                status,
            );
            when(mockService.create(transactionDto))
                .thenReject()
                .thenThrow(new Error('txHash is already registered'));
            controller = new TransactionController(instance(mockService));

            await expect(controller.create(transactionDto))
                .rejects
                .toThrowError('txHash is already registered');
        });
    });
});
