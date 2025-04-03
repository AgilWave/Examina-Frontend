import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";

const StyledDatePicker = styled(MuiDatePicker)({
  "& .MuiInputBase-root": {
    borderRadius: "0.375rem",
    backgroundColor: "transparent",
    border: "1px solid rgb(226, 232, 240)",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    width: "100%",
    height: "2.5rem",
    padding: "0 0.75rem",
  },
  "& .MuiInputBase-input": {
    padding: "0.5rem 0.75rem",
    color: "inherit",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  // Dark mode support
  "@media (prefers-color-scheme: dark)": {
    "& .MuiInputBase-root": {
      borderColor: "rgb(55, 65, 81)",
      color: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "rgb(156, 163, 175)",
    },
  },
});

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [date, setDate] = useState<Date | null>(value || null);

  const handleChange = (newDate: Date | null) => {
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDatePicker
        value={date}
        onChange={handleChange}
        disabled={disabled}
        slotProps={{
          textField: {
            placeholder,
            fullWidth: true,
            className,
          },
        }}
      />
    </LocalizationProvider>
  );
}
