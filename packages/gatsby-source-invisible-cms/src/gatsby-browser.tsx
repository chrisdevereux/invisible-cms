/* eslint-disable */

import { CmsPage, CmsAdminPage, CmsAdminApp } from "@invisible-cms/react";
import React from "react";
import { getPlugin } from "./wrap-page";
import { GatsbyAppConfig } from "./interfaces";

declare const INVISIBLE_CMS_AUTH_PROVIDER_PATH: string

export const wrapRootElement = ({ element }, options: GatsbyAppConfig) => {
  if (!process.env.REACT_APP_CMS_NOADMIN) {
    const AuthProvider = getPlugin(require(INVISIBLE_CMS_AUTH_PROVIDER_PATH), INVISIBLE_CMS_AUTH_PROVIDER_PATH)
    const authProvider = new AuthProvider(options)

    return (
      <CmsAdminApp authProvider={authProvider} endpoint={options.endpoint}>
        {element}
      </CmsAdminApp>
    )

  } else {
    return element
  }
}

export const wrapPageElement = ({ element, props }) => {
  const { content, pageId, resourceData, resourceUrl } = props.pageContext

  if (!process.env.REACT_APP_CMS_NOADMIN) {
    return (
      <CmsAdminPage rootResourceUrl={resourceUrl} pageId={pageId} resourceData={resourceData}>
        {element}
      </CmsAdminPage>
    )

  } else {
    return (
      <CmsPage rootResourceUrl={resourceUrl} data={content} resourceData={resourceData}>
        {element}
      </CmsPage>
    )
  }
}
