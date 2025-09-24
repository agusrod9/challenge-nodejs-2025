import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule} from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=>{
        const redisUrl = `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`;
        return {
          stores: [new KeyvRedis(redisUrl)], ttl: 30*1000
        };
      }
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=>({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
