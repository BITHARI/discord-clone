import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import queryString from "query-string";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: string;
    paramValue: string;
}

export function useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}: ChatQueryProps) {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam }: { pageParam: string | undefined }) => {
        const url = queryString.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue
            }
        });
        const res = await fetch(url);
        return res.json();
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: undefined as string | undefined
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    };
}