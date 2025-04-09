import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

// Theme-specific colors
const lightThemeColors = {
  background: "#FFFFFF",
  border: "#E2E8F0",
  text: "#333333",
  icon: "#00000050",
};

const darkThemeColors = {
  background: "#000000",
  border: "#4A4A4A",
  text: "#FFFFFF",
  icon: "#9CA3AF",
};

// Using increased specificity selectors to override Tailwind
const StyledDatePicker = styled(MuiDatePicker)(({ theme }) => {
  const colors = theme.palette.mode === "dark" ? darkThemeColors : lightThemeColors;
  
  return {
    // Using &&& to increase specificity and override Tailwind styles
    "&&& .MuiInputBase-root": {
      borderRadius: "0.375rem",
      backgroundColor: `${colors.background} !important`,
      border: `1px solid ${colors.border} !important`,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      width: "100%",
      height: "2.5rem",
      padding: "0 0.75rem",
      color: `${colors.text} !important`,
    },
    "&&& .MuiInputBase-input": {
      padding: "0.5rem 0.75rem",
      color: `${colors.text} !important`,
    },
    "&&& .MuiOutlinedInput-notchedOutline": {
      border: "none !important",
    },
    "&&& .MuiSvgIcon-root": {
      color: `${colors.icon} !important`,
    },
    // Calendar popup styles with higher specificity
    "&&& .MuiPaper-root": {
      backgroundColor: `${theme.palette.mode === "dark" ? darkThemeColors.background : lightThemeColors.background} !important`,
      color: `${theme.palette.mode === "dark" ? darkThemeColors.text : lightThemeColors.text} !important`,
      borderRadius: "1rem !important",
    },
    "&&& .MuiPickersDay-root": {
      color: `${theme.palette.mode === "dark" ? darkThemeColors.text : lightThemeColors.text} !important`,
      borderRadius: "1rem !important",
    },
    "&&& .MuiPickersDay-today": {
      borderColor: `${theme.palette.mode === "dark" ? darkThemeColors.text : lightThemeColors.text} !important`,
      borderRadius: "1rem !important",
    },
    "&&& .MuiPickersDay-root.Mui-selected": {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: "#FFFFFF !important",
      borderRadius: "1rem !important",
    },
    // Fix for month/year selection
    "&&& .MuiPickersYear-root": {
      color: `${theme.palette.mode === "dark" ? darkThemeColors.text : lightThemeColors.text} !important`,
    },
    "&&& .MuiPickersMonth-root": {
      color: `${theme.palette.mode === "dark" ? darkThemeColors.text : lightThemeColors.text} !important`,
    },
    // Calendar header
    "&&& .MuiPickersCalendarHeader-root": {
      color: `${theme.palette.mode === "dark" ? darkThemeColors.text : lightThemeColors.text} !important`,
    },
    // Day names
    "&&& .MuiDayCalendar-weekDayLabel": {
      color: `${theme.palette.mode === "dark" ? darkThemeColors.text : lightThemeColors.text} !important`,
    },
  };
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
  const theme = useTheme();

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
            className: `${className || ""}`,
          },
        }}
      />
    </LocalizationProvider>
  );
}