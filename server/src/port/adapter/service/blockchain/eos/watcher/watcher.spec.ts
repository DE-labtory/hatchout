import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "nestjs-config";
import * as path from "path";
import { WatcherService } from "./watcher";

describe("WatcherService", () => {
    let service: WatcherService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname + '/test', 'config', '**/watch.{ts,js}')),
            ],
            providers: [WatcherService]
        }).compile();

        service = module.get<WatcherService>(WatcherService);
        service.watch();
    });

    describe("dependency resolve", () => {
        it("should be defined", async () => {
            expect(service).toBeDefined();
        });
    });

    // describe("#watch()", () => {
    //     expect(service.watch()).toBe(true);
    // });
});
