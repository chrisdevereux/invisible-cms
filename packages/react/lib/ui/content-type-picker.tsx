import React from "react";
import { placeholderContent } from "../content";
import { EditUiSelect } from "./atoms";

export const ContentTypePicker = ({ availableTypes, value, onChange }) => (
  <EditUiSelect
    value={Math.max(availableTypes.findIndex(t => t.validator(value)), 0)}
    onChange={event => {
      const initialValue = placeholderContent(availableTypes[event.currentTarget.value])
      onChange(initialValue)
    }}
  >
    {
      availableTypes.map((t, i) =>
        <option
          key={i}
          value={i}
        >
          {t.name}
        </option>
      )
    }
  </EditUiSelect>
)