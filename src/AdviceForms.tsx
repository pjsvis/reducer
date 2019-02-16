import * as React from 'react';
import { useState, useEffect, useReducer, useCallback } from 'react';
import clsx from 'clsx';
import { BtnDisplay } from './BtnDisplay';

// Used for testing the dispatch actions
const supportActionTypes: AdviceActionType[] = [
  'DRAFT',
  'UNASSIGNED',
  'ANALYSTSCOPE',
  'BUSINESSAPPROVE',
  'COMPLETE',
  'NOOP',
  'RESET'
];

type AdviceStatus =
  | 'DRAFT'
  | 'UNASSIGNED'
  | 'ANALYSTSCOPE'
  | 'BUSINESSAPPROVE'
  | 'COMPLETE';

export type AdviceActionType = AdviceStatus | 'NOOP' | 'RESET';

// TODO: Add a payload maybe
interface AdviceAction {
  type: AdviceActionType;
}

export interface AdviceState {
  start: boolean;
  details: boolean;
  analystScope: boolean;
  analystDetails: boolean;
  businessApprove: boolean;
  complete: boolean;
}

export const initialAdviceState: AdviceState = {
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
  state: AdviceState,
  action: AdviceAction
): AdviceState => {
  console.log(action);
  switch (action.type) {
    case 'DRAFT':
      return { ...initialAdviceState, ...{ start: true } };
    case 'UNASSIGNED':
      return { ...initialAdviceState, ...{ details: true } };
    case 'ANALYSTSCOPE':
      return {
        ...initialAdviceState,
        ...{ details: true, analystScope: true }
      };
    case 'BUSINESSAPPROVE':
      return {
        ...initialAdviceState,
        ...{ details: true, analystDetails: true, businessApprove: true }
      };
    case 'COMPLETE':
      return {
        ...initialAdviceState,
        ...{ details: true, analystDetails: true, complete: true }
      };
    case 'NOOP':
      return state;
    case 'RESET':
      return initialAdviceState;
    default:
      unreachable(action.type);
  }
};

interface Props {
  initialState: AdviceState;
}

type RequestType = 'CONTRACT' | 'SUPPORT' | 'ADVICE';
interface AdviceRequest {
  id: string | null;
  status: AdviceStatus;
  type: RequestType;
}
// We will get this from the saContainer
const selectedRequest: AdviceRequest = {
  id: null,
  status: 'ANALYSTSCOPE',
  type: 'SUPPORT'
};

export const AdviceForms = ({ initialState }) => {
  const [state, dispatch] = useReducer(supportReducer, initialState);

  useEffect(
    () => {
      const { type, status } = selectedRequest;
      const action: AdviceAction = { type: status };
      type === 'SUPPORT' ? dispatch(action) : dispatch({ type: 'RESET' });
    },
    [selectedRequest]
  );

  const handleDispatch = (action: AdviceAction) => {
    // TODO: Do some asynch stuff here to save the form details
    // Then we get the new request
    console.log(action.type);
    // Get the new status from the request and dipatch it to rerender the forms
    dispatch(action);
  };

  return (
    <div>
      <div className="f5">Advice Forms</div>

      <div>
        {supportActionTypes.map((x: AdviceActionType) => (
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
