import React, { FunctionComponent } from "react";
import { CircularProgress, SvgIconProps, Typography } from "@mui/material";
import CloudOff from "@mui/icons-material/CloudOff";
import Error from "@mui/icons-material/Error";

// v2 (MUI v5): the JSS sheet (including its props-dependent `root` rule) is gone — none of
// the rules read the theme, so they became inline style objects on the same elements.
const rootStyle = (size: Size): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  minHeight: size === "lg" ? "300px" : size === "md" ? "200px" : "100px",
  position: "relative",
});
const centerAreaStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
};
const iconStyles: Record<Size, React.CSSProperties> = {
  lg: { height: 200, width: 200 },
  md: { height: 100, width: 100 },
  sm: { height: 50, width: 50 },
};

export type Size = "sm" | "md" | "lg";
interface PendingProps {
  size: Size;
}
export const Pending: FunctionComponent<PendingProps> = ({ size }) => {
  return (
    <div style={rootStyle(size)}>
      <div style={centerAreaStyle}>
        <CircularProgress style={iconStyles[size]} />
      </div>
    </div>
  );
};
interface BaseErrorProps {
  retry?: (e?: any) => void;
  Icon: React.ComponentType<SvgIconProps>;
  headingText?: string;
  subText?: string;
  size: Size;
}
export const BaseError: React.FunctionComponent<BaseErrorProps> = (props) => {
  const { retry, Icon, headingText, subText, size } = props;
  return (
    <div style={rootStyle(size)}>
      <div style={centerAreaStyle}>
        <Icon style={iconStyles[size]} />
        {headingText && (
          <Typography
            variant={size === "sm" ? "h3" : size === "md" ? "h4" : "h5"}
            component="div"
          >
            {headingText}
          </Typography>
        )}
        {subText && (
          <>
            <br />
            <Typography>{subText}</Typography>
          </>
        )}
        <br />
        {retry ? (
          <button type="reset" onClick={retry}>
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
};

export const NetworkUnavailable = (props: {
  retry?: (e: any) => void;
  size: Size;
}) => {
  const { retry, size } = props;
  return (
    <BaseError
      size={size}
      Icon={CloudOff}
      headingText="Offline"
      retry={retry}
    />
  );
};

export const ServerError = (props: {
  code: number;
  message?: string;
  size: Size;
}) => {
  const { code, message, size } = props;
  return (
    <BaseError
      size={size}
      Icon={Error}
      headingText={code ? `${code}` : "Unknown Error"}
      subText={message === "ajax error 404" ? "Not Found" : message}
    />
  );
};
