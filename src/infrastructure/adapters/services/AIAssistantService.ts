import { BaseService } from './BaseService';

export class AIAssistantService extends BaseService {
  protected serviceName = 'AIAssistantService';

  async getSuggestions(text: string): Promise<string[]> {
    return this.executeWithLogging('getSuggestions', async () => {
      return [
        `Suggestion 1 for: ${text}`,
        `Suggestion 2 for: ${text}`,
      ];
    });
  }
}
