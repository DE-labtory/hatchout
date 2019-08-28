import {Body, Controller, Get, Inject, Injectable, Param, Post, Query} from '@nestjs/common';
import {TransactionService} from '../../app/transaction/transaction.service.impl';
import {Transaction} from '../../domain/transaction/transaction.entity';
import {CreateTransactionDto} from '../../app/transaction/dto/create-transaction.dto';

@Injectable()
@Controller('transactions')
export class TransactionController {
    constructor(@Inject('TransactionService') private service: TransactionService) {}

    @Get()
    async getAll(@Query('page') page: number): Promise<Transaction[]> {
        return await this.service.getAll(page);
    }

    @Get(':txHash')
    async get(@Param('txHash') txHash: string): Promise<Transaction> {
        return await this.service.get(txHash);
    }

    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return await this.service.create(createTransactionDto);
    }
}
