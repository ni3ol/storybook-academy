import { useState, useCallback, useEffect } from "react";

export const usePromiseLazy = <F, P>(
  f: (...args: P[]) => Promise<F>,
  deps: any[]
) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    result: F | undefined;
    error: Error | undefined;
  }>({
    isLoading: false,
    result: undefined,
    error: undefined,
  });

  const execute = useCallback(
    async (...args: P[]) => {
      setState({ isLoading: true, result: state.result, error: undefined });
      try {
        const theResult = await f(...args);
        setState({ isLoading: false, result: theResult, error: undefined });
        return { result: theResult, error: undefined };
      } catch (caughtError: any) {
        setState({ isLoading: false, result: undefined, error: caughtError });
        return { result: undefined, error: caughtError };
      }
    },
    [f, state.result, ...deps]
  );

  const setResult = (result: F | undefined) => {
    setState({ ...state, result });
  };

  return {
    result: state.result,
    error: state.error,
    isLoading: state.isLoading,
    setResult,
    execute,
  };
};

export const usePromise = <F, P>(
  f: (...args: P[]) => Promise<F>,
  deps: any[]
) => {
  const { execute, result, setResult, isLoading, error } = usePromiseLazy(
    f,
    deps
  );

  useEffect(() => {
    execute();
  }, [...deps]);

  return { execute, result, setResult, isLoading, error };
};
