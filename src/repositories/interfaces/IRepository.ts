// src/repositories/interfaces/IRepository.ts

/**
 * Generic repository interface for CRUD operations.
 */
export interface IRepository<T> {
  /** Retrieve a single entity by its ID */
  getById(id: string): Promise<T | null>;
  /** Retrieve all entities */
  getAll(): Promise<T[]>;
  /** Create a new entity */
  create(item: T): Promise<T>;
  /** Update an existing entity */
  update(id: string, item: Partial<T>): Promise<T>;
  /** Soft‑delete an entity */
  delete(id: string): Promise<void>;
}
