import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './auth/config/typeorm.config';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
