import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "../util";
import { TextRibbon } from "./text-ribbon";

storiesOf('react/ui/TextRibbon', module)
  .add('default', withState({}, state => (
    <TextRibbon {...state} />
  )))
