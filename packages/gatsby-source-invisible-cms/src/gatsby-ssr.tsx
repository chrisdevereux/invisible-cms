import { CmsPage } from "@invisible-cms/react";
import React from "react";

export const wrapPageElement = ({ element, props }) => {
  const { content, resourceData, resourceUrl } = props.pageContext

  return (
    <CmsPage data={content} rootResourceUrl={resourceUrl} resourceData={resourceData}>
      {element}
    </CmsPage>
  )
}
