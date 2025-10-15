// Georgian Tax Statistics Types
// For მცირე ბიზნესის სტატუსი (Small Business Status)
// 1% tax rate, 500,000 GEL annual threshold

export type TaxStatus = "on_track" | "approaching_limit" | "near_limit" | "exceeded";

export type DeclarationStatus =
  | "pending"
  | "submitted"
  | "overdue"
  | "awaiting_payment"
  | "payment_received"
  | "in_progress"
  | "filed_by_admin"
  | "rejected";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type FilingMethod = "self_service" | "admin_filed";

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
  // Payment fields
  payment_status: PaymentStatus;
  payment_amount: number;
  payment_date: string | null;
  mock_payment_id: string | null;
  // Admin filing fields
  filing_method: FilingMethod;
  filed_by_admin_id: string | null;
  filed_by_admin_at: string | null;
  admin_notes: string;
  requires_correction: boolean;
  correction_notes: string;
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

// Admin Filing Service Types
export interface FilingServiceRequest {
  year: number;
  month: number;
}

export interface FilingServiceRequestResponse {
  declaration_id: string;
  payment_id: string;
  amount: number; // Kept for backward compatibility
  income_gel: number;
  tax_amount: number; // 1% tax
  service_fee: number; // 2% service fee
  total_amount: number; // 3% total
  status: string;
  message: string;
}

export interface PaymentRequest {
  year: number;
  month: number;
}

export interface PaymentResponse {
  declaration_id: string;
  payment_id: string;
  amount: number; // Kept for backward compatibility
  income_gel: number;
  tax_amount: number; // 1% tax
  service_fee: number; // 2% service fee
  total_amount: number; // 3% total
  status: string;
  paid_at: string;
  message: string;
}

export interface FilingStatusResponse {
  year: number;
  month: number;
  status: DeclarationStatus;
  payment_status: PaymentStatus;
  payment_amount: number;
  income_gel?: number;
  tax_amount?: number;
  service_fee?: number;
  payment_date: string | null;
  filing_method: FilingMethod;
  filed_by_admin_at: string | null;
  requires_correction: boolean;
  correction_notes: string;
  admin_notes: string;
}

export interface FeeStructure {
  tax_rate: number; // 0.01 (1%)
  service_fee_rate: number; // 0.02 (2%)
  total_rate: number; // 0.03 (3%)
  description: string;
}

export interface AdminDeclarationItem {
  id: string;
  user_id: string;
  user_email: string;
  year: number;
  month: number;
  income_gel: number;
  tax_due_gel: number;
  status: DeclarationStatus;
  filing_deadline: string;
  payment_status: PaymentStatus;
  payment_amount: number;
  payment_date: string | null;
  submitted_date: string | null;
  requires_correction: boolean;
  transaction_count: number;
}

export interface AdminDeclarationQueueResponse {
  pending_payment: AdminDeclarationItem[];
  ready_to_file: AdminDeclarationItem[];
  in_progress: AdminDeclarationItem[];
  needs_correction: AdminDeclarationItem[];
  total_count: number;
}

export interface StartFilingRequest {
  declaration_id: string;
}

export interface CompleteFilingRequest {
  confirmation_number?: string;
  admin_notes?: string;
}

export interface RejectFilingRequest {
  correction_notes: string;
  admin_notes?: string;
}

export interface AdminActionResponse {
  message: string;
}

// Constants for Georgian tax system
export const GEORGIAN_TAX_CONSTANTS = {
  taxRate: 0.01, // 1%
  serviceFeeRate: 0.02, // 2% filing service fee
  totalFilingRate: 0.03, // 3% total (1% tax + 2% service)
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
    case "awaiting_payment":
      return "#3b82f6"; // blue-500
    case "payment_received":
      return "#8b5cf6"; // violet-500
    case "in_progress":
      return "#06b6d4"; // cyan-500
    case "filed_by_admin":
      return "#10b981"; // green-600
    case "rejected":
      return "#dc2626"; // red-600
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
    case "awaiting_payment":
      return "Awaiting Payment";
    case "payment_received":
      return "Payment Received";
    case "in_progress":
      return "In Progress";
    case "filed_by_admin":
      return "Filed by Admin";
    case "rejected":
      return "Rejected";
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
