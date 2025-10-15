// Georgian Tax Statistics Types
// For მცირე ბიზნესის სტატუსი (Small Business Status)
// 1% tax rate, 500,000 GEL annual threshold

export type TaxStatus = "on_track" | "approaching_limit" | "near_limit" | "exceeded";

export type DeclarationStatus = "pending" | "submitted" | "overdue";

export type InsightType =
  | "declaration_reminder"
  | "threshold_warning"
  | "income_spike"
  | "income_drop"
  | "optimization_tip"
  | "compliance_alert";

export type InsightSeverity = "critical" | "high" | "medium" | "info";

export interface TaxOverview {
  year: number;
  total_income_ytd_gel: number;
  tax_liability_ytd_gel: number;
  threshold_remaining_gel: number;
  threshold_percentage_used: number;
  status: TaxStatus;
  months_declared: number;
  months_pending: number;
  last_declaration_date: string | null;
  next_declaration_due: string | null;
}

export interface MonthlyTaxData {
  month: string; // YYYY-MM format
  income_gel: number;
  tax_due_gel: number;
  declaration_status: DeclarationStatus;
  filing_deadline: string; // ISO datetime
  submitted_date: string | null; // ISO datetime
  days_until_deadline: number | null;
  transaction_count: number;
}

export interface TaxMonthlyBreakdown {
  year: number;
  months: MonthlyTaxData[];
  total_income_gel: number;
  total_tax_gel: number;
  avg_monthly_income_gel: number;
  avg_monthly_tax_gel: number;
}

export interface TaxThresholdStatus {
  will_exceed_threshold: boolean;
  threshold_gel: number;
  projected_remaining_gel: number;
  risk_level: "low" | "medium" | "high";
  confidence: number; // 0-1
}

export interface TaxProjections {
  based_on_months: number;
  current_income_gel: number;
  current_tax_gel: number;
  projected_annual_income_gel: number;
  projected_annual_tax_gel: number;
  threshold_status: TaxThresholdStatus;
  monthly_avg_needed_for_threshold: number;
  recommendation: string;
}

export interface TaxInsight {
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  action_required: boolean;
  created_at: string;
}

export interface TaxInsightsResponse {
  insights: TaxInsight[];
  total_insights: number;
  high_priority_count: number;
}

export interface YearComparison {
  year: number;
  total_income_gel: number;
  total_tax_gel: number;
  avg_monthly_income_gel: number;
  months_with_income: number;
  growth_vs_previous: number | null; // percentage
}

export interface TaxComparisonResponse {
  years: YearComparison[];
  total_tax_paid_all_years: number;
}

export interface DeclarationDetail {
  year: number;
  month: number;
  month_name: string;
  income_gel: number;
  tax_due_gel: number;
  transaction_count: number;
  declaration_status: DeclarationStatus;
  filing_deadline: string;
  submitted_date: string | null;
  days_until_deadline: number | null;
  is_overdue: boolean;
}

export interface MarkSubmittedRequest {
  submitted_date?: string; // ISO datetime, optional
}

export interface MarkSubmittedResponse {
  success: boolean;
  message: string;
  declaration: DeclarationDetail;
}

export interface TaxChartDataPoint {
  date: string; // YYYY-MM format for monthly
  income?: number;
  tax?: number;
  cumulative_income?: number;
  cumulative_tax?: number;
  threshold_percentage?: number;
}

export interface TaxChartData {
  chart_type: "monthly_tax" | "cumulative_tax" | "threshold_progress";
  data: TaxChartDataPoint[];
  total_income: number;
  total_tax: number;
}

// Constants for Georgian tax system
export const GEORGIAN_TAX_CONSTANTS = {
  taxRate: 0.01, // 1%
  annualThreshold: 500000, // GEL
  declarationDay: 15, // 15th of next month
  taxSystemName: "მცირე ბიზნესის სტატუსი",
  taxSystemNameEn: "Small Business Status",
} as const;

// Helper functions
export function getTaxStatusColor(status: TaxStatus): string {
  switch (status) {
    case "on_track":
      return "#10b981"; // green-600
    case "approaching_limit":
      return "#f59e0b"; // amber-500
    case "near_limit":
      return "#f97316"; // orange-500
    case "exceeded":
      return "#ef4444"; // red-500
  }
}

export function getTaxStatusLabel(status: TaxStatus): string {
  switch (status) {
    case "on_track":
      return "On Track";
    case "approaching_limit":
      return "Approaching Limit";
    case "near_limit":
      return "Near Limit";
    case "exceeded":
      return "Threshold Exceeded";
  }
}

export function getDeclarationStatusColor(status: DeclarationStatus): string {
  switch (status) {
    case "pending":
      return "#f59e0b"; // amber-500
    case "submitted":
      return "#10b981"; // green-600
    case "overdue":
      return "#ef4444"; // red-500
  }
}

export function getDeclarationStatusLabel(status: DeclarationStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "submitted":
      return "Submitted";
    case "overdue":
      return "Overdue";
  }
}

export function getInsightSeverityColor(severity: InsightSeverity): string {
  switch (severity) {
    case "critical":
      return "#dc2626"; // red-600
    case "high":
      return "#f97316"; // orange-500
    case "medium":
      return "#f59e0b"; // amber-500
    case "info":
      return "#3b82f6"; // blue-500
  }
}

export function formatTaxAmount(amount: number): string {
  return `₾${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateTax(income: number): number {
  return income * GEORGIAN_TAX_CONSTANTS.taxRate;
}

export function formatMonthName(monthString: string): string {
  // Convert YYYY-MM to readable format
  const [year, month] = monthString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function isDeadlineSoon(daysUntilDeadline: number | null): boolean {
  if (daysUntilDeadline === null) return false;
  return daysUntilDeadline <= 7;
}

export function isDeadlineUrgent(daysUntilDeadline: number | null): boolean {
  if (daysUntilDeadline === null) return false;
  return daysUntilDeadline <= 3;
}
