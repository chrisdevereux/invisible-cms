import styled from 'styled-components'

export const transparent = 'rgba(0,0,0,0)'
export const semiDarkened = 'rgba(0,0,0,0.1)'
export const darkened = 'rgba(0,0,0,0.2)'

export const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'

interface ControlProps {
  selected?: boolean
  translucent?: boolean
}

const control = ({ selected, translucent }: ControlProps) => `
  box-sizing: border-box;
  font-size: 12px;
  outline: none;
  border: none;
  background-color: ${selected ? darkened : (translucent ? 'rgba(255,255,255,0.75)' : transparent)};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0px;
  min-width: 2rem;

  &:hover {
    ${!selected ? 'background-color: rgba(255,255,255,0.75);' : ''}
    box-shadow: 0px 1px 2px rgba(0,0,0,0.3);
  }

  &:active,
  &:focus {
    outline: none;
  }
`

const showOnMouseover = () => `
  opacity: 0;
  z-index: 1000;

  *:hover > & {
    opacity: 1;
  }
  &:hover {
    opacity: 1;
  }
`

export const EditUiButton = styled.button`
  ${control}
`

export const EditUiSelect = styled.select`
  ${control}
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="292.4" height="292.4"><path fill="black" d="M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z"/></svg>');
  background-repeat: no-repeat, repeat;
  background-position: right 1rem top 50%, 0 0;
  padding-right 2rem;
  background-size: .65em auto, 100%;
`

export const EditUiControls = styled.div`
  display: inline-block;
  background-color: rgba(255,255,255,0.8);
  box-shadow: 0px 1px 5px rgba(0,0,0,0.3);
`

export const Paper = styled.div`
  display: inline-block;
  background-color: rgba(255,255,255,0.8);
  box-shadow: 0px 1px 5px rgba(0,0,0,0.3);
  padding: 1rem;
`

export const HoverOver = styled.div`
  ${showOnMouseover}

  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
`

export const Input = styled.input`
  outline: none;
  font-size: 13px;
  box-sizing: border-box;
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid ${semiDarkened};

  &:hover,
  &:focus {
    border-bottom: none;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.3);
  }
`

export const FormPrompt = styled.div`
  font-size: 13px;
  font-weight: bold;
  font-family: ${systemFont};
  margin-bottom: 1rem;
`

export const Columns = styled.div`
  display: flex;
  flex-direction: row;
`

export const CenterOverParent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`

export const ShowOnMouseover = styled.div`
  ${showOnMouseover}
`
