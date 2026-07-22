'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }) {
    // useState ensures the client is created only once per session
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </TooltipProvider>
        </QueryClientProvider>
    );
}