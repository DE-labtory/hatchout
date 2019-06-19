export default {
    type: 'postgres',
    host: 'localhost',
    logging: true,
    port: 5432,
    username: 'de-labtory',
    password: 'de-labtory',
    database: 'hatchout-test',
    synchronize: true,
    entities: ['src/domain/**/*.entity{.ts,.js}'],
};
