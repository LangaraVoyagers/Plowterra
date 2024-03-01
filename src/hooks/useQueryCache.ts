import { useQueryClient } from "react-query";

const useQueryCache = <T extends { _id: string }>(
  key: string,
  _id?: string
) => {
  const GET_QUERY_KEY = [key, "get"];
  const GET_DETAIL_QUERY_KEY = [key, "detail", _id];
  const CREATE_MUTATION_KEY = [key, "create", _id];
  const UPDATE_MUTATION_KEY = [key, "update", _id];

  const queryClient = useQueryClient();

  const updateCache = (updated: T) => {
    queryClient.setQueryData<Array<T>>(GET_QUERY_KEY, (prev) => {
      return (prev ?? []).map((data) => {
        if (updated._id === data._id) {
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
      return (prev ?? []).filter((data) => data._id !== deleted._id);
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
