import type {
  ApiError,
  AuthResponse,
  BenchmarkComparison,
  BrokerImportResponse,
  CreateIbkrConnectionRequest,
  CreateDividendRequest,
  CreatePortfolioRequest,
  CreatePositionRequest,
  CreateSnapshotRequest,
  CreateTransactionRequest,
  Dividend,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  PerformanceMetrics,
  Portfolio,
  PortfolioSnapshot,
  PortfolioSummary,
  Position,
  PositionWithMetrics,
  PriceData,
  PriceHistory,
  PriceUpdateResponse,
  QueryRange,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  IbkrConnection,
  IbkrConnectionStatus,
  TaxHarvestingOpportunity,
  TaxReport,
  Transaction,
  TwoFactorActionResponse,
  TwoFactorCodeRequest,
  TwoFactorSetupResponse,
  TwoFactorStatusResponse,
  UnrealizedGain,
  UpdateIbkrConnectionRequest,
  UpdatePortfolioRequest,
  UpdatePositionRequest,
  UserResponse,
} from "@/lib/api/types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
};

const envApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

if (!envApiBaseUrl) {
  throw new Error("Missing required env var NEXT_PUBLIC_API_BASE_URL");
}

const DEFAULT_BASE_URL = envApiBaseUrl;

function buildGoogleAuthUrl(mode: "login" | "register"): string {
  const configuredUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL?.trim();
  const baseUrl = configuredUrl && configuredUrl.length > 0 ? configuredUrl : `${DEFAULT_BASE_URL}/api/auth/google`;

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}mode=${mode}`;
}

function buildNetworkError(path: string, originalError: unknown): ApiError {
  const causeMessage =
    typeof originalError === "object" && originalError && "message" in originalError
      ? String((originalError as { message: string }).message)
      : "Unknown network error";

  return {
    status: 0,
    message: `Network error while contacting API at ${DEFAULT_BASE_URL}${path}. ${causeMessage}`,
    details: {
      baseUrl: DEFAULT_BASE_URL,
      path,
      cause: causeMessage,
    },
  };
}

function toQueryString(query?: RequestOptions["query"]): string {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    params.set(key, String(value));
  });

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

async function parseError(response: Response): Promise<never> {
  const contentType = response.headers.get("content-type") ?? "";
  let message = `Request failed with status ${response.status}`;
  let details: unknown;

  try {
    if (contentType.includes("application/json")) {
      const json = (await response.json()) as { error?: string };
      details = json;
      message = json.error || message;
    } else {
      const text = await response.text();
      details = text;
      if (text) {
        message = text;
      }
    }
  } catch {
    // Keep the default message when body parsing fails.
  }

  const error: ApiError = {
    status: response.status,
    message,
    details,
  };

  throw error;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  const query = toQueryString(options.query);

  const headers = new Headers();
  headers.set("Accept", "application/json, text/plain;q=0.9");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${DEFAULT_BASE_URL}${path}${query}`, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw buildNetworkError(path, error);
  }

  if (!response.ok) {
    await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export const apiClient = {
  health: () => request<string>("/health"),

  getGoogleAuthUrl: (mode: "login" | "register") => buildGoogleAuthUrl(mode),
  
  //Send the google login token to the backend through the api
  googleAuth: (idToken: string) =>
    request<AuthResponse>("/api/auth/google", {
      method: "POST",
      body: { id_token: idToken },
  }),
    
  //Send the registry data
  register: (payload: RegisterRequest) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload: LoginRequest) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    }),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    request<ForgotPasswordResponse>("/api/auth/password/forgot", {
      method: "POST",
      body: payload,
    }),

  resetPassword: (payload: ResetPasswordRequest) =>
    request<ResetPasswordResponse>("/api/auth/password/reset", {
      method: "POST",
      body: payload,
    }),

  getTwoFactorStatus: (token: string) =>
    request<TwoFactorStatusResponse>("/api/users/me/2fa/status", {
      token,
    }),

  setupTwoFactor: (token: string) =>
    request<TwoFactorSetupResponse>("/api/users/me/2fa/setup", {
      method: "POST",
      token,
    }),

  enableTwoFactor: (payload: TwoFactorCodeRequest, token: string) =>
    request<TwoFactorActionResponse>("/api/users/me/2fa/enable", {
      method: "POST",
      body: payload,
      token,
    }),

  disableTwoFactor: (payload: TwoFactorCodeRequest, token: string) =>
    request<TwoFactorActionResponse>("/api/users/me/2fa/disable", {
      method: "POST",
      body: payload,
      token,
    }),

  getUserById: (userId: number, token: string) =>
    request<UserResponse>(`/api/users/${userId}`, {
      token,
    }),

  createPortfolio: (payload: CreatePortfolioRequest, token: string) =>
    request<Portfolio>("/api/portfolios/", {
      method: "POST",
      body: payload,
      token,
    }),

  listPortfolios: (token: string) =>
    request<Portfolio[]>("/api/portfolios/", {
      token,
    }),

  getPortfolioById: (portfolioId: number, token: string) =>
    request<Portfolio>(`/api/portfolios/${portfolioId}`, {
      token,
    }),

  updatePortfolio: (portfolioId: number, payload: UpdatePortfolioRequest, token: string) =>
    request<Portfolio>(`/api/portfolios/${portfolioId}`, {
      method: "PUT",
      body: payload,
      token,
    }),

  deletePortfolio: (portfolioId: number, token: string) =>
    request<void>(`/api/portfolios/${portfolioId}`, {
      method: "DELETE",
      token,
    }),

  getPortfolioSummary: (portfolioId: number, token: string) =>
    request<PortfolioSummary>(`/api/portfolios/${portfolioId}/summary`, {
      token,
    }),

  createPosition: (portfolioId: number, payload: CreatePositionRequest, token: string) =>
    request<Position>(`/api/portfolios/${portfolioId}/positions`, {
      method: "POST",
      body: payload,
      token,
    }),

  listPositions: (portfolioId: number, token: string) =>
    request<PositionWithMetrics[]>(`/api/portfolios/${portfolioId}/positions`, {
      token,
    }),

  updatePosition: (positionId: number, payload: UpdatePositionRequest, token: string) =>
    request<Position>(`/api/portfolios/positions/${positionId}`, {
      method: "PUT",
      body: payload,
      token,
    }),

  deletePosition: (positionId: number, token: string) =>
    request<void>(`/api/portfolios/positions/${positionId}`, {
      method: "DELETE",
      token,
    }),

  createTransaction: (portfolioId: number, payload: CreateTransactionRequest, token: string) =>
    request<Transaction>(`/api/portfolios/${portfolioId}/transactions`, {
      method: "POST",
      body: payload,
      token,
    }),

  listTransactions: (portfolioId: number, token: string) =>
    request<Transaction[]>(`/api/portfolios/${portfolioId}/transactions`, {
      token,
    }),

  createIbkrConnection: (payload: CreateIbkrConnectionRequest, token: string) =>
    request<IbkrConnection>("/api/ibkr/connections", {
      method: "POST",
      body: payload,
      token,
    }),

  listIbkrConnections: (token: string) =>
    request<IbkrConnection[]>("/api/ibkr/connections", {
      token,
    }),

  getIbkrConnectionById: (connectionId: number, token: string) =>
    request<IbkrConnection>(`/api/ibkr/connections/${connectionId}`, {
      token,
    }),

  updateIbkrConnection: (connectionId: number, payload: UpdateIbkrConnectionRequest, token: string) =>
    request<IbkrConnection>(`/api/ibkr/connections/${connectionId}`, {
      method: "PUT",
      body: payload,
      token,
    }),

  deleteIbkrConnection: (connectionId: number, token: string) =>
    request<void>(`/api/ibkr/connections/${connectionId}`, {
      method: "DELETE",
      token,
    }),

  importIbkrTransactions: (connectionId: number, token: string) =>
    request<BrokerImportResponse | Transaction[]>(`/api/ibkr/connections/${connectionId}/import`, {
      method: "POST",
      token,
    }),

  getIbkrConnectionStatus: (connectionId: number, token: string) =>
    request<IbkrConnectionStatus>(`/api/ibkr/connections/${connectionId}/status`, {
      token,
    }),

  getTaxReport: (portfolioId: number, token: string, year?: number) =>
    request<TaxReport>(`/api/portfolios/${portfolioId}/tax/report`, {
      token,
      query: { year },
    }),

  listUnrealizedGains: (portfolioId: number, token: string) =>
    request<UnrealizedGain[]>(`/api/portfolios/${portfolioId}/tax/unrealized-gains`, {
      token,
    }),

  listTaxHarvestingOpportunities: (portfolioId: number, token: string) =>
    request<TaxHarvestingOpportunity[]>(
      `/api/portfolios/${portfolioId}/tax/harvesting-opportunities`,
      {
        token,
      },
    ),

  createDividend: (portfolioId: number, payload: CreateDividendRequest, token: string) =>
    request<Dividend>(`/api/portfolios/${portfolioId}/tax/dividends`, {
      method: "POST",
      body: payload,
      token,
    }),

  listTaxLots: (portfolioId: number, token: string) =>
    request<unknown[]>(`/api/portfolios/${portfolioId}/tax/lots`, {
      token,
    }),

  createSnapshot: (portfolioId: number, token: string, payload?: CreateSnapshotRequest) =>
    request<PortfolioSnapshot>(`/api/portfolios/${portfolioId}/snapshots`, {
      method: "POST",
      body: payload,
      token,
    }),

  listSnapshots: (portfolioId: number, token: string, range: QueryRange = {}) =>
    request<PortfolioSnapshot[]>(`/api/portfolios/${portfolioId}/snapshots`, {
      token,
      query: {
        from: range.from,
        to: range.to,
      },
    }),

  getPerformanceMetrics: (portfolioId: number, token: string, range: QueryRange = {}) =>
    request<PerformanceMetrics>(`/api/portfolios/${portfolioId}/performance`, {
      token,
      query: {
        from: range.from,
        to: range.to,
      },
    }),

  getBenchmarkComparison: (
    portfolioId: number,
    token: string,
    options: QueryRange & { benchmark?: string } = {},
  ) =>
    request<BenchmarkComparison>(`/api/portfolios/${portfolioId}/vs-benchmark`, {
      token,
      query: {
        benchmark: options.benchmark,
        from: options.from,
        to: options.to,
      },
    }),

  updatePortfolioPrices: (portfolioId: number, token: string) =>
    request<PriceUpdateResponse>(`/api/portfolios/${portfolioId}/prices/update`, {
      method: "POST",
      token,
    }),

  getMarketPrice: (
    symbol: string,
    token: string,
    type?: "crypto" | "stock" | "etf" | "index",
  ) =>
    request<PriceData>(`/api/market-data/price/${encodeURIComponent(symbol)}`, {
      token,
      query: { type },
    }),

  getMarketHistory: (symbol: string, token: string, range: QueryRange = {}) =>
    request<PriceHistory[]>(`/api/market-data/history/${encodeURIComponent(symbol)}`, {
      token,
      query: {
        from: range.from,
        to: range.to,
      },
    }),
};
