import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

interface CustomInputProps extends Omit<TextFieldProps<"outlined">, "variant"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const CustomInput: React.FC<CustomInputProps> = ({
  startIcon,
  endIcon,
  className = "",
  sx = {},
  ...props
}) => {
  return (
    <TextField
      {...props} // Spread all standard TextField props
      variant="outlined"
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ),
        classes: {
          input: "h-7", // Apply Tailwind height
        },
        ...props.InputProps, // Allow overriding InputProps
      }}
      
      // sx={{
      //   "& input::placeholder": { fontSize: "12px", opacity: 0.7 }, // Smaller placeholder
      //   borderRadius: "8px", // Rounded corners
      //   ...sx, // Allow additional styles
      // }}
      className={`rounded-lg placeholder:text-xs placeholder:opacity-70 min-h-6 ${className}`}
      sx={{
        "& input::placeholder": {
          fontSize: "0.85rem", // Equivalent to `text-xs`
          opacity: 0.7,
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: "1px", // Change the border width when focused
        },  
        "& .MuiOutlinedInput-input": {
          padding: "6px 8px", // Adjust internal padding to reduce height
        }, 
         
        ...sx,
      }}
      
    />
  );
};

export default CustomInput;
