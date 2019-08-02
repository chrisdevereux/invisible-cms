import { createContext, useContext } from "react";
import { Client } from "./client";

export interface Config {
  editable: boolean
  client?: Client
}

export const useClient = () => {
  const { client } = useContext(ConfigContext)
  if (!client) {
    throw Error('remote endpoint not defined')
  }

  return client
}

export const ConfigContext = createContext<Config>({ editable: false })