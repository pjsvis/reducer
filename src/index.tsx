import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';
import 'tachyons';
import clsx from 'clsx';
import { SomeComponent } from './SomeComponent';
import { Details } from './details';
import { List } from './list';
import { Form } from './form';
import { ContractForms, initialContractState } from './ContractForms';
import { SupportForms, initialSupportState } from './SupportForms';
import { AdviceForms, initialAdviceState } from './AdviceForms';
import { ObjectForms, initialObjectState } from './ObjectForms';

function App() {
  return (
    <div className="ma2">
      <div className="f5">Forms Layout using a reducer</div>
      <ol className="mt2 f6">
        <li>We layout out our forms here</li>
        <li>We show the forms according to the request type and status</li>
        <li>
          Click the buttons to see which forms are visible for different request
          statuses
        </li>
        <li>
          Looks like the max number of panels is 3 so we set a width of w-33
        </li>
        <li>If only one or two are showing then we center the group</li>
        <li>We can layout our tabs in a simlar manner based on userRole</li>
      </ol>

      <div className="mt2">
        <ContractForms initialState={initialContractState} />
      </div>
      <div className="mt2">
        <SupportForms initialState={initialContractState} />
      </div>
      <div className="mt2">
        <AdviceForms initialState={initialAdviceState} />
      </div>
      <div className="mt2">
        <ObjectForms initialState={initialAdviceState} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
