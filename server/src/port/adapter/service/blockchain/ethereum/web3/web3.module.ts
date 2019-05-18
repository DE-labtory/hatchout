import { Module } from '@nestjs/common';
import Web3 from 'web3';
import { Web3Config } from './web3.config';

export const web3Provider = [
  {
    provide: 'WEB3',
    useFactory: (web3Config: Web3Config) => {
      return new Web3(web3Config.getProvider());
    },
    inject: [Web3Config],
  },
];

@Module({
  providers: [...web3Provider, Web3Config],
  exports: [...web3Provider],
})
export class Web3Module {
}
