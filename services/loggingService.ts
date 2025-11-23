import { ErrorInfo } from "react";

/**
 * Logs errors to a centralized service.
 * In a production environment, this would send data to Sentry, LogRocket, or Firebase.
 */
export const logError = (error: Error, errorInfo?: ErrorInfo) => {
  // Simulate analytics/logging service
  console.group("🚨 Application Error Captured");
  console.error("Error Message:", error.message);
  console.error("Stack Trace:", error.stack);
  
  if (errorInfo) {
    console.error("Component Stack:", errorInfo.componentStack);
  }
  
  console.groupEnd();
  
  // Example: Future integration
  // Analytics.trackEvent('error', { message: error.message });
};
