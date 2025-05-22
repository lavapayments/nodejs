export interface CreateCheckoutSessionParams {
  checkout_mode: "onboarding" | "topup";
  origin_url: string;
  reference_id?: string;
  connection_id?: string;
}

export interface CheckoutSessionsListParams {
  cursor?: string;
  limit?: number;
  reference_id?: string;
}

export interface ConnectionsListParams {
  cursor?: string;
  limit?: number;
  reference_id?: string;
}

export interface RequestsListParams {
  cursor?: string;
  limit?: number;
  connection_id?: string;
  product_id?: string;
  metadata_filters?: Record<string, string>;
}

export interface RequestsListResponse {
  data: Request[];
  has_more: boolean;
  next_cursor?: string;
}

export interface UsageParams {
  start: string;
  end?: string;
  connection_id?: string;
  product_id?: string;
  metadata_filters?: Record<string, string>;
}

export interface ListResponse<T> {
  data: T[];
  has_more: boolean;
  next_cursor?: string;
}

export type RestCheckoutSession = {
  checkout_session_id: string;
  checkout_session_token: string;
  checkout_mode: "onboarding" | "topup";
  origin_url: string;
  connection_id?: string;
  reference_id?: string;
  created_at: string;
  completed_at?: string;
};
export type RestConnection = {
  connection_id: string;
  connection_secret: string;
  reference_id?: string;
  wallet: {
    balance: string;
    phone: string;
    email: string;
    first_name: string;
    last_name: string;
    autopay_enabled: boolean;
  };
  next_usage_reset: string;
  previous_usage_reset: string;
  created_at: string;
};
export type RestRequest = {
  request_id: string;
  status: "pending" | "completed" | "error";
  connection_id?: string;
  product_id?: string;
  provider: string;
  provider_key_type: "managed" | "unmanaged";
  model?: string;
  endpoint: string;
  response_id?: string;
  model_usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    input_characters: number;
    output_characters: number;
    total_characters: number;
    input_seconds: number;
    output_seconds: number;
    total_seconds: number;
    input_cost: string;
    output_cost: string;
    total_cost: string;
    payer: "wallet" | "merchant";
  };
  fee: {
    amount: string;
    rate_type: "fixed" | "percentage";
    token_basis: "input+output" | "output";
    breakdown: {
      tier: {
        start: number;
        rate: string;
        type: "tokens_1m" | "characters_1m" | "minutes";
      };
      tokens: number;
      characters: number;
      seconds: number;
      cost: string;
    }[];
  };
  service_charge: {
    amount: string;
    payer: "wallet" | "merchant";
  };
  total_request_cost: string;
  total_wallet_cost: string;
  total_merchant_cost: string;
  metadata: Record<string, string>;
  timestamp?: string;
  created_at: string;
};
export type RestUsage = {
  items: {
    date: string;
    total_requests: number;
    total_usage_tokens: number;
    total_usage_cost: string;
    total_fee_amount: string;
    total_service_charge_amount: string;
    total_request_cost: string;
    total_wallet_cost: string;
    total_merchant_cost: string;
  }[];
  totals: {
    total_requests: number;
    total_usage_tokens: number;
    total_usage_cost: string;
    total_fee_amount: string;
    total_service_charge_amount: string;
    total_request_cost: string;
    total_wallet_cost: string;
    total_merchant_cost: string;
  };
};
