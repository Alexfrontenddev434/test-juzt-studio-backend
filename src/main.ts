import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://test-iota-three-54.vercel.app',
      'https://test-app-juzt-studio-6bp5.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  await app.listen(3005);
}
bootstrap();
