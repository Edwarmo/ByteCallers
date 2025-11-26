export abstract class BaseRepository<T> {
    protected storage: Map<string, T> = new Map();

    async findById(id: string): Promise<T | null> {
        return this.storage.get(id) || null;
    }

    async findAll(): Promise<T[]> {
        return Array.from(this.storage.values());
    }

    async delete(id: string): Promise<void> {
        this.storage.delete(id);
    }

    protected findBy(predicate: (entity: T) => boolean): T[] {
        return Array.from(this.storage.values()).filter(predicate);
    }

    protected saveEntity(id: string, entity: T): void {
        this.storage.set(id, entity);
    }
}
