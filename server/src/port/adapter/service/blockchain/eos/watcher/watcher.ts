import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { BaseActionWatcher } from 'demux';
import { NodeosActionReader } from 'demux-eos';
import { NodeosActionReaderOptions } from './types/types';
import { ObjectActionHandler } from './actionHandler/ObjectActionHandler';
import handlerVersion from './actionHandler/handlerVersions/v1';

@Injectable()
export class WatcherService {
    constructor(@InjectConfig() private config) {
        const actionHandler = new ObjectActionHandler([handlerVersion], this.config.get('watch.stopAt'));
        const actionReaderOpts: NodeosActionReaderOptions = {
            nodeosEndpoint: this.config.get('watcher.endPoint'),
            onlyIrreversible: this.config.get('watcher.irreversible')
                ? true
                : false,
            startAtBlock: this.config.get('watcher.startAt'),
        };
        const actionReader = new NodeosActionReader(actionReaderOpts);
        this.actionWatcher = new BaseActionWatcher(
            actionReader,
            actionHandler,
            250,
        );
    }
    private actionWatcher: BaseActionWatcher;

    public watch() {
        this.actionWatcher.watch();
    }
}
