import React, { FunctionComponent } from "react";
import {
  CircularProgress,
  createStyles,
  makeStyles,
  SvgIconProps,
  Typography,
} from "@material-ui/core";
import CloudOff from "@material-ui/icons/CloudOff";
import Error from "@material-ui/icons/Error";

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: (props: { size: Size }) => ({
      width: "100%",
      height: "100%",
      minHeight:
        props.size === "lg" ? "300px" : props.size === "md" ? "200px" : "100px",
      position: "relative",
    }),
    centerArea: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    },
    iconLg: {
      height: 200,
      width: 200,
    },
    iconMd: {
      height: 100,
      width: 100,
    },
    iconSm: {
      height: 50,
      width: 50,
    },
  })
);

export type Size = "sm" | "md" | "lg";
interface PendingProps {
  size: Size;
}
export const Pending: FunctionComponent<PendingProps> = ({ size }) => {
  const classes = useStyles({ size });
  return (
    <div className={classes.root}>
      <div className={classes.centerArea}>
        <CircularProgress
          className={
            size === "sm"
              ? classes.iconSm
              : size === "md"
              ? classes.iconMd
              : classes.iconLg
          }
        />
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
  const classes = useStyles({ size });
  return (
    <div className={classes.root}>
      <div className={classes.centerArea}>
        <Icon
          className={
            size === "lg"
              ? classes.iconLg
              : size == "md"
              ? classes.iconMd
              : classes.iconSm
          }
        />
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
