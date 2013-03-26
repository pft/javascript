/*
 * Copyright (C) 2006-2013 Niels Giesen.
 *
 *    Contact: <com dot gmail at nielsgiesen, in reversed order>
 *
 *    Author: Niels Giesen
 *    Keywords: JavaScript, formatting, String
 *
 *    This file is dual-licensed under either the BSD license or the
 *    GNU Affero General Public License.
 *
 *    positionalFormat enables you to replace numbers enclosed in curly braces (C# format
 *    apparently) with positional arguments (that can be reused), like
 *    this:
 *
 *    positionalFormat('argument { 1 } (or is it { 2 }, or { 0 }?) comes { 1 }',3,'first',1)
 *
 *    evals to:
 *
 *    "argument first (or is it 1, or 3?) comes first"
 */
function positionalFormat (str){
    var args = arguments;
    return str.replace(/{\s*(\d+)\s*}/g, function(match, num){
            return args[parseInt(num)+1]||match;
        });
};
