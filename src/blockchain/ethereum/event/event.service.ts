import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class EventService {
  constructor(private readonly web3: Web3) {}
}
