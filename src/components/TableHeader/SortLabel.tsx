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
const SortLabel: React.FC<{
  label: React.ReactNode;
  active?: boolean;
  direction?: "asc" | "desc";
  ButtonProps?: ButtonBaseProps;
}> = ({ label, active, direction, ButtonProps }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <ButtonBase
      sx={sortButtonSx}
      style={hovered ? { opacity: ".7" } : undefined}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      {...ButtonProps}
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
};
export default SortLabel;
