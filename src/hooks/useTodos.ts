import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { TodosResponse } from '@/types/todo';

interface UseTodosParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: number;
}

export function useTodos({
  page = 1,
  limit = 10,
  search = '',
  status,
  priority,
}: UseTodosParams = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);
  if (priority !== undefined) queryParams.append('priority', priority.toString());

  const { data, error, mutate } = useSWR<TodosResponse>(
    `/api/todos?${queryParams.toString()}`,
    fetcher
  );

  return {
    todos: data?.todos ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
