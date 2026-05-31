import { IRepository } from '../interfaces/IRepository';

export abstract class BaseRepository<T, CreateDto, UpdateDto>
  implements IRepository<T, CreateDto, UpdateDto>
{
  
  abstract findById(id: number): Promise<T | null>;
  abstract create(dto: CreateDto): Promise<T>;
  abstract update(id: number, dto: UpdateDto): Promise<T>;
  abstract delete(id: number): Promise<void>;
}
