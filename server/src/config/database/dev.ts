export default {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'de-labtory',
    password: 'de-labtory',
    database: 'hatchout',
    logging: false,
    synchronize: true,
    entities: ['src/domain/**/*.entity{.ts,.js}'],
};
