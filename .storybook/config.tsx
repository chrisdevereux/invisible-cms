import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import { ContentItemContext } from '../packages/react/content-item'

const req = require.context('../packages', true, /\.stories\.tsx$/);

addDecorator(children =>
  <ContentItemContext.Provider value={new Map()}>
    {children()}
  </ContentItemContext.Provider>
)

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
