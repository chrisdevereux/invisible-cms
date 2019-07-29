import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import { ProvideContent, Client } from '../packages/react'
import { StateContainer } from '../packages/react/lib/util';
import { ConfigContext } from '../packages/react/lib/config';
import { delay } from 'q';

const req = require.context('../packages', true, /\.stories\.tsx$/);

const fakeConfig = {
  editable: true,
  client: ({
    putFile: async (image: Blob) => {
      const url = URL.createObjectURL(image)
      console.log('put image', url)

      await delay(1000)
      return { url }
    }
  }) as any
}

addDecorator(children => (
  <ConfigContext.Provider value={fakeConfig}>
    <StateContainer initial={{}}>
      {state => (
        <ProvideContent editable {...state}>
          {children()}
        </ProvideContent>
      )}
    </StateContainer>
  </ConfigContext.Provider>
))

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
