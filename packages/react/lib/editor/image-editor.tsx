import { useDropzone } from 'react-dropzone'
import { useContent } from '../content';
import { useClient } from '../config';
import { ReactNode, ComponentType } from 'react';
import React from 'react';
import { BackgroundImageProps } from '../ui/background-image';
import { CenterOverParent, EditUiButton, ShowOnMouseover, EditUiControls } from '../ui/atoms';
import { ImageUploadIcon } from '../ui/icons';

interface ImageEditorProps extends BackgroundImageProps {
  children?: ReactNode
  renderer: ComponentType<BackgroundImageProps>
}

export const ImageEditor = ({ renderer: Renderer, children, ...wrapperProps }: ImageEditorProps) => {
  const content = useContent<{ url: string }>()
  const client = useClient()

  const onDrop = async (files: File[]) => {
    const { url } = await client.putFile(files[0])
    content.onChange({ url })
  }

  const dropzone = useDropzone({ onDrop, accept: "image/*", preventDropOnDocument: true })

  return (
    <Renderer
      src={content.value && content.value.url}
      {...dropzone.getRootProps()}
      {...wrapperProps}
    >
      <input {...dropzone.getInputProps()} />
      {children}
      {
        content.value.url && (
          <ShowOnMouseover>
            <CenterOverParent>
              <EditUiButton translucent>
                <ImageUploadIcon style={{ width: 24, height: 24 }} />
              </EditUiButton>
            </CenterOverParent>
          </ShowOnMouseover>
        ) || (
          <CenterOverParent>
            <ImageUploadIcon style={{ width: 24, height: 24 }} />
          </CenterOverParent>
        )
      }
    </Renderer>
  )
}