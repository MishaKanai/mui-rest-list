import React, { useState } from "react";
import { ButtonBase, ButtonBaseProps } from "@mui/material";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";

// v2 (MUI v5): the JSS sheet is gone — the theme-reading :focus rule became `sx` on the
// ButtonBase; the static dropdown rule became an inline style.
const dropdownStyle: React.CSSProperties = { display: "inline-grid" };
const sortButtonSx = {
  fontSize: "inherit",
  fontFamily: "inherit",
  "&:focus": {
    color: "text.secondary",
  },
} as const;

export const SortArrows = (props: {
  active?: boolean;
  direction?: "asc" | "desc";
  innerProps?: any;
}) => {
  const doubleArrows = (
    <>
      <ArrowDropUp viewBox="1 -9 24 24" color="disabled" />
      <ArrowDropDown viewBox="1 9 24 24" color="disabled" />
    </>
  );
  return (
    <div {...props.innerProps} style={dropdownStyle}>
      {!props.active ? (
        doubleArrows
      ) : props.direction === "asc" ? (
        <ArrowDropUp />
      ) : (
        <ArrowDropDown />
      )}
    </div>
  );
};
type SortLabelOwnProps = {
  label: React.ReactNode;
  active?: boolean;
  direction?: "asc" | "desc";
  ButtonProps?: ButtonBaseProps;
};

// forwardRef, and pass the leftover props through, so this can be a <Tooltip> child.
// Tooltip clones its child with a ref plus the handlers that open the tooltip; a plain
// function component holds neither, so the "Sort" tooltip never opened and React logged
// "Function components cannot be given refs" for every sortable column on every render.
const SortLabel = React.forwardRef<
  HTMLButtonElement,
  SortLabelOwnProps & Omit<ButtonBaseProps, keyof SortLabelOwnProps>
>(function SortLabel({ label, active, direction, ButtonProps, ...rest }, ref) {
  const [hovered, setHovered] = useState(false);
  // `rest` is what Tooltip cloned on (className, style, aria-describedby, its hover/focus
  // handlers). ButtonProps still wins over it, as it did before.
  const buttonProps: ButtonBaseProps = { ...rest, ...ButtonProps };

  return (
    <ButtonBase
      ref={ref}
      sx={sortButtonSx}
      {...buttonProps}
      style={
        hovered ? { opacity: ".7", ...buttonProps.style } : buttonProps.style
      }
      onMouseOver={(e) => {
        buttonProps.onMouseOver?.(e);
        setHovered(true);
      }}
      onMouseOut={(e) => {
        buttonProps.onMouseOut?.(e);
        setHovered(false);
      }}
    >
      <b>{label}</b>
      <span style={{ position: "relative", paddingRight: "2rem" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "1rem",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <SortArrows
            active={active || hovered}
            direction={hovered && !active ? "asc" : direction}
          />
        </div>
      </span>
    </ButtonBase>
  );
});
export default SortLabel;
