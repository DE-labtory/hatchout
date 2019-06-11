export default {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'de-labtory',
    password: 'de-labtory',
    database: 'hatchout',
    logging: true,
    synchronize: true,
    entities: ['src/domain/**/*.entity{.ts,.js}'],
};
