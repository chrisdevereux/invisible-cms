import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "../util";
import { ContentType } from "../content";
import { ContentTypePicker } from "./content-type-picker";

storiesOf('react/ContentTypePicker', module)
  .add('default', withState(undefined, state => (
    <ContentTypePicker
      {...state}
      availableTypes={[
        ContentType.tagged({ tag: 'Option 1' }),
        ContentType.tagged({ tag: 'Option 2' }),
      ]}
    />
  )))
