/* This is format.js

   Copyright (C) 2006-2013 Niels Giesen.

   Contact: <com dot gmail at nielsgiesen, in reversed order>

   Author: Niels Giesen
   Keywords: JavaScript, formatting, String

   This file is dual-licensed under either the BSD license or the
   GNU Affero General Public License.

   This JavaScript library implements the format directive found many
   programming languages. The definition is taken from the format
   function in Emacs, whose description --mildly adjusted-- bluntly
   follows here:

   syntax: format(STRING, OBJECTS)

   Format a string out of a format-string and arguments.
   The first argument is a format control string.
   The other arguments are substituted into it to make the result, a string.
   It may contain %-sequences meaning to substitute the next argument.
   %s means print a string argument.  Actually, prints any object, with `princ'.
   %d means print as number in decimal (%o octal, %x hex).
   %X is like %x, but uses upper case.
   %e means print a number in exponential notation.
   %f means print a number in decimal-point notation.
   %g means print a number in exponential notation
   or decimal-point notation, whichever uses fewer characters.
   %c means print a number as a single character.
   The argument used for %d, %o, %x, %e, %f, %g or %c must be a number.
   Use %% to put a single % into the output.

   The basic structure of a %-sequence is
   % <flags> <width> <precision> character
   where flags is [-+ #0]+, width is [0-9]+, and precision is .[0-9]+

   Actually, I do not know what the pound character (#) is for.

   The %S-expression, used to express S-expressions in Lisp, is
   absent, since we do not have S-expressions in JavaScript. Not
   really anyway.

   During development, I found out I wanted to say

   "arbitrary string".times(455)

   ...so I added that to String.prototype.

   Hack it back if you like.

   Then there is the lovely small function positionalFormat, that
   enables you to replace numbers enclosed in curly braces (C# format
   apparently) with positional arguments (that can be reused), like
   this:

   positionalFormat('argument { 1 } (or is it { 2 }, or { 0 }?) comes { 1 }',3,'first',1)

   evals to:

   "argument first (or is it 1, or 3?) comes first"

   for the rest, that one does not do anything fancy.
*/

function format(){
    var args = arguments;
    var i = 1;
    var replacement = '';
    return args[0].replace(/([^%]|^)%([-+ #0]*)([1-9]\d*)*\.?(\d*)?([dsfoxXegc])/g,
                           function (match,
                                     escape_char_or_string_begin,
                                     flags,
                                     padding,
                                     precision,
                                     type){
                               switch (type){
                               case 's':
                                   if (typeof args[i] == "number"){
                                       replacement = args[i++].toString();
                                       break;
                                   }
                                   replacement = args[i++];
                                   break;
                               case 'd':
                                   replacement = parseInt(args[i++]).toString();
                                   break;
                               case 'f':
                                   replacement = parseFloat(args[i++]).toFixed(precision);
                                   break;
                               case 'o':
                                   replacement = '0'+parseInt(args[i++]).toString(8);
                                   break;
                               case 'x':
                                   replacement = '0x'+parseInt(args[i++]).toString(16);
                                   break;
                               case 'X':
                                   replacement = '0X'+parseInt(args[i++]).toString(16).toUpperCase();
                                   break;
                               case 'e':
                                   replacement = parseFloat(args[i++]).toExponential();
                                   break;
                               case 'g':
                                   var possibility1 = parseFloat(args[i]).toExponential();
                                   var possibility2 = parseFloat(args[i]).toFixed(precision);
                                   replacement = (possibility1.length < possibility2.length)?possibility1:possibility2;
                                   i++;
                                   break;
                               case 'c':
                                   replacement = String.fromCharCode(parseInt(args[i++]));
                                   break;
                               }
                              if ((/\+/.test(flags))&&(!/^\-/.test(replacement))){
                                    replacement = '+'+replacement;
                              }
                              if (padding > replacement.length){
                                 if (/-/.test(flags)){
                                    replacement = replacement + ' '.times(padding - replacement.length);
                                 }
                                 else {
                                    if (/^\+?$/.test(flags)) flags = ' ';
                                    replacement = flags.times(padding - replacement.length) + replacement;
                                 }
                              }
                              return replacement;
                           });
};

String.prototype.times = function(multiplicator){
    var result = new Array(multiplicator);
    for (i=0;i<multiplicator;i++){
        result[i] = this;
    }
    return result.join('');
};

function positionalFormat (str){
    var args = arguments;
    return str.replace(/{\s*(\d+)\s*}/g, function(match, num){
            return args[parseInt(num)+1]||match;
        });
};

