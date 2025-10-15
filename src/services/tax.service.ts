import {
  TaxOverview,
  TaxMonthlyBreakdown,
  TaxProjections,
  TaxInsightsResponse,
  TaxComparisonResponse,
  DeclarationDetail,
  MarkSubmittedRequest,
  MarkSubmittedResponse,
  TaxChartData,
  FilingServiceRequest,
  FilingServiceRequestResponse,
  PaymentRequest,
  PaymentResponse,
  FilingStatusResponse,
} from "@/types/tax";
import { apiFetch } from "@/utils/api";

export class TaxService {
  /**
   * Get tax overview for a specific year
   */
  static async getOverview(year?: number): Promise<TaxOverview> {
    const params = new URLSearchParams();
    if (year !== undefined) params.append("year", String(year));

    const queryString = params.toString();
    const endpoint = `/tax-stats/overview${queryString ? `?${queryString}` : ""}`;

    const response = await apiFetch(endpoint);

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch tax overview";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get monthly tax breakdown for a specific year
   */
  static async getMonthlyBreakdown(year?: number): Promise<TaxMonthlyBreakdown> {
    const params = new URLSearchParams();
    if (year !== undefined) params.append("year", String(year));

    const queryString = params.toString();
    const endpoint = `/tax-stats/monthly${queryString ? `?${queryString}` : ""}`;

    const response = await apiFetch(endpoint);

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch monthly tax breakdown";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get tax projections for the year
   */
  static async getProjections(): Promise<TaxProjections> {
    const response = await apiFetch("/tax-stats/projections");

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch tax projections";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get tax insights and alerts
   */
  static async getInsights(): Promise<TaxInsightsResponse> {
    const response = await apiFetch("/tax-stats/insights");

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch tax insights";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get year-over-year comparison
   */
  static async getComparison(years: number[]): Promise<TaxComparisonResponse> {
    const params = new URLSearchParams();
    params.append("years", years.join(","));

    const response = await apiFetch(`/tax-stats/comparison?${params.toString()}`);

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch tax comparison";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get declaration details for a specific month
   */
  static async getDeclarationDetail(
    year: number,
    month: number
  ): Promise<DeclarationDetail> {
    const response = await apiFetch(`/tax-stats/declarations/${year}/${month}`);

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch declaration details";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Mark a declaration as submitted
   */
  static async markDeclarationSubmitted(
    year: number,
    month: number,
    data?: MarkSubmittedRequest
  ): Promise<MarkSubmittedResponse> {
    const response = await apiFetch(
      `/tax-stats/declarations/${year}/${month}/mark-submitted`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to mark declaration as submitted";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * Get chart data for visualizations
   */
  static async getChartData(
    chartType: "monthly_tax" | "cumulative_tax" | "threshold_progress",
    year?: number
  ): Promise<TaxChartData> {
    const params = new URLSearchParams();
    if (year !== undefined) params.append("year", String(year));

    const response = await apiFetch(
      `/tax-stats/charts/${chartType}${params.toString() ? `?${params.toString()}` : ""}`
    );

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch chart data";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Manually trigger auto-generation of declarations
   */
  static async autoGenerateDeclarations(year: number): Promise<void> {
    const response = await apiFetch(`/tax-stats/auto-generate/${year}`, {
      method: "POST",
    });

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to auto-generate declarations";
      throw new Error(errorMessage);
    }
  }

  /**
   * Format deadline date for display
   */
  static formatDeadline(deadline: string): string {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Calculate days until deadline
   */
  static getDaysUntilDeadline(deadline: string): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Format month from YYYY-MM to readable string
   */
  static formatMonth(monthString: string): string {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  /**
   * Get month number from YYYY-MM string
   */
  static getMonthNumber(monthString: string): number {
    return parseInt(monthString.split("-")[1]);
  }

  /**
   * Get year from YYYY-MM string
   */
  static getYear(monthString: string): number {
    return parseInt(monthString.split("-")[0]);
  }

  /**
   * Format percentage with one decimal
   */
  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Get current tax year
   */
  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * Get array of recent years for comparison
   */
  static getRecentYears(count: number = 3): number[] {
    const currentYear = this.getCurrentYear();
    return Array.from({ length: count }, (_, i) => currentYear - i);
  }

  /**
   * Request admin filing service for a declaration
   * User initiates payment flow (50 GEL)
   */
  static async requestFilingService(
    year: number,
    month: number
  ): Promise<FilingServiceRequestResponse> {
    const response = await apiFetch("/tax-stats/filing-service/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ year, month }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to request filing service";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * Complete mock payment for filing service
   * Changes status from awaiting_payment to payment_received
   */
  static async payForFilingService(
    year: number,
    month: number
  ): Promise<PaymentResponse> {
    const response = await apiFetch("/tax-stats/filing-service/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ year, month }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to process payment";
      throw new Error(errorMessage);
    }

    return responseData;
  }

  /**
   * Get filing service status for a declaration
   */
  static async getFilingServiceStatus(
    year: number,
    month: number
  ): Promise<FilingStatusResponse> {
    const response = await apiFetch(
      `/tax-stats/filing-service/status/${year}/${month}`
    );

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Failed to fetch filing service status";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Check if declaration is admin-managed
   */
  static isAdminManaged(status: string): boolean {
    return [
      "awaiting_payment",
      "payment_received",
      "in_progress",
      "filed_by_admin",
      "rejected",
    ].includes(status);
  }

  /**
   * Get filing service cost
   */
  static getFilingServiceCost(): number {
    return 50.0; // GEL
  }
}
