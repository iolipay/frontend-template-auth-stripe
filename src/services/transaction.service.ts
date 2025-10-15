import {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
  TransactionListResponse,
  TransactionListFilters,
  TransactionStatistics,
  TransactionStatisticsFilters,
  ExchangeRateResponse,
} from "@/types/transaction";
import { apiFetch } from "@/utils/api";

export class TransactionService {
  /**
   * Create a new transaction
   */
  static async createTransaction(
    data: TransactionCreate
  ): Promise<Transaction> {
    const response = await apiFetch("/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to create transaction";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * List income transactions with optional filters
   */
  static async listTransactions(
    filters: TransactionListFilters = {}
  ): Promise<TransactionListResponse> {
    const params = new URLSearchParams();

    if (filters.skip !== undefined) params.append("skip", String(filters.skip));
    if (filters.limit !== undefined)
      params.append("limit", String(filters.limit));
    if (filters.currency) params.append("currency", filters.currency);
    if (filters.category) params.append("category", filters.category);
    if (filters.date_from) params.append("date_from", filters.date_from);
    if (filters.date_to) params.append("date_to", filters.date_to);

    const queryString = params.toString();
    const endpoint = `/transactions/${queryString ? `?${queryString}` : ""}`;

    const response = await apiFetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch income transactions");
    }

    return response.json();
  }

  /**
   * Get a single transaction by ID
   */
  static async getTransaction(id: string): Promise<Transaction> {
    const response = await apiFetch(`/transactions/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Transaction not found");
      }
      throw new Error("Failed to fetch transaction");
    }

    return response.json();
  }

  /**
   * Update a transaction
   */
  static async updateTransaction(
    id: string,
    data: TransactionUpdate
  ): Promise<Transaction> {
    const response = await apiFetch(`/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : Array.isArray(responseData.detail)
          ? responseData.detail[0]?.msg
          : "Failed to update transaction";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * Delete a transaction
   */
  static async deleteTransaction(id: string): Promise<void> {
    const response = await apiFetch(`/transactions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to delete transaction";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get transaction statistics
   */
  static async getStatistics(
    filters: TransactionStatisticsFilters = {}
  ): Promise<TransactionStatistics> {
    const params = new URLSearchParams();

    if (filters.date_from) params.append("date_from", filters.date_from);
    if (filters.date_to) params.append("date_to", filters.date_to);

    const queryString = params.toString();
    const endpoint = `/transactions/stats${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiFetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch transaction statistics");
    }

    return response.json();
  }

  /**
   * Get available currencies
   */
  static async getAvailableCurrencies(
    targetDate?: string
  ): Promise<string[]> {
    const params = new URLSearchParams();
    if (targetDate) params.append("target_date", targetDate);

    const queryString = params.toString();
    const endpoint = `/transactions/currencies/available${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiFetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch available currencies");
    }

    return response.json();
  }

  /**
   * Get exchange rate for a specific currency
   */
  static async getExchangeRate(
    currency: string,
    targetDate?: string
  ): Promise<ExchangeRateResponse> {
    const params = new URLSearchParams({ currency });
    if (targetDate) params.append("target_date", targetDate);

    const response = await apiFetch(
      `/transactions/currencies/rate?${params.toString()}`
    );

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch exchange rate";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Format amount in GEL with currency symbol
   */
  static formatGEL(amount: number): string {
    return `₾${amount.toFixed(2)}`;
  }

  /**
   * Format amount with currency code
   */
  static formatAmount(amount: number, currency: string): string {
    return `${amount.toFixed(2)} ${currency}`;
  }

  /**
   * Format date for API (YYYY-MM-DD)
   */
  static formatDateForAPI(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  /**
   * Format date for display
   */
  static formatDateForDisplay(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
