import { SuperAgent, SuperAgentRequest } from 'superagent';
/**
 * Adds a `.proxy(uri)` function to the "superagent" module's Request class.
 *
 * ``` js
 * var request = require('superagent');
 * require('superagent-proxy')(request);
 *
 * request
 *   .get(uri)
 *   .proxy(uri)
 *   .end(fn);
 * ```
 *
 * Or, you can pass in a `superagent.Request` instance, and it's like calling the
 * `.proxy(uri)` function on it, but without extending the prototype:
 *
 * ``` js
 * var request = require('superagent');
 * var proxy = require('superagent-proxy');
 *
 * proxy(request.get(uri), uri).end(fn);
 * ```
 *
 * @param {Object} superagent The `superagent` exports object
 * @api public
 */
export default function setup(superagent: any, uri?: string): SuperAgent<SuperAgentRequest> & {
    proxy: (uri?: string) => SuperAgent<SuperAgentRequest>;
};
