import React from 'react'
import { storiesOf } from "@storybook/react";
import { Editable, Content } from "./content-editable";

storiesOf('invisible-cms/ContentEditable', module)
  .add('standard', () => (
    <Editable id="foo" initialValue="1234">
      <Content style={{ background: 'grey', height: 200 }} />
    </Editable>
  ))