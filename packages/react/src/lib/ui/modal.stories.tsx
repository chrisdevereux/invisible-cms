import { storiesOf } from "@storybook/react";
import { FieldModal, fixedOpenModal } from "./modal";
import React from "react";
import { noop } from "../util";

storiesOf('react/ui/modal', module)
  .add('FieldModal', () => (
    <FieldModal prompt="Hello there" value="Foo" onChange={noop} state={fixedOpenModal} />
  ))