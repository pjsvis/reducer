import * as React from "react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const markdown = `
| |
| --- |  --- |
 <i class="fa fa-user mr2" /></i> Requester: | Peter J Smith
 <i class="fa fa-calendar mr2" /></i>Submitted: | 12Sep19
 <i class="fa fa-check mr2" /></i>Status: | In Progress
`;
interface Props { }
export const List = (props: Props) => {
    return (
        <div className="mw5 bg-white br3 pa2 center mv1 ba b--black-10">
            <div className="tl">
                <i className="fa fa-tag fl mr2" />
                <h1 className="f4">List of stuff</h1>

            </div>
            <ReactMarkdown
                source={markdown}
                className="lh-copy measure f6 black-70"
                escapeHtml={false}
            />
        </div>
    );
};