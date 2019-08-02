import { CmsPage } from "@invisible-cms/react";
import React from "react";

export const wrapPageElement = ({ element, props }) => {
  return (
    <CmsPage data={props.pageContext}>
      {element}
    </CmsPage>
  )
}
