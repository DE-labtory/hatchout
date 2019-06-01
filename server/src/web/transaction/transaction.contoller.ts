import {Body, Controller, Get, Inject, Injectable, Param, Post, Query, Req} from '@nestjs/common';
import {TransactionService} from '../../app/transaction/transaction.service.impl';
import {Transaction} from '../../domain/transaction/transaction.entity';
import {CreateTransactionRequest} from '../../app/transaction/request/create-transaction.request';

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
    async create(@Body() createTransactionRequest: CreateTransactionRequest): Promise<Transaction> {
        return await this.service.create(createTransactionRequest);
    }
}
