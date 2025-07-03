import { Resources } from "./resources";

// Types for the package
export type ApiVersion = "2025-04-28.v1";

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
   * Provider URLs for convenience
   */
  public readonly providers: {
    openai: string;
    anthropic: string;
    mistral: string;
    deepseek: string;
    xai: string;
    google: string;
    googleOpenaiCompatible: string;
    kluster: string;
    inference: string;
    groq: string;
    novita: string;
    vercel: string;
    together: string;
    hyperbolic: string;
    elevenlabs: string;
    sambanova: string;
    deepinfra: string;
    cohere: string;
    parasail: string;
    nebius: string;
  };

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
    this.providers = {
      openai: `${this.baseUrl}forward?u=https://api.openai.com/v1`,
      anthropic: `${this.baseUrl}forward?u=https://api.anthropic.com/v1`,
      mistral: `${this.baseUrl}forward?u=https://api.mistral.ai/v1`,
      deepseek: `${this.baseUrl}forward?u=https://api.deepseek.com/v1`,
      xai: `${this.baseUrl}forward?u=https://api.x.ai/v1`,
      google: `${this.baseUrl}forward?u=https://generativelanguage.googleapis.com/v1beta`,
      googleOpenaiCompatible: `${this.baseUrl}forward?u=https://generativelanguage.googleapis.com/v1beta/openai`,
      kluster: `${this.baseUrl}forward?u=https://api.kluster.ai/v1`,
      inference: `${this.baseUrl}forward?u=https://api.inference.net/v1`,
      groq: `${this.baseUrl}forward?u=https://api.groq.com/openai/v1`,
      novita: `${this.baseUrl}forward?u=https://api.novita.ai/v3/openai`,
      vercel: `${this.baseUrl}forward?u=https://api.v0.dev/v1`,
      together: `${this.baseUrl}forward?u=https://api.together.xyz/v1`,
      hyperbolic: `${this.baseUrl}forward?u=https://api.hyperbolic.xyz/v1`,
      elevenlabs: `${this.baseUrl}forward?u=https://api.elevenlabs.io/v1`,
      sambanova: `${this.baseUrl}forward?u=https://api.sambanova.ai/v1`,
      deepinfra: `${this.baseUrl}forward?u=https://api.deepinfra.com/v1/openai`,
      cohere: `${this.baseUrl}forward?u=https://api.cohere.ai/compatibility/v1`,
      parasail: `${this.baseUrl}forward?u=https://api.parasail.io/v1`,
      nebius: `${this.baseUrl}forward?u=https://api.studio.nebius.com/v1`,
    };
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
