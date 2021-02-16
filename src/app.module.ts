import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './auth/config/typeorm.config';
import { ImagesModule } from './images/images.module';
import { AppController } from './app.controller';
import { KakaoLogin } from './app.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [KakaoLogin],
})
export class AppModule {}
