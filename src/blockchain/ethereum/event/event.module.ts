import { Module } from '@nestjs/common';

const configWeb3Provider = {
  provide: 'WEB3',
  useFactory: async () => {
    return connection;
  },
  inject: [OptionsProvider],
};

@Module({})
export class EventModule {}
