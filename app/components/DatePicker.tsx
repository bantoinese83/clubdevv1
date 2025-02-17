"use client"
  import ReactDatePicker from "react-datepicker"
  import "react-datepicker/dist/react-datepicker.css"

  interface DatePickerProps {
    selected: Date | null
    onChangeAction: (date: Date | null) => void
    placeholderText: string
    className: string
  }

  export function DatePicker({ selected, onChangeAction, placeholderText, className }: DatePickerProps) {
    return (
      <ReactDatePicker
        selected={selected}
        onChange={onChangeAction}
        placeholderText={placeholderText}
        className={className}
        dateFormat="yyyy-MM-dd"
      />
    )
  }