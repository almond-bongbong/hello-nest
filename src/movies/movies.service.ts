import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  private movies = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getById(id: number): Movie {
    const findMovie = this.movies.find(m => m.id === id);
    if (!findMovie)
      throw new NotFoundException(`Movie with ID ${id} not found.`);

    return findMovie;
  }

  create(data: CreateMovieDto) {
    this.movies.push({ id: this.movies.length + 1, ...data });
  }

  update(id: number, data: UpdateMovieDto) {
    const findMovie = this.getById(id);
    this.delete(id);
    this.movies.push({ ...findMovie, ...data });
  }

  delete(id: number) {
    const findMovie = this.getById(id);
    this.movies = this.movies.filter(m => m.id !== findMovie.id);
  }
}
