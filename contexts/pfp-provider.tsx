import { ReactElement, useState } from "react";

import { PfpContext } from "./pfp-context";

export function PfpProvider({ children }: { children: ReactElement }) {
  const [pfps, setPfps] = useState<Record<string, string>>({});

  return (
    <PfpContext.Provider
      value={{
        pfps,
        setPfps,
      }}
    >
      {children}
    </PfpContext.Provider>
  );
}
