export type CheckoutMode = "onboarding" | "topup";

export interface CreateCheckoutSessionParams {
  checkout_mode: CheckoutMode;
  origin_url: string;
  reference_id?: string;
  connection_id?: string;
}

export interface CheckoutSession {
  checkout_session_id: string;
  checkout_session_token: string;
  checkout_mode: CheckoutMode;
  origin_url: string;
  connection_id?: string;
  reference_id?: string;
  created_at: string;
  completed_at?: string;
}

export interface Wallet {
  balance: string;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Connection {
  connection_id: string;
  connection_secret: string;
  reference_id?: string;
  wallet: Wallet;
  next_usage_reset: string;
  previous_usage_reset: string;
  created_at: string;
}

export interface ConnectionsListParams {
  cursor?: string;
  limit?: number;
  reference_id?: string;
}

export interface ConnectionsListResponse {
  data: Connection[];
  has_more: boolean;
  next_cursor?: string;
}

export interface ModelUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_cost: string;
  output_cost: string;
  total_cost: string;
}

export interface FeeTierBreakdown {
  tier: {
    start: number;
    rate: string;
  };
  tokens: number;
  cost: string;
}

export interface Fee {
  amount: string;
  rate_type: "fixed" | "percentage";
  token_basis: "input+output" | "output";
  breakdown: FeeTierBreakdown[];
}

export interface ServiceCharge {
  amount: string;
  payer: "wallet" | "merchant";
}

export interface Request {
  request_id: string;
  connection_id?: string;
  product_id?: string;
  provider: string;
  provider_key_type: "managed" | "unmanaged";
  model: string;
  endpoint: string;
  response_id?: string;
  model_usage: ModelUsage;
  fee: Fee;
  service_charge: ServiceCharge;
  total_request_cost: string;
  metadata: Record<string, string>;
  timestamp: string;
  created_at: string;
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

export interface UsageData {
  items: {
    date: string;
    total_requests: number;
    total_usage_tokens: number;
    total_usage_cost: string;
    total_fee_amount: string;
    total_service_charge_amount: string;
    total_request_cost: string;
  }[];
  totals: {
    total_requests: number;
    total_usage_tokens: number;
    total_usage_cost: string;
    total_fee_amount: string;
    total_service_charge_amount: string;
    total_request_cost: string;
  };
}

export interface UsageParams {
  start: string;
  end?: string;
  connection_id?: string;
  product_id?: string;
  metadata_filters?: Record<string, string>;
}

export type Usage = UsageData[];
