import { Resources } from "./resources";

// Types for the package
export type ApiVersion = "2025-04-21.v1";

export interface Config {
  apiVersion: ApiVersion;
  /**
   * Base URL for the API.
   * If not provided, it will be inferred from the secret key (production or sandbox).
   */
  baseUrl?: string;
}

export type ForwardTokenOptions =
  | {
      connection_secret: string;
      product_secret: string;
      provider_key?: string;
    }
  | {
      connection_secret: null;
      product_secret: null;
      provider_key: string;
    };

export class Lava {
  private readonly secretKey: string;
  private readonly baseUrl: string;
  private readonly apiVersion: ApiVersion;

  /**
   * The checkout sessions resource
   */
  public readonly checkoutSessions: Resources.CheckoutSessionsResource;

  /**
   * The connections resource
   */
  public readonly connections: Resources.ConnectionsResource;

  /**
   * The requests resource
   */
  public readonly requests: Resources.RequestsResource;

  /**
   * The usage resource
   */
  public readonly usage: Resources.UsageResource;

  /**
   * OpenAI base URL for convenience
   */
  public readonly openaiUrl: string;

  /**
   * Anthropic base URL for convenience
   */
  public readonly anthropicUrl: string;

  /**
   * Mistral base URL for convenience
   */
  public readonly mistralUrl: string;

  /**
   * DeepSeek base URL for convenience
   */
  public readonly deepseekUrl: string;

  /**
   * xAI base URL for convenience
   */
  public readonly xaiUrl: string;

  /**
   * Google base URL for convenience
   */
  public readonly googleUrl: string;

  /**
   * Google OpenAI-compatible base URL for convenience
   */
  public readonly googleOpenaiCompatibleUrl: string;

  /**
   * Create a new Lava client
   * @param secretKey Your Lava secret key
   * @param config Configuration options
   */
  constructor(secretKey: string, config: Config) {
    this.secretKey = secretKey;
    this.apiVersion = config.apiVersion;

    // Determine if we're in test mode based on the secret key
    const isTestMode = secretKey.startsWith("aks_test_");

    // Set base URL based on test mode or config override
    this.baseUrl =
      config.baseUrl ||
      (isTestMode
        ? "https://sandbox-api.lavapayments.com/v1/"
        : "https://api.lavapayments.com/v1/");

    // Initialize resources
    this.checkoutSessions = new Resources.CheckoutSessionsResource(this);
    this.connections = new Resources.ConnectionsResource(this);
    this.requests = new Resources.RequestsResource(this);
    this.usage = new Resources.UsageResource(this);

    // Initialize provider URLs
    this.openaiUrl = `${this.baseUrl}forward?u=https://api.openai.com/v1`;
    this.anthropicUrl = `${this.baseUrl}forward?u=https://api.anthropic.com/v1`;
    this.mistralUrl = `${this.baseUrl}forward?u=https://api.mistral.ai/v1`;
    this.deepseekUrl = `${this.baseUrl}forward?u=https://api.deepseek.com/v1`;
    this.xaiUrl = `${this.baseUrl}forward?u=https://api.x.ai/v1`;
    this.googleUrl = `${this.baseUrl}forward?u=https://generativelanguage.googleapis.com/v1beta`;
    this.googleOpenaiCompatibleUrl = `${this.baseUrl}forward?u=https://generativelanguage.googleapis.com/v1beta/openai`;
  }

  /**
   * Make a request to the Lava API
   * @param method HTTP method
   * @param path API path
   * @param options Request options
   * @returns Response data
   */
  async request<T>(
    method: string,
    path: string,
    { data, query }: { data?: any; query?: Record<string, string> } = {},
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);

    // Add query parameters if provided
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json",
      "X-Lava-API-Version": this.apiVersion,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMessage =
        typeof (errorJson as any).error === "object"
          ? JSON.stringify((errorJson as any).error)
          : (errorJson as any).error || "Unknown error";
      throw new Error(
        `Lava API Error: ${response.status} ${response.statusText} - ${errorMessage}`,
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Generate a token for the forward endpoint
   * @param options Token options
   * @returns Base64 encoded token
   */
  generateForwardToken(options: ForwardTokenOptions): string {
    const tokenData = {
      secret_key: this.secretKey,
      connection_secret: options.connection_secret,
      product_secret: options.product_secret,
      provider_key: options.provider_key,
    };

    return Buffer.from(JSON.stringify(tokenData)).toString("base64");
  }
}
