import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



/*
const pubClient = createClient({ url: "http://localhost:3000" });
const subClient = pubClient.duplicate();
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
   // app.useWebSocketAdapter(new RedisIoAdapter(app));
    await app.listen(9001, () => console.log('Running on Port 9001'));
}
bootstrap();
});
*/


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(9002, () => console.log('Running on Port 9002'));
}
bootstrap();

