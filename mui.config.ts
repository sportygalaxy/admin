import { createTheme, Theme } from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const headingStyles = (fontFamily: string): TypographyOptions => {
  return {
    h1: { fontFamily, fontWeight: 600, fontSize: "1.875rem" }, // 30px
    h2: { fontFamily, fontWeight: 600, fontSize: "1.5rem" }, // 24px
    h3: { fontFamily, fontWeight: 600, fontSize: "1.25rem" }, // 20px
    h4: { fontFamily },
    h5: { fontFamily },
    h6: { fontFamily },
  };
};

const baseTheme: Theme = createTheme({
  palette: {
    primary: {
      dark: "#000",
      light: "#fff",
      main: "#039855",
      50: "#ECFDF3",
      200: "#A6F4C5",
      500: "#12B76A",
      600: "#039855",
      700: "#027A48",
      800: "#05603A",
    },
    // primary: {
    //   dark: "#000000",
    //   light: "#F9FAFB",
    //   main: "#101828",
    //   50: "#F9FAFB",
    //   200: "#D0D5DD",
    //   500: "#344054",
    //   600: "#101828",
    //   700: "#000000",
    //   800: "#000000",
    // },
    secondary: {
      main: "#D97706",
    },
    grey: {
      50: "#F9FAFB",
      100: "#F2F4F7",
      200: "#EAECF0",
      300: "#D0D5DD",
      400: "#98A2B3",
      500: "#667085",
      600: "#475467",
      700: "#344054",
      900: "#101828",
    },
    success: {
      main: "#ECFDF3",
    },
    error: {
      main: "#B42318",
      light: "#FDA29B",
      lighter: "#FEF3F2",
      600: "#D92D20",
    },
  },
});

