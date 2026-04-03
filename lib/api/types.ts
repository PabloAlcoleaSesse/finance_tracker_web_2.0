export type ISODateTime = string;

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export type ErrorResponse = {
  error: string;
};

export type AuthResponse = {
  user: UserResponse;
  token: string;
};

export type UserResponse = {
  id: number;
  email: string;
  name: string;
  two_factor_enabled?: boolean;
  created_at: ISODateTime;
};

export type Portfolio = {
  id: number;
  user_id: number;
  name: string;
  base_currency: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
};

export type Position = {
  id: number;
  portfolio_id: number;
  name: string;
  ticker: string;
  asset_type: string;
  shares: number;
  average_cost: number;
  current_price: number;
  currency: string;
  last_price_update?: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
};

export type PositionWithMetrics = Position & {
  total_cost: number;
  total_value: number;
  gain: number;
  gain_percent: number;
  daily_change: number;
  daily_change_percent: number;
};

export type Transaction = {
  id: number;
  portfolio_id: number;
  position_id?: number;
  name: string;
  ticker: string;
  trade_type: "buy" | "sell";
  quantity: number;
  price: number;
  commission: number;
  total: number;
  currency: string;
  trade_date: ISODateTime;
  asset_type: string;
  notes?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
};

export type PortfolioSummary = {
  portfolio_id: number;
  total_cost: number;
  total_value: number;
  total_gain: number;
  total_gain_percent: number;
  by_asset_type: Record<string, number>;
  base_currency: string;
  last_updated: ISODateTime;
};

export type TaxReport = {
  portfolio_id: number;
  year: number;
  start_date: ISODateTime;
  end_date: ISODateTime;
  realized_gains: Record<string, unknown>[];
  dividends: Record<string, unknown>[];
  totals: Record<string, unknown>;
  by_asset_type: Record<string, unknown>;
  currency: string;
  generated_at: ISODateTime;
};

export type UnrealizedGain = {
  position_id: number;
  ticker: string;
  shares: number;
  average_cost: number;
  current_price: number;
  total_cost: number;
  current_value: number;
  unrealized_gain: number;
  gain_percent: number;
  purchase_date?: ISODateTime;
  holding_period?: string;
  currency: string;
  asset_type: string;
};

export type TaxHarvestingOpportunity = {
  position_id: number;
  ticker: string;
  unrealized_loss: number;
  shares: number;
  cost_basis: number;
  current_price: number;
  recommendation: string;
};

export type Dividend = {
  id: number;
  portfolio_id: number;
  position_id: number;
  ticker: string;
  amount: number;
  currency: string;
  per_share?: number;
  shares?: number;
  payment_date: ISODateTime;
  ex_date?: ISODateTime;
  is_qualified?: boolean;
  tax_withheld?: number;
  notes?: string;
  created_at: ISODateTime;
};

export type PortfolioSnapshot = {
  id: number;
  portfolio_id: number;
  total_value: number;
  total_cost: number;
  total_gain: number;
  gain_percent: number;
  date: ISODateTime;
  created_at: ISODateTime;
};

export type PerformanceMetrics = {
  portfolio_id: number;
  total_return: number;
  annualized_return: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  max_drawdown_percent: number;
  daily_return: number;
  monthly_return: number;
  year_to_date_return: number;
  start_date: ISODateTime;
  end_date: ISODateTime;
  days_tracked: number;
};

export type BenchmarkComparison = {
  portfolio_id: number;
  benchmark_symbol: string;
  benchmark_name: string;
  portfolio_return: number;
  benchmark_return: number;
  alpha: number;
  beta: number;
  portfolio_volatility: number;
  benchmark_volatility: number;
  portfolio_sharpe_ratio: number;
  benchmark_sharpe_ratio: number;
  correlation: number;
  tracking_error: number;
  information_ratio: number;
  start_date: ISODateTime;
  end_date: ISODateTime;
};

export type PriceData = {
  symbol: string;
  price: number;
  currency: string;
  change?: number;
  change_percent?: number;
  volume?: number;
  market_cap?: number;
  last_update: ISODateTime;
  source?: string;
  market_open?: boolean;
  previous_close?: number;
};

export type PriceHistory = {
  id: number;
  symbol: string;
  price: number;
  currency: string;
  volume?: number;
  timestamp: ISODateTime;
  source?: string;
  created_at: ISODateTime;
};

export type PriceUpdateResponse = {
  updated: string[];
  failed: string[];
  cached: string[];
  prices: Record<string, number>;
  timestamp: ISODateTime;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  two_factor_code?: string;
};

export type TwoFactorStatusResponse = {
  enabled: boolean;
};

export type TwoFactorSetupResponse = {
  secret: string;
  otpauth_url: string;
};

export type TwoFactorCodeRequest = {
  code: string;
};

export type TwoFactorActionResponse = {
  status: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  status?: string;
  message?: string;
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
};

export type ResetPasswordResponse = {
  status?: string;
  message?: string;
};

export type CreatePortfolioRequest = {
  name: string;
  base_currency?: string;
};

export type UpdatePortfolioRequest = Partial<{
  name: string;
  base_currency: string;
}>;

export type CreatePositionRequest = {
  name: string;
  ticker: string;
  asset_type: string;
  shares: number;
  average_cost: number;
  current_price: number;
  currency: string;
};

export type UpdatePositionRequest = Partial<{
  shares: number;
  average_cost: number;
  current_price: number;
}>;

export type CreateTransactionRequest = {
  position_id?: number;
  name: string;
  ticker: string;
  trade_type: "buy" | "sell";
  quantity: number;
  price: number;
  commission?: number;
  currency: string;
  trade_date: ISODateTime;
  asset_type: string;
  notes?: string;
};

export type BrokerImportResponse = {
  imported?: number;
  skipped?: number;
  failed?: number;
  message?: string;
  details?: unknown;
};

export type IbkrConnection = {
  id: number;
  name?: string;
  account_id?: string;
  status?: string;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
};

export type CreateIbkrConnectionRequest = Record<string, unknown>;

export type UpdateIbkrConnectionRequest = Record<string, unknown>;

export type IbkrConnectionStatus = {
  status?: string;
  message?: string;
  last_import_at?: ISODateTime;
  details?: unknown;
};

export type CreateDividendRequest = {
  position_id: number;
  ticker: string;
  amount: number;
  currency: string;
  per_share?: number;
  shares?: number;
  payment_date: ISODateTime;
  ex_date?: ISODateTime;
  is_qualified?: boolean;
  tax_withheld?: number;
  notes?: string;
};

export type CreateSnapshotRequest = {
  date?: ISODateTime;
};

export type QueryRange = {
  from?: ISODateTime;
  to?: ISODateTime;
};
