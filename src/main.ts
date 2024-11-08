import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { NotFoundFilter } from './not-found.filter';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurer les assets statiques et les vues
  app.useStaticAssets(join(__dirname, 'dist', 'public'));
  app.setBaseViewsDir(join(__dirname, 'dist' ,'views'));
  app.setViewEngine('hbs');

  // Enregistrer les partials pour Handlebars
  hbs.registerPartials(join(__dirname, 'dist', 'views', 'partials'));

  // Utiliser le filtre global pour les erreurs 404
  app.useGlobalFilters(new NotFoundFilter());

  await app.listen(4000);
  console.log('Frontend démarré sur http://localhost:4000');
  // dist/main.js
  console.log(__dirname);

}
bootstrap();
