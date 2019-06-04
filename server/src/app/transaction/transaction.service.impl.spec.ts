import {TransactionRepository} from '../../port/persistence/repository/transaction.repository.impl';
import {mock, instance, when, anything} from 'ts-mockito';
import {TransactionService} from './transaction.service.impl';
import {Test, TestingModule} from '@nestjs/testing';
import {Transaction} from '../../domain/transaction/transaction.entity';
import {CreateTransactionDto} from './dto/create-transaction.dto';

describe('TransactionService', async () => {
    const blockHash = '0x0000000000000000000000000000000000000000000000000000000012345678';
    const blockNumber = 0;
    const txHash = '0x0000000000000000000000000000000000000000000000000000000009101112';
    const txIndex = 1;
    const from = '0x1234000000000000000000000000000000000000';
    const to = '0x5678000000000000000000000000000000000000';
    const contractAddress = '0x0910000000000000000000000000000000000000';
    const status = '0x0';

    const mockRepository: TransactionRepository = mock(TransactionRepository);
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
    let service: TransactionService;

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            // given
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    TransactionService,
                    {
                        provide: 'ITransactionRepository',
                        useValue: instance(mockRepository),
                    },
                ],
            }).compile();

            // when
            service = module.get<TransactionService>(TransactionService);

            // then
            expect(service).toBeDefined();
        });
    });

    describe('#create()', () => {
        let createTransactionDto: CreateTransactionDto;

        it('should return created transaction', async () => {
            when(mockRepository.findOne(txHash)).thenReturn(undefined);
            when(mockRepository.save(anything())).thenReturn(new Promise((resolve) => {
                resolve(transaction);
            }));
            service = new TransactionService(instance(mockRepository));
            createTransactionDto = new CreateTransactionDto(
                blockHash,
                blockNumber,
                txHash,
                txIndex,
                from,
                to,
                contractAddress,
                status,
            );

            expect(await service.create(createTransactionDto)).toBe(transaction);
        });

        it('should throw "txHash should defined"', async () => {
            service = new TransactionService(instance(mockRepository));
            createTransactionDto = new CreateTransactionDto();

            await expect(service.create(createTransactionDto))
                .rejects
                .toThrowError('txHash should be defined');
        });

        it('should throw "txHash is already registered"', async () => {
            when(mockRepository.findOne(txHash)).thenReturn(new Promise((resolve) => {
                resolve(transaction);
            }));
            service = new TransactionService(instance(mockRepository));
            createTransactionDto = new CreateTransactionDto(
                blockHash,
                blockNumber,
                txHash,
                txIndex,
                from,
                to,
                contractAddress,
                status,
            );

            // then
            await expect(service.create(createTransactionDto))
                .rejects
                .toThrowError('txHash is already registered');
        });
    });

    describe('#get()', () => {
        it('should return transaction', async () => {
            when(mockRepository.findOne(txHash)).thenReturn(new Promise((resolve) => {
                resolve(transaction);
            }));
            service = new TransactionService(instance(mockRepository));

            expect(await service.get(txHash)).toBe(transaction);
        });

        it('should return undefined', async () => {
            const unsavedTxHash = '0x0000000000000000000000000000000000000000000000000000000013141516';
            when(mockRepository.findOne(unsavedTxHash)).thenReturn(undefined);
            service = new TransactionService(instance(mockRepository));

            expect(await service.get(unsavedTxHash)).toBe(undefined);
        });
    });

    describe('#getAll()', () => {
        it('should return transaction list', async () => {
            const txList: Transaction[] = [transaction];
            const page = 1;
            when(mockRepository.find(anything())).thenReturn(new Promise((resolve) => {
                resolve(txList);
            }));
            service = new TransactionService(instance(mockRepository));

            expect(await service.getAll(page)).toBe(txList);
        });

        it('should return undefined', async () => {
            const page = 1;
            when(mockRepository.find(anything())).thenReturn(undefined);
            service = new TransactionService(instance(mockRepository));

            expect(await service.getAll(page)).toBe(undefined);
        });
    });
});
