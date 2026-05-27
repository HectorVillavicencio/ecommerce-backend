export interface IService<T, CreateDto, UpdateDto> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T>;
  create(dto: CreateDto): Promise<T>;
  update(id: number, dto: UpdateDto): Promise<T>;
  delete(id: number): Promise<void>;
}
