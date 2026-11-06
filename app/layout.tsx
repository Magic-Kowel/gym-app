import StoreProvider from "../app/store/StoreProvider"
import ConditionalLayout from "./components/ConditionalLayout";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* 2. Envuelve {children} con Providers */}
        <StoreProvider>
          
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </StoreProvider>
      </body>
    </html>
  );
}