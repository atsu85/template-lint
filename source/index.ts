"use strict";

export * from './linter';
export * from './parse-state';
export * from './parse-node';
export * from './rule';
export * from './issue';

export * from './rules/self-close';
export * from './rules/parser';
export * from './rules/obsolete-tag';
export * from './rules/obsolete-attribute';
export * from './rules/unique-id';
export * from './rules/attribute-value';

"use strict";

import {SelfCloseRule} from './rules/self-close'
import {ParserRule} from './rules/parser'
import {UniqueIdRule} from './rules/unique-id'

export var DefaultRules = [
    new SelfCloseRule(),
    new ParserRule(),
    new UniqueIdRule()
]