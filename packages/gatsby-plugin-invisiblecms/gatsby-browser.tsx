/* eslint-disable */

import { CmsAdmin, CmsDisplay } from "@invisiblecms/react";
import React from "react";
import { getPlugin } from "./wrap-page";

declare const INVISIBLECMS_AUTH_PROVIDER_PATH: string

export const wrapPageElement = ({ element, props }, { endpoint, admin, ...restConfig }) => {
  if (admin) {

    const AuthProvider = getPlugin(require(INVISIBLECMS_AUTH_PROVIDER_PATH), INVISIBLECMS_AUTH_PROVIDER_PATH)
    const authProvider = new AuthProvider(restConfig)

    return (
      <CmsAdmin authProvider={authProvider} endpoint={endpoint}>
        {element}
      </CmsAdmin>
    )

  } else {
    return (
      <CmsDisplay data={props.pageContext}>
        {element}
      </CmsDisplay>
    )
  }
}
