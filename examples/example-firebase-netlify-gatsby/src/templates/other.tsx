import { DisplayRichText, ContentItem, DisplayImage } from '@invisible-cms/react'
import React, { CSSProperties, ReactNode } from 'react';
import { Link } from 'gatsby';

interface BoxProps extends CSSProperties {
  children?: ReactNode
}

const Other = () => (
  <>
    <Link to="/">home</Link>
  </>
)

export default Other
