import { useMutation } from '@tanstack/react-query'

const useMutationWrapper = ({ func, options = {} }) => {

  const mutation = useMutation(
    {
      mutationFn: async (data) => {
        return await func(data)
      },
      onMutate: async (variables) => {
        if (options?.onMutate) options.onMutate(variables)
      },
      onError: async (error, variables, context) => {
        if (options?.onError) options.onError(error)
      },
      onSuccess: async (data, variables, context) => {
        if (options?.onSuccess) options.onSuccess(data)
      },
      onSettled: (data, error, variables, context) => {
        if (options?.onSettled) options.onSettled(data, error)
      },
    }
  )

  return mutation

}

export default useMutationWrapper