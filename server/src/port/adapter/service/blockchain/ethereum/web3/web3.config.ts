import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import { provider } from 'web3-providers';
import { InjectConfig } from 'nestjs-config';

@Injectable()
export class Web3Config {
  constructor(@InjectConfig() private config) {}
  getProvider(): provider {
    const url = this.config.get('web3.url');
    switch (this.config.get('web3.type')) {
      case 'http':
        return new Web3.providers.HttpProvider(url);
      case 'socket':
        return new Web3.providers.WebsocketProvider(url);
      default:
        return new Web3.providers.HttpProvider(url);
    }
  }
}
