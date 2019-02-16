import * as React from 'react';
import { useState, useEffect, useReducer, useCallback } from 'react';
import clsx from 'clsx';
import { BtnDisplay } from './BtnDisplay';

type ContractStatus =
  | 'DRAFT'
  | 'SCOPE'
  | 'UNASSIGNED'
  | 'ANALYSTSCOPE'
  | 'BUSINESSAPPROVE'
  | 'COMPLETE';

type ContractActionType = ContractStatus | 'NOOP' | 'RESET';

// Used for testing the dispatch actions
const contractActionTypes: ContractActionType[] = [
  'DRAFT',
  'SCOPE',
  'UNASSIGNED',
  'ANALYSTSCOPE',
  'BUSINESSAPPROVE',
  'COMPLETE',
  'NOOP',
  'RESET'
];

// TODO: Add a payload maybe
interface ContractAction {
  type: ContractActionType;
}

export interface ContractState {
  start: boolean;
  startDetails: boolean;
  scope: boolean;
  details: boolean;
  analystScope: boolean;
  analystDetails: boolean;
  businessApprove: boolean;
  complete: boolean;
}

export const initialContractState: ContractState = {
  start: false,
  startDetails: false,
  scope: false,
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
export const contractReducer = (
  state: ContractState,
  action: ContractAction
): ContractState => {
  console.log(action);
  switch (action.type) {
    case 'DRAFT':
      return { ...initialContractState, ...{ start: true } };
    case 'SCOPE':
      return {
        ...initialContractState,
        ...{ startDetails: true, scope: true }
      };
    case 'UNASSIGNED':
      return { ...initialContractState, ...{ details: true } };
    case 'ANALYSTSCOPE':
      return {
        ...initialContractState,
        ...{ details: true, analystScope: true }
      };
    case 'BUSINESSAPPROVE':
      return {
        ...initialContractState,
        ...{ details: true, analystDetails: true, businessApprove: true }
      };
    case 'COMPLETE':
      return {
        ...initialContractState,
        ...{ details: true, analystDetails: true, complete: true }
      };
    case 'NOOP':
      return state;
    case 'RESET':
      return initialContractState;
    default:
      unreachable(action.type);
  }
};

interface Props {
  initialState: ContractState;
}

type RequestType = 'CONTRACT' | 'SUPPORT' | 'ADVICE';
interface ContractRequest {
  id: string | null;
  status: ContractStatus;
  type: RequestType;
}
// We will get this from the saContainer
const selectedRequest: ContractRequest = {
  id: null,
  status: 'ANALYSTSCOPE',
  type: 'SUPPORT'
};

export const ContractForms = ({ initialState }) => {
  const [state, dispatch] = useReducer(contractReducer, initialState);

  useEffect(
    () => {
      const { type, status } = selectedRequest;
      const action: ContractAction = { type: status };
      type === 'CONTRACT' ? dispatch(action) : dispatch({ type: 'RESET' });
    },
    [selectedRequest]
  );

  const handleDispatch = (action: ContractAction) => {
    // TODO: Do some asynch stuff here to save the form details
    // Then we get the new request
    console.log(action.type);
    // Get the new status from the request and dipatch it to rerender the forms
    dispatch(action);
  };

  return (
    <div>
      <div className="f5">Contract Forms</div>

      <div>
        {contractActionTypes.map((x: ContractActionType) => (
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
