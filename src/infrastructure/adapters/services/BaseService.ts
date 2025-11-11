export abstract class BaseService {
    protected abstract serviceName: string;

    protected log(message: string): void {
        console.log(`[${this.serviceName}] ${message}`);
    }

    protected handleError(error: unknown): never {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.log(`ERROR: ${errorMessage}`);
        throw error;
    }

    protected async executeWithLogging<T>(
        operation: string,
        fn: () => Promise<T>
    ): Promise<T> {
        this.log(`Executing: ${operation}`);
        try {
            const result = await fn();
            this.log(`Success: ${operation}`);
            return result;
        } catch (error) {
            this.log(`Failed: ${operation}`);
            throw error;
        }
    }
}
