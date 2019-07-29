import { storiesOf } from "@storybook/react";
import { DisplayImage } from "./display-image";
import React from "react";
import { ProvideContent } from "../content";
import { noop, withState } from "../util";

storiesOf('react/display/DisplayImage', module)
  .add('no image', () => (
    <DisplayImage style={{ width: 200, height: 200 }} imageStyle={{ objectFit: 'cover' }} />
  ))
  .add('image', withState({ url: "http://placekitten.com/g/800/600" }, props => (
    <ProvideContent editable {...props}>
      <DisplayImage style={{ width: 200, height: 200 }} imageStyle={{ objectFit: 'cover' }} />
    </ProvideContent>
  )))
