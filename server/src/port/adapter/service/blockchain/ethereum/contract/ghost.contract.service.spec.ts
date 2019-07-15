import {Test} from '@nestjs/testing';
import {ConfigModule} from 'nestjs-config';
import * as path from 'path';
import {GhostContractService} from './ghost.contract.service';
import {Web3Module} from '../web3/web3.module';
import {GhostHandler} from '../event/handler/ghost.event.handler';
import {instance, mock} from 'ts-mockito';

describe('GhostContractService', () => {
        let ghostContractService: GhostContractService;
        const mockGhostEventHandler = mock(GhostHandler);

        beforeAll( async () => {
            const module = await Test.createTestingModule({
                imports: [
                    Web3Module,
                    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
                ],
                providers: [
                    GhostContractService,
                    {
                        provide: 'GhostHandler',
                        useValue: instance(mockGhostEventHandler),
                    },
                ],
            }).compile();
            ghostContractService = module.get<GhostContractService>(GhostContractService);
        });
        describe('#watchGhostEvents()', () => {
            it('should check blockNum increase by one', async () => {
                await ghostContractService.watchGhostEvents();
            });
        });
    },
);
