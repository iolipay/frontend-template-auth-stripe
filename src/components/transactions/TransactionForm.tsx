"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import {
  TransactionCreate,
  TransactionCategory,
  getAllCategories,
  getCategoryLabel,
  sortCurrencies,
} from "@/types/transaction";
import { TransactionService } from "@/services/transaction.service";

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("GEL");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState<TransactionCategory>("salary");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // Load available currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const availableCurrencies =
          await TransactionService.getAvailableCurrencies();
        // Sort with GEL, USD, EUR at top
        const sorted = sortCurrencies(availableCurrencies);
        setCurrencies(sorted);
      } catch (err) {
        console.error("Failed to load currencies:", err);
        // Fallback to priority currencies
        setCurrencies(["GEL", "USD", "EUR", "GBP", "RUB", "TRY"]);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadCurrencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(transactionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setError("Income date cannot be in the future");
      return;
    }

    try {
      setLoading(true);

      const transactionData: TransactionCreate = {
        amount: amountNum,
        currency,
        transaction_date: new Date(transactionDate).toISOString(),
        category,
        description: description.trim() || undefined,
      };

      await TransactionService.createTransaction(transactionData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create income transaction");
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = getAllCategories();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      {/* Amount and Currency Row */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="amount"
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          placeholder="0.00"
        />

        <div className="space-y-2">
          <label
            htmlFor="currency"
            className="block text-sm font-medium uppercase tracking-wide text-black"
          >
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={loadingCurrencies}
            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-[1px] transition-all duration-200 focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
            required
          >
            {loadingCurrencies ? (
              <option>Loading...</option>
            ) : (
              currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Date */}
      <Input
        id="transaction_date"
        label="Income Date"
        type="date"
        value={transactionDate}
        onChange={(e) => setTransactionDate(e.target.value)}
        required
      />

      {/* Category */}
      <div className="space-y-2">
        <label
          htmlFor="category"
          className="block text-sm font-medium uppercase tracking-wide text-black"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TransactionCategory)}
          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-[1px] transition-all duration-200 focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
          required
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryLabel(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium uppercase tracking-wide text-black"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this income..."
          rows={3}
          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-[1px] transition-all duration-200 focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} variant="primary" fullWidth>
          {loading ? "Creating..." : "Add Income"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={loading}
          variant="secondary"
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
