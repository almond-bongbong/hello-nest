import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MoviesService } from '../src/movies/movies.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moviesService: MoviesService;

  const createMovie = () => {
    const newMovie = {
      title: 'Test Movies',
      genres: ['test'],
      year: 2000,
    };
    moviesService.create(newMovie);

    return newMovie;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [MoviesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    moviesService = moduleFixture.get<MoviesService>(MoviesService);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe('/movies', () => {
    it('GET', () => {
      createMovie();
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect(res => res.body.length === 1);
    });

    it('POST', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Movie Title',
          year: 2000,
          genres: ['Test'],
        })
        .expect(201);
    });

    it('DELETE', () => {
      return request(app.getHttpServer())
        .delete('/movies')
        .expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      const createdMovie = createMovie();
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200)
        .expect({
          id: 1,
          title: createdMovie.title,
          year: createdMovie.year,
          genres: createdMovie.genres,
        });
    });

    it('GET 404', () => {
      return request(app.getHttpServer())
        .get('/movies/999')
        .expect(404);
    });

    it('PATCH 200', () => {
      createMovie();
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'New Title' })
        .expect(200);
    });

    it('PATCH 404', () => {
      return request(app.getHttpServer())
        .patch('/movies/999')
        .send({ title: 'New Title' })
        .expect(404);
    });

    it('PATCH 400', () => {
      createMovie();
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'New Title', other: 'bar' })
        .expect(400);
    });

    it('DELETE 200', () => {
      createMovie();
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200);
    });

    it('DELETE 404', () => {
      return request(app.getHttpServer())
        .delete('/movies/999')
        .expect(404);
    });
  });
});
