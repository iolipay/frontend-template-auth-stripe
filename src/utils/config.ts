// Centralized configuration for the application
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://seeky.online",
  },

  // Authentication Configuration
  auth: {
    // Cookie settings
    cookies: {
      // Token cookie expires in 1 day (86400 seconds)
      tokenMaxAge: 86400,
      // Refresh token expires in 30 days (2592000 seconds)
      refreshTokenMaxAge: 2592000,
      // Security options based on environment
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    },
    // Token refresh buffer (30 seconds before actual expiration)
    tokenRefreshBuffer: 30 * 1000, // 30 seconds in milliseconds
  },

  // Environment
  environment: {
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
  },

  // URLs for redirects
  urls: {
    loginRedirect: "/auth/login",
    successRedirect: "/success",
    cancelRedirect: "/cancel",
  },
} as const;

// Helper function to get cookie options string
export const getCookieOptions = (maxAge?: number): string => {
  const { secure, sameSite, path } = config.auth.cookies;
  const maxAgeStr = maxAge ? `max-age=${maxAge}; ` : "";
  const secureStr = secure ? "secure; " : "";

  return `${maxAgeStr}path=${path}; ${secureStr}samesite=${sameSite}`;
};

// Helper function to clear a cookie
export const getClearCookieOptions = (): string => {
  return `path=${config.auth.cookies.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
