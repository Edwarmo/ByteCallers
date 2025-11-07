export class AIAssistantService {
  async getSuggestions(text: string): Promise<string[]> {
    // Mock AI suggestions
    return [
      `Suggestion 1 for: ${text}`,
      `Suggestion 2 for: ${text}`,
    ];
  }
}
