import { useState } from "react";

export const useFormattedAmount = (max = Infinity) => {
  const [amountRaw, setAmountRaw] = useState("");
  const [amount, setAmount] = useState(0);

  const formatNumber = (num) => Number(num).toLocaleString("vi-VN");
  const unformatNumber = (str) => str.replace(/\D/g, "");

  const handleAmountChange = (e) => {
    let input = e.target.value;
    let numeric = unformatNumber(input);

    if (!/^\d*$/.test(numeric)) return;

    let value = parseInt(numeric || "0", 10);
    if (value > max) value = max;

    setAmountRaw(formatNumber(value));
    setAmount(value);
  };

  return { amount, amountRaw, handleAmountChange };
};