import { useQueryClient } from "react-query";

const useQueryCache = <T extends { id: string }>(key: string, id?: string) => {
  const GET_QUERY_KEY = [key, "get"];
  const GET_DETAIL_QUERY_KEY = [key, "detail", id];
  const CREATE_MUTATION_KEY = [key, "create", id];
  const UPDATE_MUTATION_KEY = [key, "update", id];

  const queryClient = useQueryClient();

  const updateCache = (updated: T) => {
    queryClient.setQueryData<Array<T>>(GET_QUERY_KEY, (prev) => {
      return (prev ?? []).map((data) => {
        if (updated.id === data.id) {
          return updated;
        }

        return data;
      });
    });
  };

  const createCache = (created: T) => {
    queryClient.setQueryData<Array<T>>(GET_QUERY_KEY, (prev) => {
      return [created, ...(prev ?? [])];
    });
  };

  const deleteCache = (deleted: T) => {
    queryClient.setQueryData<Array<T>>(GET_QUERY_KEY, (prev) => {
      return (prev ?? []).filter((data) => data.id !== deleted.id);
    });
  };

  return {
    createCache,
    updateCache,
    deleteCache,
    GET_QUERY_KEY,
    GET_DETAIL_QUERY_KEY,
    CREATE_MUTATION_KEY,
    UPDATE_MUTATION_KEY,
  };
};

export default useQueryCache;
