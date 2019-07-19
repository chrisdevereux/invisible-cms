/* eslint-disable */

import { CmsDisplay } from "@invisiblecms/react";
import React from "react";

export const wrapPageElement = ({ element, props }) => {
  return (
    <CmsDisplay data={props.pageContext}>
      {element}
    </CmsDisplay>
  )
}