const theme = createTheme(baseTheme, {
  breakpoints: {
    values: {
      values: {
        xs: 0,
        sm: 600,
        md: 800,
        lg: 1200,
        xl: 1536,
      },
    },
    // values: {
    //   mobile: 0,
    //   tablet: 640,
    //   laptop: 1024,
    //   desktop: 1200,
    // },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Crimson Pro",
      "Arial", // fallback fonts
      "sans-serif",
      "serif",
    ].join(","),
    ...headingStyles("Crimson Pro, serif"),
  },
  components: {
    MuiAccordion: {
    styleOverrides: {
      root: {
        '&::before': {
          display: 'none', // remove default divider line
        },
        backgroundColor: "transparent",
        boxShadow: "none",
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        border: "none!important",
      },
      content: {
        "&.Mui-expanded": {
          margin: "0px 0 10px 0",
        },
      },
    },
  },
    MuiButton: {
      styleOverrides: {
        root: {
          cursor: "pointer !important",

          "&:hover": {
            cursor: "pointer !important",
          },
          "&:focus": {
            cursor: "pointer !important",
          },

          "&.Mui-disabled": {
            cursor: "not-allowed",
          },
        },
      },
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
      variants: [
        {
          props: { variant: "contained" },
          style: {
            borderRadius: 8,
            background: baseTheme.palette.primary.main,
            color: baseTheme.palette.primary.light,
            cursor: "pointer !important",
            ":hover": {
              background: (baseTheme.palette.primary as any)[700],
              color: baseTheme.palette.primary.light,
            },
            ":focus": {
              background: (baseTheme.palette.primary as any)[700],
              color: baseTheme.palette.primary.light,
            },
            ":active": {
              background: (baseTheme.palette.primary as any)[700],
              color: baseTheme.palette.primary.light,
            },
          },
        },
        {
          props: { variant: "contained-error" },
          style: {
            borderRadius: 8,
            background: (baseTheme.palette.error as any)[600],
            color: baseTheme.palette.primary.light,
            ":hover": {
              background: baseTheme.palette.error.main,
              color: baseTheme.palette.primary.light,
            },
            ":focus": {
              background: baseTheme.palette.error.main,
              color: baseTheme.palette.primary.light,
            },
            ":active": {
              background: baseTheme.palette.error.main,
              color: baseTheme.palette.primary.light,
            },
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            borderRadius: 8,
            background: "transparent",
            color: (baseTheme.palette.primary as any)[700],
            cursor: "pointer !important",
            border: `1px solid ${(baseTheme.palette.primary as any)[700]}`,
            ":hover": {
              background: (baseTheme.palette.primary as any)[50],
              color: (baseTheme.palette.primary as any)[700],
            },
            ":focus": {
              background: (baseTheme.palette.primary as any)[50],
              color: (baseTheme.palette.primary as any)[700],
            },
            ":active": {
              background: (baseTheme.palette.primary as any)[50],
              color: (baseTheme.palette.primary as any)[700],
            },
          },
        },
        {
          props: { variant: "outlined-error" },
          style: {
            borderRadius: 8,
            background: "transparent",
            color: baseTheme.palette.error.main,
            border: `1px solid ${baseTheme.palette.error.light}`,
            ":hover": {
              background: baseTheme.palette.error.lighter,
              color: baseTheme.palette.error.main,
            },
            ":focus": {
              background: baseTheme.palette.error.lighter,
              color: baseTheme.palette.error.main,
            },
            ":active": {
              background: baseTheme.palette.error.lighter,
              color: baseTheme.palette.error.main,
            },
          },
        },
        {
          props: { variant: "ghost" },
          style: {
            borderRadius: 8,
            background: "transparent",
            color: (baseTheme.palette.grey as any)[700],
            border: `1px solid ${(baseTheme.palette.grey as any)[300]}`,
            ":hover": {
              background: (baseTheme.palette.grey as any)[50],
              color: (baseTheme.palette.grey as any)[900],
            },
            ":focus": {
              background: (baseTheme.palette.grey as any)[50],
              color: (baseTheme.palette.grey as any)[900],
            },
            ":active": {
              background: (baseTheme.palette.grey as any)[50],
              color: (baseTheme.palette.grey as any)[900],
            },
          },
        },
        {
          props: { variant: "link" },
          style: {
            background: "transparent",
            color: (baseTheme.palette.primary as any)[800],
            ":hover": {
              opacity: 0.8,
              background: (baseTheme.palette.primary as any)[50],
              textDecoration: "underline",
            },
            ":focus": {
              opacity: 0.8,
              background: (baseTheme.palette.primary as any)[50],
              textDecoration: "underline",
            },
            ":active": {
              opacity: 0.8,
              background: (baseTheme.palette.primary as any)[50],
              textDecoration: "underline",
            },
          },
        },
        {
          props: { size: "large" },
          style: () => ({ padding: "10px 18px" }),
        },
        {
          props: { size: "medium" },
          style: () => ({ padding: "10px 16px" }),
        },
        {
          props: { size: "small" },
          style: () => ({ padding: "6px 12px" }),
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      variants: [
        {
          props: { size: "small" },
          style: () => {
            return {
              // You can add additional size-specific styles here if needed
            };
          },
        },
        {
          props: { variant: "standard" }, // Define a new 'ghost' variant
          style: {
            "& .MuiInputBase-root": {
              backgroundColor: "black", // No background
              border: "none", // No border
              boxShadow: "none", // No shadow
            },
          },
        },
      ],
      styleOverrides: {
        root: () => {
          return {
            "& label": {
              top: 0,
              left: 0,
              "& + .MuiInputBase-root": {
                marginTop: theme.spacing(0),
              },
            },

            "&.MuiTextFieldOutlined--plain .MuiInputBase-root": {
              paddingInline: "12px", // Targeting .MuiInputBase-root specifically
            },

            "& .MuiInputBase-root": {
              minHeight: "56px",
              // height: "56px",
              color: (baseTheme.palette.grey as any)[900],
              fontSize: "0.875rem", // 14px
              fontWeight: 400,
              fontFamily: "Inter",
              backgroundColor: "#fff",
              padding: 0,
              borderRadius: "8px",
              border: `1px solid ${(baseTheme.palette.grey as any)[300]}`,
              boxShadow: "0px 1px 2px 0px #1018280D",

              // Focused state - border and thicker width
              "&:focus-within": {
                backgroundColor: "#fff",
                borderColor: baseTheme.palette.primary.main,
                borderWidth: "1px",
                boxShadow: "0px 1px 2px 0px #1018280D",
              },

              // Hover state - primary color border
              "&:hover": {
                backgroundColor: "#fff",
                borderColor: baseTheme.palette.primary.main,
                boxShadow: "0px 1px 2px 0px #1018280D",
              },

              // Placeholder text color
              "&::placeholder": {
                color: baseTheme.palette.grey[500],
                opacity: 1,
              },

              // Disabled state
              "&.Mui-disabled": {
                backgroundColor: (baseTheme.palette.grey as any)[200],
                color: (baseTheme.palette.grey as any)[500],
                opacity: 1,
                borderColor: (baseTheme.palette.grey as any)[300],
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: (baseTheme.palette.grey as any)[200],
                  color: (baseTheme.palette.grey as any)[900],
                  borderColor: (baseTheme.palette.grey as any)[300],
                  boxShadow: "none",
                },
              },

              // Helper text
              "& + .MuiFormHelperText-root": {
                marginLeft: 0,
              },

              // Input padding for different sizes
              "& .MuiInputBase-input": {
                padding: "18px 4px",
              },
              "&.MuiTextField-sizeSmall .MuiInputBase-input": {
                padding: "6px 8px",
              },
              "&.MuiTextField-sizeMedium .MuiInputBase-input": {
                padding: "10px 12px",
              },
              "&.MuiTextField-sizeLarge .MuiInputBase-input": {
                padding: "14px 16px",
              },

              // Active state - black border when active
              "&.Mui-active .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },

              "& input[type='time']": {
                // Styling for time input
                // padding: "8px 12px",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                color: "#333", // Text color
                borderRadius: "4px",
                // border: "1px solid #ccc",
                "&:focus": {
                  outline: "none",
                  // border: "1px solid #10b981", // Focus color
                },
                "&::-webkit-calendar-picker-indicator": {
                  filter: "invert(50%)", // Optional: Style the clock icon
                },
              },
            },
          };
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&.Mui-disabled": {
            opacity: 1, // Ensure it's visible
            "-webkit-text-fill-color": "unset", // Remove default color for WebKit browsers
            color: (baseTheme.palette.grey as any)[500], // Set your desired color for the value
            "&::placeholder": {
              color: (baseTheme.palette.grey as any)[900], // Set your desired color for the placeholder
            },
          },
        },
      },
    },
    MuiTabs: {
      defaultProps: {
        variant: "scrollable",
        scrollButtons: "auto",
        allowScrollButtonsMobile: true,
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          minWidth: 108,
          color: theme.palette.grey[500],
          fontWeight: 500,
          fontFamily: "Inter",
          fontSize: "1rem",
          padding: "0px",
          margin: "0px",
          textTransform: "none",
          marginRight: theme.spacing(2),
          "&:hover": {
            color: theme.palette.primary.main,
          },
          "&.Mui-selected": {
            fontFamily: "Inter",
            color: theme.palette.primary.main,
            fontWeight: 700,
            backgroundColor: "transparent",
          },
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.contained": {
            backgroundColor: (baseTheme.palette.primary as any)[700],
            borderRadius: "4px",
            color: "#fff",
            "&:hover": {
              backgroundColor: (baseTheme.palette.primary as any)[700],
            },
            "&.Mui-checked": {
              backgroundColor: (baseTheme.palette.primary as any)[700],
              color: "#fff",
            },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#a0a0a0",
            },
          },
          "&.outlined": {
            // border: `1px solid ${(baseTheme.palette.primary as any)[700]}`,
            color: (baseTheme.palette.primary as any)[700],
            borderRadius: "4px",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&.Mui-checked": {
              borderColor: (baseTheme.palette.primary as any)[700],
              color: (baseTheme.palette.primary as any)[700],
            },
            "&.Mui-disabled": {
              borderColor: "#e0e0e0",
              color: "#a0a0a0",
            },
          },
          // "&:hover": {
          //   backgroundColor: "#F9F5FF",
          // },
          // "&.Mui-checked": {
          //   color: (baseTheme.palette.primary as any)[700],
          //   background: baseTheme.palette.primary.light,
          // },
          // "&.Mui-disabled": {
          //   color: "gray",
          // },
        },
        sizeSmall: {
          width: 20,
          height: 20,
          "& svg": {
            fontSize: "18px",
          },
        },
        sizeMedium: {
          width: 25,
          height: 25,
          "& svg": {
            fontSize: "22px",
          },
        },
        sizeLarge: {
          width: 30,
          height: 30,
          "& svg": {
            fontSize: "28px",
          },
        },
      },
      defaultProps: {
        size: "medium",
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "1rem",
          padding: "0px",
          height: "56px",
          maxWidth: "none",

          "& .MuiSelect-select": {
            padding: "13.4px 12px",
          },
          "& .MuiSelect-icon": {
            right: "8px",
          },

          // Active state background color
          "&.Mui-active": {
            backgroundColor: "#f5f5f5",
          },

          // Default notched outline border color
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: (baseTheme.palette.grey as any)[300],
          },

          // Hover state: adjust background and border color
          "&:hover .MuiSelect-select": {
            // backgroundColor: (baseTheme.palette.primary as any)[50],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: baseTheme.palette.primary.main, // Hover border color
          },

          // Disabled state styles
          "&.Mui-disabled": {
            color: (baseTheme.palette.grey as any)[900],
            backgroundColor: (baseTheme.palette.grey as any)[200],
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: (baseTheme.palette.grey as any)[300],
          },
          "&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: (baseTheme.palette.grey as any)[300],
            backgroundColor: "transparent",
          },

          // Focused state: black border
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: baseTheme.palette.primary.main, // Focused border color
            borderWidth: "1px", // Make the border a bit thicker when focused
          },

          // Active state: black border
          "&.Mui-active .MuiOutlinedInput-notchedOutline": {
            borderColor: "black", // Active border color
          },
        },

        // Size variations
        small: {
          fontSize: "0.875rem",
          padding: "6px 8px",
        },
        medium: {
          fontSize: "1rem",
          padding: "10px 12px",
        },
        large: {
          fontSize: "1.25rem",
          padding: "14px 16px",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "&.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root": {
            paddingRight: "18px",
            paddingLeft: "18px",
            // paddingBlock: "12px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            // border: `1px solid ${baseTheme.palette.primary.main}`,
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            // border: `1px solid ${baseTheme.palette.primary.main}`,
            border: "none",
          },

          // FIX
          "&.Mui-error": {
            "& .MuiOutlinedInput-root": {
              borderColor: baseTheme.palette.error.main,
              backgroundColor: baseTheme.palette.error.light,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${baseTheme.palette.error.main}`,
            },
          },
          "&.Mui-disabled": {
            "& .MuiOutlinedInput-root": {
              backgroundColor: (baseTheme.palette.grey as any)[200], // Light grey for disabled background
              color: (baseTheme.palette.grey as any)[500], // Grey text color for disabled
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${(baseTheme.palette.grey as any)[400]}`, // Grey border on hover
            },
          },
        },
        popupIndicator: {
          // Optional: Hide the default popup indicator
          // display: "none",
        },

        // FIX
        // Disabled state styles
        // disabled: {
        //   "& .MuiOutlinedInput-root": {
        //     backgroundColor: (baseTheme.palette.grey as any)[200], // Light grey for disabled background
        //     color: (baseTheme.palette.grey as any)[500], // Grey text color for disabled
        //   },
        //   "&:hover .MuiOutlinedInput-notchedOutline": {
        //     border: `1px solid ${(baseTheme.palette.grey as any)[400]}`, // Grey border on hover
        //   },
        // },

        // Error state styles
        // error: {
        //   "& .MuiOutlinedInput-root": {
        //     borderColor: baseTheme.palette.error.main,
        //     backgroundColor: baseTheme.palette.error.light,
        //   },
        //   "&:hover .MuiOutlinedInput-notchedOutline": {
        //     border: `1px solid ${baseTheme.palette.error.main}`,
        //   },
        // },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-root": {
            backgroundColor: "transparent",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "#FEF3F2",
            color: "#B42318",
          },
          "&.MuiChip-colorSuccess": {
            backgroundColor: "#ECFDF3",
            color: "#027A48",
          },
          "&.MuiChip-colorInfo": {
            backgroundColor: "#F2F4F7",
            color: "#1D2939",
          },
        },
      },
      variants: [
        {
          props: { variant: "success" },
          style: {
            backgroundColor: "#ECFDF3",
            color: "#027A48",
            ".MuiChip-icon": {
              color: "#12B76A",
            },
          },
        },
        {
          props: { variant: "error" },
          style: {
            backgroundColor: "#FEF3F2",
            color: "#B42318",
            ".MuiChip-icon": {
              color: "#F04438",
            },
          },
        },
        {
          props: { variant: "info" },
          style: {
            backgroundColor: "#EFF8FF",
            color: "#175CD3",
            ".MuiChip-icon": {
              color: "#2E90FA",
            },
          },
        },
        {
          props: { variant: "warning" },
          style: {
            backgroundColor: "#FFFAEB",
            color: "#B54708",
            ".MuiChip-icon": {
              color: "#F79009",
            },
          },
        },
      ],
    },
  },
});

export default theme;
