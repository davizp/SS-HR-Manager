// sanservices_absence - Last Update: Friday, December 19th, 2014, 9:41:57 AM CST
jQuery.base64=function(){function a(a,b){var c=f.indexOf(a.charAt(b));if(-1===c)throw"Cannot decode base64";return c}function b(b){var c,d,f=0,g=b.length,h=[];if(b=String(b),0===g)return b;if(g%4!==0)throw"Cannot decode base64";for(b.charAt(g-1)===e&&(f=1,b.charAt(g-2)===e&&(f=2),g-=4),c=0;g>c;c+=4)d=a(b,c)<<18|a(b,c+1)<<12|a(b,c+2)<<6|a(b,c+3),h.push(String.fromCharCode(d>>16,d>>8&255,255&d));switch(f){case 1:d=a(b,c)<<18|a(b,c+1)<<12|a(b,c+2)<<6,h.push(String.fromCharCode(d>>16,d>>8&255));break;case 2:d=a(b,c)<<18|a(b,c+1)<<12,h.push(String.fromCharCode(d>>16))}return h.join("")}function c(a,b){var c=a.charCodeAt(b);if(c>255)throw"INVALID_CHARACTER_ERR: DOM Exception 5";return c}function d(a){if(1!==arguments.length)throw"SyntaxError: exactly one argument required";a=String(a);var b,d,g=[],h=a.length-a.length%3;if(0===a.length)return a;for(b=0;h>b;b+=3)d=c(a,b)<<16|c(a,b+1)<<8|c(a,b+2),g.push(f.charAt(d>>18)),g.push(f.charAt(d>>12&63)),g.push(f.charAt(d>>6&63)),g.push(f.charAt(63&d));switch(a.length-h){case 1:d=c(a,b)<<16,g.push(f.charAt(d>>18)+f.charAt(d>>12&63)+e+e);break;case 2:d=c(a,b)<<16|c(a,b+1)<<8,g.push(f.charAt(d>>18)+f.charAt(d>>12&63)+f.charAt(d>>6&63)+e)}return g.join("")}var e="=",f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",g="1.0";return{decode:b,encode:d,VERSION:g}}(jQuery);