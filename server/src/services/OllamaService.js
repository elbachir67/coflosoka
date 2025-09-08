import { logger } from "../utils/logger.js";

class OllamaService {
  constructor() {
    this.baseUrl = "http://host.docker.internal:11434";
    this.defaultModel = "mistral";
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return { status: "healthy", models: data.models || [] };
    } catch (error) {
      return { status: "unavailable" };
    }
  }

  async listModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      return [];
    }
  }

  async chat(messages, options = {}) {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        prompt: prompt,
        stream: false
      })
    });
    const data = await response.json();
    return { message: data.response };
  }
}

export default new OllamaService();
