import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  const createMovie = () => {
    const newMovie = {
      title: 'Test Movies',
      genres: ['test'],
      year: 2000,
    };
    service.create(newMovie);

    return newMovie;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getById', () => {
    it('should return a movie', () => {
      createMovie();
      const findMovie = service.getById(1);
      expect(findMovie).toBeDefined();
      expect(findMovie.id).toBe(1);
    });

    it('should throw 404 error', () => {
      const findId = 999;

      try {
        service.getById(findId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Movie with ID ${findId} not found.`);
      }
    });
  });

  describe('delete', () => {
    it('deletes a movie', () => {
      createMovie();
      const beforeDelete = service.getAll().length;
      service.delete(1);
      const afterDelete = service.getAll().length;

      expect(afterDelete).toBe(beforeDelete - 1);
    });

    it('should throw 404 error', () => {
      try {
        service.delete(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      createMovie();
      const afterCreate = service.getAll().length;

      expect(beforeCreate).toBe(0);
      expect(afterCreate).toBe(1);
    });

    it('should create a multiple movies', () => {
      const makeMovies = 5;
      for (let i = 0; i < makeMovies; i += 1) {
        createMovie();
      }
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBe(makeMovies);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      const createdMovie = createMovie();
      const beforeUpdate = service.getById(1);

      expect(beforeUpdate.title).toContain(createdMovie.title);

      const newTitle = 'New Title';
      service.update(beforeUpdate.id, { title: newTitle });

      const afterUpdate = service.getById(1);

      expect(afterUpdate.title).not.toBe(beforeUpdate.title);
      expect(afterUpdate.title).toBe(newTitle);
      expect(afterUpdate.id).toBe(beforeUpdate.id);
      expect(afterUpdate.generes).toEqual(beforeUpdate.generes);
      expect(afterUpdate.year).toBe(afterUpdate.year);
    });

    it('should throw 404 error', () => {
      try {
        service.update(999, { title: 'New Title' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
