import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme, type ThemeProviderProps } from "next-themes";

/** Keeps the browser bar colour (the single <meta name="theme-color"> in index.html) in step with the site's own theme toggle. */
function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolvedTheme === "dark" ? "#0A0A0A" : "#FAFAFA");
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeColorSync />
      {children}
    </NextThemesProvider>
  );
}
