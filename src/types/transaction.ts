// Transaction types based on backend API
// Note: Backend only tracks income, not expenses

export type IncomeCategoryType =
  | "salary"
  | "freelance"
  | "business"
  | "investment"
  | "rental_income"
  | "dividends"
  | "bonus"
  | "commission"
  | "other";

export type TransactionCategory = IncomeCategoryType;

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  amount_gel: number;
  exchange_rate: number;
  conversion_date: string;
  transaction_date: string;
  category: TransactionCategory;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  amount: number;
  currency: string;
  transaction_date: string;
  category: TransactionCategory;
  description?: string;
}

export interface TransactionUpdate {
  amount?: number;
  currency?: string;
  transaction_date?: string;
  category?: TransactionCategory;
  description?: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  skip: number;
  limit: number;
}

export interface TransactionListFilters {
  skip?: number;
  limit?: number;
  currency?: string;
  category?: TransactionCategory;
  date_from?: string; // YYYY-MM-DD format
  date_to?: string; // YYYY-MM-DD format
}

export interface TransactionStatistics {
  total_income_gel: number;
  transaction_count: number;
  currencies_used: string[];
  by_category: Record<string, number>;
}

export interface TransactionStatisticsFilters {
  date_from?: string;
  date_to?: string;
}

export interface ExchangeRateResponse {
  currency: string;
  rate: number;
  date: string;
}

// Category labels for display
export const INCOME_CATEGORIES: Record<IncomeCategoryType, string> = {
  salary: "Salary/Wage",
  freelance: "Freelance Work",
  business: "Business Income",
  investment: "Investment Returns",
  rental_income: "Rental Income",
  dividends: "Dividends",
  bonus: "Bonus/Rewards",
  commission: "Commission",
  other: "Other Income",
};

// Helper function to get category label
export function getCategoryLabel(category: TransactionCategory): string {
  return INCOME_CATEGORIES[category] || category;
}

// Helper function to get all categories
export function getAllCategories(): TransactionCategory[] {
  return Object.keys(INCOME_CATEGORIES) as IncomeCategoryType[];
}

// Priority currencies to show at top
export const PRIORITY_CURRENCIES = ["GEL", "USD", "EUR"];

// Helper to sort currencies with priority ones first
export function sortCurrencies(currencies: string[]): string[] {
  const priority = currencies.filter((c) => PRIORITY_CURRENCIES.includes(c));
  const others = currencies.filter((c) => !PRIORITY_CURRENCIES.includes(c)).sort();
  return [...priority, ...others];
}
