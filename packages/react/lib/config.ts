import { createContext } from "react";

export interface Config {
  editable: boolean
}

export const ConfigContext = createContext<Config>({ editable: false })