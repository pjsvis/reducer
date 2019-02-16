import * as React from 'react';
import { useState, useEffect, useReducer, useCallback } from 'react';
import clsx from 'clsx';
import { BtnDisplay } from './BtnDisplay';

type SupportStatus =
  | 'DRAFT'
  | 'UNASSIGNED'
  | 'ANALYSTSCOPE'
  | 'BUSINESSAPPROVE'
  | 'COMPLETE';

type SupportActionType = SupportStatus | 'NOOP' | 'RESET';

// Used for testing the dispatch actions
const supportActionTypes: SupportActionType[] = [
  'DRAFT',
  'UNASSIGNED',
  'ANALYSTSCOPE',
  'BUSINESSAPPROVE',
  'COMPLETE',
  'NOOP',
  'RESET'
];

// TODO: Add a payload maybe
interface SupportAction {
  type: SupportActionType;
}

interface SupportState {
  start: boolean;
  details: boolean;
  analystScope: boolean;
  analystDetails: boolean;
  businessApprove: boolean;
  complete: boolean;
}

export const initialSupportState: SupportState = {
  start: false,
  details: false,
  analystScope: false,
  analystDetails: false,
  businessApprove: false,
  complete: false
};

const unreachable = (x: never): never => {
  throw new Error(`This should be unreachable! but got ${x}`);
};

// See here for async patterns
// https://stackoverflow.com/questions/53146795/react-usereducer-async-data-fetch
export const supportReducer = (
  state: SupportState,
  action: SupportAction
): SupportState => {
  console.log(action);
  switch (action.type) {
    case 'DRAFT':
      return { ...initialSupportState, ...{ start: true } };
    case 'UNASSIGNED':
      return { ...initialSupportState, ...{ details: true } };
    case 'ANALYSTSCOPE':
      return {
        ...initialSupportState,
        ...{ details: true, analystScope: true }
      };
    case 'BUSINESSAPPROVE':
      return {
        ...initialSupportState,
        ...{ details: true, analystDetails: true, businessApprove: true }
      };
    case 'COMPLETE':
      return {
        ...initialSupportState,
        ...{ details: true, analystDetails: true, complete: true }
      };
    case 'NOOP':
      return state;
    case 'RESET':
      return initialSupportState;
    default:
      unreachable(action.type);
  }
};

interface Props {
  initialState: SupportState;
}

type RequestType = 'CONTRACT' | 'SUPPORT' | 'ADVICE';
interface SupportRequest {
  id: string | null;
  status: SupportStatus;
  type: RequestType;
}
// We will get this from the saContainer
const selectedRequest: SupportRequest = {
  id: null,
  status: 'ANALYSTSCOPE',
  type: 'SUPPORT'
};

export const SupportForms = ({ initialState }) => {
  const [state, dispatch] = useReducer(supportReducer, initialState);

  useEffect(
    () => {
      const { type, status } = selectedRequest;
      const action: SupportAction = { type: status };
      type === 'SUPPORT' ? dispatch(action) : dispatch({ type: 'RESET' });
    },
    [selectedRequest]
  );

  const handleDispatch = (action: SupportAction) => {
    // TODO: Do some asynch stuff here to save the form details
    // Then we get the new request
    console.log(action.type);
    // Get the new status from the request and dipatch it to rerender the forms
    dispatch(action);
  };

  return (
    <div>
      <div className="f5">Support Forms</div>
      <div>
        {supportActionTypes.map((x: SupportActionType) => (
          <BtnDisplay action={x} onClick={() => handleDispatch({ type: x })} />
        ))}
      </div>

      {Object.entries(state).map(x => (
        <div>
          <i
            className={clsx({ 'f6 fa fa-fw': true, 'fa-check green': x[1] })}
          />
          {x[0]}
        </div>
      ))}
    </div>
  );
};
