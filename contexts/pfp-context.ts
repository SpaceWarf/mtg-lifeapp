import { createContext } from "react";

type PfpContextType = {
  pfps: Record<string, string>;
  setPfps: (pfps: Record<string, string>) => void;
};

export const PfpContext = createContext<PfpContextType>({
  pfps: {},
  setPfps: () => {},
});
