export default {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test',
    password: 'test',
    database: 'hatchout',
    logging: false,
    synchronize: true,
    entities: ['src/domain/**/*.entity{.ts,.js}'],
    dropSchema: true,
};
