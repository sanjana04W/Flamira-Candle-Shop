import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SRI_LANKA_DISTRICTS } from '@/data/initialData';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-US')}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return `${d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return dateString;
  }
}

export function getDeliveryRate(districtName: string, subtotal: number): { rate: number; estimatedDays: string; isFree: boolean } {
  // Free delivery threshold: Rs. 3,500
  if (subtotal >= 3500) {
    const found = SRI_LANKA_DISTRICTS.find(
      (d) => d.district.toLowerCase() === districtName.toLowerCase()
    );
    return {
      rate: 0,
      estimatedDays: found?.estimatedDays || '2–4 Days',
      isFree: true,
    };
  }

  const found = SRI_LANKA_DISTRICTS.find(
    (d) => d.district.toLowerCase() === districtName.toLowerCase()
  );

  return {
    rate: found?.rate || 450,
    estimatedDays: found?.estimatedDays || '2–4 Days',
    isFree: false,
  };
}

export function getNextOrderNumber(currentOrders: { orderNumber: string }[]): string {
  let maxSeq = 17;
  for (const o of currentOrders) {
    const match = o.orderNumber.match(/FLM-(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) {
        maxSeq = num;
      }
    }
  }
  const nextNum = maxSeq + 1;
  return `FLM-${String(nextNum).padStart(5, '0')}`;
}
