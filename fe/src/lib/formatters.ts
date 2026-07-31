/**
 * Format raw phone number string to human-readable Vietnamese format (e.g., 0812 86 86 22 or 0918 234 567)
 */
export function formatPhoneNumber(input: string): string {
  if (!input) return "";

  // Remove non-digit characters except leading +
  let cleaned = input.replace(/[^\d+]/g, "");

  // Convert +84 to 0
  if (cleaned.startsWith("+84")) {
    cleaned = "0" + cleaned.slice(3);
  }

  // Handle 10-digit standard VN phones (e.g., 0812 86 86 22 or 0918 234 567)
  const digits = cleaned.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

/**
 * Format currency number to Vietnamese Dong string (e.g., 1.059.000.000 đ)
 */
export function formatCurrencyVND(amount: number): string {
  if (isNaN(amount) || amount === 0) return "0 đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}
