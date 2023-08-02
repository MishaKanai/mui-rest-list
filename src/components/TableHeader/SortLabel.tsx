import React, { useState } from "react";
import {
  ButtonBase,
  ButtonBaseProps,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";

const useStyles = makeStyles((theme) =>
  createStyles({
    dropdown: {
      display: "inline-grid",
    },
    sortButton: {
      "&:focus": {
        color: theme.palette.text.secondary,
      },
    },
  })
);

export const SortArrows = (props: {
  active?: boolean;
  direction?: "asc" | "desc";
  innerProps?: any;
}) => {
  const classes = useStyles();
  const doubleArrows = (
    <>
      <ArrowDropUp viewBox="1 -9 24 24" color="disabled" />
      <ArrowDropDown viewBox="1 9 24 24" color="disabled" />
    </>
  );
  return (
    <div {...props.innerProps} className={classes.dropdown}>
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
  const classes = useStyles();
  const [hovered, setHovered] = useState(false);

  return (
    <ButtonBase
      className={classes.sortButton}
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
