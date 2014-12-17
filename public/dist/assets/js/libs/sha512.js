// sanservices_absence - Last Update: Monday, December 15th, 2014, 4:36:44 PM CST
function hex_sha512(a){return rstr2hex(rstr_sha512(str2rstr_utf8(a)))}function b64_sha512(a){return rstr2b64(rstr_sha512(str2rstr_utf8(a)))}function any_sha512(a,b){return rstr2any(rstr_sha512(str2rstr_utf8(a)),b)}function hex_hmac_sha512(a,b){return rstr2hex(rstr_hmac_sha512(str2rstr_utf8(a),str2rstr_utf8(b)))}function b64_hmac_sha512(a,b){return rstr2b64(rstr_hmac_sha512(str2rstr_utf8(a),str2rstr_utf8(b)))}function any_hmac_sha512(a,b,c){return rstr2any(rstr_hmac_sha512(str2rstr_utf8(a),str2rstr_utf8(b)),c)}function sha512_vm_test(){return"ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"==hex_sha512("abc").toLowerCase()}function rstr_sha512(a){return binb2rstr(binb_sha512(rstr2binb(a),8*a.length))}function rstr_hmac_sha512(a,b){var c=rstr2binb(a);c.length>32&&(c=binb_sha512(c,8*a.length));for(var d=Array(32),e=Array(32),f=0;32>f;f++)d[f]=909522486^c[f],e[f]=1549556828^c[f];var g=binb_sha512(d.concat(rstr2binb(b)),1024+8*b.length);return binb2rstr(binb_sha512(e.concat(g),1536))}function rstr2hex(a){try{}catch(b){hexcase=0}for(var c,d=hexcase?"0123456789ABCDEF":"0123456789abcdef",e="",f=0;f<a.length;f++)c=a.charCodeAt(f),e+=d.charAt(c>>>4&15)+d.charAt(15&c);return e}function rstr2b64(a){try{}catch(b){b64pad=""}for(var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",d="",e=a.length,f=0;e>f;f+=3)for(var g=a.charCodeAt(f)<<16|(e>f+1?a.charCodeAt(f+1)<<8:0)|(e>f+2?a.charCodeAt(f+2):0),h=0;4>h;h++)d+=8*f+6*h>8*a.length?b64pad:c.charAt(g>>>6*(3-h)&63);return d}function rstr2any(a,b){var c,d,e,f,g,h=b.length,i=Array(Math.ceil(a.length/2));for(c=0;c<i.length;c++)i[c]=a.charCodeAt(2*c)<<8|a.charCodeAt(2*c+1);var j=Math.ceil(8*a.length/(Math.log(b.length)/Math.log(2))),k=Array(j);for(d=0;j>d;d++){for(g=Array(),f=0,c=0;c<i.length;c++)f=(f<<16)+i[c],e=Math.floor(f/h),f-=e*h,(g.length>0||e>0)&&(g[g.length]=e);k[d]=f,i=g}var l="";for(c=k.length-1;c>=0;c--)l+=b.charAt(k[c]);return l}function str2rstr_utf8(a){for(var b,c,d="",e=-1;++e<a.length;)b=a.charCodeAt(e),c=e+1<a.length?a.charCodeAt(e+1):0,b>=55296&&56319>=b&&c>=56320&&57343>=c&&(b=65536+((1023&b)<<10)+(1023&c),e++),127>=b?d+=String.fromCharCode(b):2047>=b?d+=String.fromCharCode(192|b>>>6&31,128|63&b):65535>=b?d+=String.fromCharCode(224|b>>>12&15,128|b>>>6&63,128|63&b):2097151>=b&&(d+=String.fromCharCode(240|b>>>18&7,128|b>>>12&63,128|b>>>6&63,128|63&b));return d}function str2rstr_utf16le(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c),a.charCodeAt(c)>>>8&255);return b}function str2rstr_utf16be(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(a.charCodeAt(c)>>>8&255,255&a.charCodeAt(c));return b}function rstr2binb(a){for(var b=Array(a.length>>2),c=0;c<b.length;c++)b[c]=0;for(var c=0;c<8*a.length;c+=8)b[c>>5]|=(255&a.charCodeAt(c/8))<<24-c%32;return b}function binb2rstr(a){for(var b="",c=0;c<32*a.length;c+=8)b+=String.fromCharCode(a[c>>5]>>>24-c%32&255);return b}function binb_sha512(a,b){void 0==sha512_k&&(sha512_k=new Array(new int64(1116352408,-685199838),new int64(1899447441,602891725),new int64(-1245643825,-330482897),new int64(-373957723,-2121671748),new int64(961987163,-213338824),new int64(1508970993,-1241133031),new int64(-1841331548,-1357295717),new int64(-1424204075,-630357736),new int64(-670586216,-1560083902),new int64(310598401,1164996542),new int64(607225278,1323610764),new int64(1426881987,-704662302),new int64(1925078388,-226784913),new int64(-2132889090,991336113),new int64(-1680079193,633803317),new int64(-1046744716,-815192428),new int64(-459576895,-1628353838),new int64(-272742522,944711139),new int64(264347078,-1953704523),new int64(604807628,2007800933),new int64(770255983,1495990901),new int64(1249150122,1856431235),new int64(1555081692,-1119749164),new int64(1996064986,-2096016459),new int64(-1740746414,-295247957),new int64(-1473132947,766784016),new int64(-1341970488,-1728372417),new int64(-1084653625,-1091629340),new int64(-958395405,1034457026),new int64(-710438585,-1828018395),new int64(113926993,-536640913),new int64(338241895,168717936),new int64(666307205,1188179964),new int64(773529912,1546045734),new int64(1294757372,1522805485),new int64(1396182291,-1651133473),new int64(1695183700,-1951439906),new int64(1986661051,1014477480),new int64(-2117940946,1206759142),new int64(-1838011259,344077627),new int64(-1564481375,1290863460),new int64(-1474664885,-1136513023),new int64(-1035236496,-789014639),new int64(-949202525,106217008),new int64(-778901479,-688958952),new int64(-694614492,1432725776),new int64(-200395387,1467031594),new int64(275423344,851169720),new int64(430227734,-1194143544),new int64(506948616,1363258195),new int64(659060556,-544281703),new int64(883997877,-509917016),new int64(958139571,-976659869),new int64(1322822218,-482243893),new int64(1537002063,2003034995),new int64(1747873779,-692930397),new int64(1955562222,1575990012),new int64(2024104815,1125592928),new int64(-2067236844,-1578062990),new int64(-1933114872,442776044),new int64(-1866530822,593698344),new int64(-1538233109,-561857047),new int64(-1090935817,-1295615723),new int64(-965641998,-479046869),new int64(-903397682,-366583396),new int64(-779700025,566280711),new int64(-354779690,-840897762),new int64(-176337025,-294727304),new int64(116418474,1914138554),new int64(174292421,-1563912026),new int64(289380356,-1090974290),new int64(460393269,320620315),new int64(685471733,587496836),new int64(852142971,1086792851),new int64(1017036298,365543100),new int64(1126000580,-1676669620),new int64(1288033470,-885112138),new int64(1501505948,-60457430),new int64(1607167915,987167468),new int64(1816402316,1246189591)));var c,d,e=new Array(new int64(1779033703,-205731576),new int64(-1150833019,-2067093701),new int64(1013904242,-23791573),new int64(-1521486534,1595750129),new int64(1359893119,-1377402159),new int64(-1694144372,725511199),new int64(528734635,-79577749),new int64(1541459225,327033209)),f=new int64(0,0),g=new int64(0,0),h=new int64(0,0),i=new int64(0,0),j=new int64(0,0),k=new int64(0,0),l=new int64(0,0),m=new int64(0,0),n=new int64(0,0),o=new int64(0,0),p=new int64(0,0),q=new int64(0,0),r=new int64(0,0),s=new int64(0,0),t=new int64(0,0),u=new int64(0,0),v=new int64(0,0),w=new Array(80);for(d=0;80>d;d++)w[d]=new int64(0,0);for(a[b>>5]|=128<<24-(31&b),a[(b+128>>10<<5)+31]=b,d=0;d<a.length;d+=32){for(int64copy(h,e[0]),int64copy(i,e[1]),int64copy(j,e[2]),int64copy(k,e[3]),int64copy(l,e[4]),int64copy(m,e[5]),int64copy(n,e[6]),int64copy(o,e[7]),c=0;16>c;c++)w[c].h=a[d+2*c],w[c].l=a[d+2*c+1];for(c=16;80>c;c++)int64rrot(t,w[c-2],19),int64revrrot(u,w[c-2],29),int64shr(v,w[c-2],6),q.l=t.l^u.l^v.l,q.h=t.h^u.h^v.h,int64rrot(t,w[c-15],1),int64rrot(u,w[c-15],8),int64shr(v,w[c-15],7),p.l=t.l^u.l^v.l,p.h=t.h^u.h^v.h,int64add4(w[c],q,w[c-7],p,w[c-16]);for(c=0;80>c;c++)r.l=l.l&m.l^~l.l&n.l,r.h=l.h&m.h^~l.h&n.h,int64rrot(t,l,14),int64rrot(u,l,18),int64revrrot(v,l,9),q.l=t.l^u.l^v.l,q.h=t.h^u.h^v.h,int64rrot(t,h,28),int64revrrot(u,h,2),int64revrrot(v,h,7),p.l=t.l^u.l^v.l,p.h=t.h^u.h^v.h,s.l=h.l&i.l^h.l&j.l^i.l&j.l,s.h=h.h&i.h^h.h&j.h^i.h&j.h,int64add5(f,o,q,r,sha512_k[c],w[c]),int64add(g,p,s),int64copy(o,n),int64copy(n,m),int64copy(m,l),int64add(l,k,f),int64copy(k,j),int64copy(j,i),int64copy(i,h),int64add(h,f,g);int64add(e[0],e[0],h),int64add(e[1],e[1],i),int64add(e[2],e[2],j),int64add(e[3],e[3],k),int64add(e[4],e[4],l),int64add(e[5],e[5],m),int64add(e[6],e[6],n),int64add(e[7],e[7],o)}var x=new Array(16);for(d=0;8>d;d++)x[2*d]=e[d].h,x[2*d+1]=e[d].l;return x}function int64(a,b){this.h=a,this.l=b}function int64copy(a,b){a.h=b.h,a.l=b.l}function int64rrot(a,b,c){a.l=b.l>>>c|b.h<<32-c,a.h=b.h>>>c|b.l<<32-c}function int64revrrot(a,b,c){a.l=b.h>>>c|b.l<<32-c,a.h=b.l>>>c|b.h<<32-c}function int64shr(a,b,c){a.l=b.l>>>c|b.h<<32-c,a.h=b.h>>>c}function int64add(a,b,c){var d=(65535&b.l)+(65535&c.l),e=(b.l>>>16)+(c.l>>>16)+(d>>>16),f=(65535&b.h)+(65535&c.h)+(e>>>16),g=(b.h>>>16)+(c.h>>>16)+(f>>>16);a.l=65535&d|e<<16,a.h=65535&f|g<<16}function int64add4(a,b,c,d,e){var f=(65535&b.l)+(65535&c.l)+(65535&d.l)+(65535&e.l),g=(b.l>>>16)+(c.l>>>16)+(d.l>>>16)+(e.l>>>16)+(f>>>16),h=(65535&b.h)+(65535&c.h)+(65535&d.h)+(65535&e.h)+(g>>>16),i=(b.h>>>16)+(c.h>>>16)+(d.h>>>16)+(e.h>>>16)+(h>>>16);a.l=65535&f|g<<16,a.h=65535&h|i<<16}function int64add5(a,b,c,d,e,f){var g=(65535&b.l)+(65535&c.l)+(65535&d.l)+(65535&e.l)+(65535&f.l),h=(b.l>>>16)+(c.l>>>16)+(d.l>>>16)+(e.l>>>16)+(f.l>>>16)+(g>>>16),i=(65535&b.h)+(65535&c.h)+(65535&d.h)+(65535&e.h)+(65535&f.h)+(h>>>16),j=(b.h>>>16)+(c.h>>>16)+(d.h>>>16)+(e.h>>>16)+(f.h>>>16)+(i>>>16);a.l=65535&g|h<<16,a.h=65535&i|j<<16}var hexcase=0,b64pad="",sha512_k;