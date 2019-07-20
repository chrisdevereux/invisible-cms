import { CmsDisplay } from "@invisible-cms/react";
import React from "react";

export const wrapPageElement = ({ element, props }) => {
  return (
    <CmsDisplay data={props.pageContext}>
      {element}
    </CmsDisplay>
  )
}
