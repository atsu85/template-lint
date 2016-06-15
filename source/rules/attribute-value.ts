"use strict";

import {SAXParser} from 'parse5';
import {Rule} from '../rule';
import {ParseState} from '../parse-state';
import {Issue, IssueSeverity} from '../issue';

/**
 * Rule to ensure attribute values match a pattern
 */
export class AttributeValueRule extends Rule {
    private parseState: ParseState;

    patterns: Array<{ attr: RegExp, is?: RegExp, not?: RegExp, msg?: string, tag?:string }>

    constructor(patterns?: Array<{ attr: RegExp, is?: RegExp, not?: RegExp, msg?: string, tag?:string }>) {
        super();

        this.patterns = patterns ? patterns : []
    }

    init(parser: SAXParser, parseState: ParseState) {
        parser.on("startTag", (tag, attrs, selfClosing, loc) => {

            attrs.forEach(attr => {
                var pattern = this.patterns.find(x => {
                    if(x.tag && x.tag != tag)
                        return false;

                    return matches != attr.name.match(x.attr); 
                });

                if (pattern) {
                    var matches;
                    if (pattern.is != null) {
                        matches = attr.value.match(pattern.is);
                        if (matches == null || matches[0] != attr.value) {
                            let issue = new Issue({
                                message: pattern.msg || `attribute value doesn't match expected pattern`,
                                severity: IssueSeverity.Error,
                                line: loc.line,
                                column: loc.col,                              
                            });
                            this.reportIssue(issue);
                        }
                    } else if (pattern.not != null) {
                        matches = attr.value.match(pattern.not);
                        if (matches != null) {
                            let issue = new Issue({
                                message: pattern.msg || `attribute value matched a disallowed pattern`,
                                severity: IssueSeverity.Error,
                                line: loc.line,
                                column: loc.col
                            });
                            this.reportIssue(issue);
                        }
                    } else /* no value expected */ {
                        if (attr.value != "") {
                            let issue = new Issue({
                                message: pattern.msg || `attribute should not have a value`,
                                severity: IssueSeverity.Error,
                                line: loc.line,
                                column: loc.col
                            });
                            this.reportIssue(issue);
                        }
                    }
                }
            });
        });
    }
}