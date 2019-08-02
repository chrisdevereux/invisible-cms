import { useContent } from "../content";
import React, { HTMLAttributes, createElement, ComponentType, CSSProperties } from "react";
import { ImageEditor } from "../editor/image-editor";
import { BackgroundImage, BackgroundImageProps } from "../ui/background-image";

interface DisplayImageProps extends BackgroundImageProps {
  renderer?: ComponentType<BackgroundImageProps>
}

export const DisplayImage = ({ renderer: Renderer = BackgroundImage, ...imageProps }: DisplayImageProps) => {
  const content = useContent<{ url: string }>()

  if (!content.editable) {
    return (
      <Renderer
        {...imageProps}
        src={content.value && content.value.url}
      />
    )
  }

  return (
    <ImageEditor renderer={Renderer} {...imageProps} />
  )
}
