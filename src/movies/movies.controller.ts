import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(readonly moviesService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Movie {
    return this.moviesService.getById(id);
  }

  @Post()
  create(@Body() data: CreateMovieDto) {
    return this.moviesService.create(data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.moviesService.delete(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: UpdateMovieDto) {
    return this.moviesService.update(id, data);
  }
}
