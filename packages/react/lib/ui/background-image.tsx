import React, { ImgHTMLAttributes, forwardRef, CSSProperties } from "react";

export interface BackgroundImageProps extends ImgHTMLAttributes<{}> {
  imageStyle?: CSSProperties
  imageClassName?: string
}

export const BackgroundImage = forwardRef(({ src, style, imageStyle, imageClassName, children, ...props }: BackgroundImageProps, ref) => {
  return (
    <div {...props} ref={ref as any} style={{ ...style, position: 'relative' }}>
      <img
        src={src}
        className={imageClassName}
        style={{ ...imageStyle, position: 'absolute', width: '100%', height: '100%' }}
      />
      {children}
    </div>
  )
})
