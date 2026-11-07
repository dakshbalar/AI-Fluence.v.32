/**
 * Utility to generate and persist unique AI Fluence user codes
 */
export function getOrCreateUserCode(): string {
  try {
    const existing = localStorage.getItem("aifluence_user_code");
    if (existing) return existing;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `AIF-${randomNum}`;
    localStorage.setItem("aifluence_user_code", code);
    return code;
  } catch (e) {
    return "AIF-7788";
  }
}
