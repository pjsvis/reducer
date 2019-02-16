import * as React from 'react';
import { useState, useEffect, useReducer, useCallback } from 'react';
import clsx from 'clsx';
import { BtnDisplay } from './BtnDisplay';

// NOTE: Use an object instead of a switch statement
// Ref: https://medium.com/chrisburgin/rewriting-javascript-replacing-the-switch-statement-cfff707cf045
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

const noop = () => {};

// Too hard to do exhaustive check for keys
// Better to stick with switch statement
const appReducer = (state, action) => {
  const reducerSwitch = {
    DRAFT: () => {
      return { ...initialObjectState, ...{ start: true } };
    },
    UNASSIGNED: () => {
      return { ...initialObjectState, ...{ details: true } };
    },
    ANALYSTSCOPE: () => {
      return {
        ...initialObjectState,
        ...{ details: true, analystScope: true }
      };
    },
    BUSINESSAPPROVE: () => {
      return {
        ...initialObjectState,
        ...{ details: true, analystDetails: true, businessApprove: true }
      };
    },
    COMPLETE: () => {
      return {
        ...initialObjectState,
        ...{ details: true, analystDetails: true, complete: true }
      };
    },
    RESET: () => {
      return initialObjectState;
    },
    NOOP: () => {
      return state;
    }
  };

  const fn = reducerSwitch[action.type];
  return fn();
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

export const ObjectForms = ({ initialState }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
      <div className="f5">Object Reducer Forms</div>
      <ol className="f6">
        <li>
          This is a test to see if we could use an object instead of a switch
          statement for the reducer
        </li>
        <li>
          Not really worth it as we lose the exhaustiveness check that we get
          with the switch statement
        </li>
      </ol>
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
    </div>
  );
};
