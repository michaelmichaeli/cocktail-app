import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storage } from "../lib/storage";

interface DeleteCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export function useCustomCocktails() {
  const queryClient = useQueryClient();

  const { data: customCocktails = [], isLoading } = useQuery({
    queryKey: ["customCocktails"],
    queryFn: storage.getCustomCocktails,
    staleTime: 0
  });

  const deleteMutation = useMutation<void, Error, { id: string; } & DeleteCallbacks>({
    mutationFn: ({ id }) => storage.deleteCustomCocktail(id),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['customCocktails'] });
      variables.onSuccess?.();
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSettled: (_, error, variables) => {
      variables.onSettled?.();
    }
  });

  const cocktails = customCocktails.map(c => ({ ...c, isCustom: true }));

  return {
    cocktails,
    isLoading,
    deleteCustomCocktail: (id: string, callbacks?: DeleteCallbacks) => 
      deleteMutation.mutate({ id, ...callbacks }),
    isDeletingCocktail: deleteMutation.isPending
  };
}
