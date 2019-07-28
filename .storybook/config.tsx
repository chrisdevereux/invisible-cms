import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import { ProvideContent } from '../packages/react'
import { StateContainer } from '../packages/react/lib/util';

const req = require.context('../packages', true, /\.stories\.tsx$/);

addDecorator(children => (
  <StateContainer initial={{}}>
    {state => (
      <ProvideContent editable {...state}>
        {children()}
      </ProvideContent>
    )}
  </StateContainer>
))

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
