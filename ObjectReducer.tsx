import * as React from 'react';
import { useState, useEffect, useReducer, useCallback } from 'react';
import clsx from 'clsx';

type AdviceStatus =
  | 'DRAFT'
  | 'UNASSIGNED'
  | 'ANALYSTSCOPE'
  | 'BUSINESSAPPROVE'
  | 'COMPLETE';

type AdviceActionType = AdviceStatus | 'NOOP' | 'RESET';

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

// TODO: Add a payload maybe
interface AdviceAction {
  type: AdviceActionType;
}

interface AdviceState {
  start: boolean;
  details: boolean;
  analystScope: boolean;
  analystDetails: boolean;
  businessApprove: boolean;
  complete: boolean;
}

export const initialObjectState: AdviceState = {
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
const supportReducer = (
  state: AdviceState,
  action: AdviceAction
): AdviceState => {
  console.log(action);
  switch (action.type) {
    case 'DRAFT':
      return { ...initialObjectState, ...{ start: true } };
    case 'UNASSIGNED':
      return { ...initialObjectState, ...{ details: true } };
    case 'ANALYSTSCOPE':
      return {
        ...initialObjectState,
        ...{ details: true, analystScope: true }
      };
    case 'BUSINESSAPPROVE':
      return {
        ...initialObjectState,
        ...{ details: true, analystDetails: true, businessApprove: true }
      };
    case 'COMPLETE':
      return {
        ...initialObjectState,
        ...{ details: true, analystDetails: true, complete: true }
      };
    case 'NOOP':
      return state;
    case 'RESET':
      return initialObjectState;
    default:
      unreachable(action.type);
  }
};

interface Props {
  initialState: AdviceState;
}

interface BtnProps {
  action: AdviceActionType;
  onClick(): void;
}
const BtnDisplay = (props: BtnProps) => {
  const { action, onClick } = props;
  return (
    <button className="btn btn-sm btn-primary mr1 mt1" onClick={onClick}>
      {action.toLowerCase()}
    </button>
  );
};

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

export const ObjectForms = ({ initialState }) => {
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
      <div className="f5">Object Reducer</div>
      <div className="f6">
        Click the buttons to see which forms are visible for different request
        statuses
      </div>
      <div>
        {supportActionTypes.map((x: AdviceActionType) => (
          <BtnDisplay action={x} onClick={() => handleDispatch({ type: x })} />
        ))}
      </div>

      <div className="mt2 f5">Forms</div>
      {Object.entries(state).map(x => (
        <div>
          <i
            className={clsx({ 'f6 fa fa-fw': true, 'fa-check green': x[1] })}
          />
          {x[0]}
        </div>
      ))}
      <ol className="mt2 f6">
        <li>We layout out our Contract forms here</li>
        <li>
          We show the Contract forms according to the request status and the
          user role
        </li>
      </ol>
    </div>
  );
};
