/*
  The loading and error states, at each size.
*/
import React from "react";
import Lock from "@mui/icons-material/Lock";
import {
  BaseError,
  NetworkUnavailable,
  Pending,
  ServerError,
} from "../components/states";
import { StoryFrame } from "./harness";

export default { title: "Fixtures/States" };

const noop = () => undefined;

const Panel = (props: { label: string; children: React.ReactNode }) => (
  <div style={{ border: "1px dashed #ccc" }}>
    <div
      style={{
        font: "400 12px/1.5 ui-monospace, Menlo, Consolas, monospace",
        color: "#666",
        padding: "2px 6px",
        borderBottom: "1px dashed #ccc",
      }}
    >
      {props.label}
    </div>
    {props.children}
  </div>
);

export const PendingAllSizes = () => (
  <StoryFrame
    title="Pending"
    note="minHeight and spinner size both key off the size prop: sm 100px/50, md 200px/100, lg 300px/200."
  >
    <div style={{ display: "grid", gap: 12 }}>
      <Panel label="size='sm'">
        <Pending size="sm" />
      </Panel>
      <Panel label="size='md'">
        <Pending size="md" />
      </Panel>
      <Panel label="size='lg'">
        <Pending size="lg" />
      </Panel>
    </div>
  </StoryFrame>
);

export const ServerErrors = () => (
  <StoryFrame
    title="ServerError"
    note="The heading is the status code; 'ajax error 404' is rewritten to 'Not Found'."
  >
    <div style={{ display: "grid", gap: 12 }}>
      <Panel label="code=500, message='Internal Server Error', size='md'">
        <ServerError size="md" code={500} message="Internal Server Error" />
      </Panel>
      <Panel label="code=404, message='ajax error 404', size='md'">
        <ServerError size="md" code={404} message="ajax error 404" />
      </Panel>
      <Panel label="code=0 (falls back to 'Unknown Error'), size='sm'">
        <ServerError size="sm" code={0} />
      </Panel>
    </div>
  </StoryFrame>
);

export const NetworkUnavailableStates = () => (
  <StoryFrame
    title="NetworkUnavailable"
    note="Offered with and without a retry callback; the Retry button only renders when retry is supplied."
  >
    <div style={{ display: "grid", gap: 12 }}>
      <Panel label="size='md', with retry">
        <NetworkUnavailable size="md" retry={noop} />
      </Panel>
      <Panel label="size='sm', no retry">
        <NetworkUnavailable size="sm" />
      </Panel>
    </div>
  </StoryFrame>
);

export const BaseErrorCustom = () => (
  <StoryFrame
    title="BaseError"
    note="The primitive the other two are built on: any SvgIcon, any heading and sub-text."
  >
    <Panel label="custom Icon, headingText, subText, retry">
      <BaseError
        size="md"
        Icon={Lock}
        headingText="Forbidden"
        subText="You do not have access to these records."
        retry={noop}
      />
    </Panel>
  </StoryFrame>
);
