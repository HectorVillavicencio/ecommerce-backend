export interface IRepository<T, CreateDto, UpdateDto> {
  findById(id: number): Promise<T | null>;
  create(dto: CreateDto): Promise<T>;
  update(id: number, dto: UpdateDto): Promise<T>;
  delete(id: number): Promise<void>;
}
