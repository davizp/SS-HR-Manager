// sanservices_absence - Last Update: Monday, December 15th, 2014, 4:36:44 PM CST
!function(a){var b={BACKSPACE:8,TAB:9,ENTER:13,ESCAPE:27,ARROW_UP:38,ARROW_DOWN:40,COMMA:188},c="tokenize";a.tokenize=function(b){void 0==b&&(b=a.fn.tokenize.defaults),this.options=b},a.extend(a.tokenize.prototype,{init:function(b){var c=this;this.select=b.attr("multiple","multiple").css({margin:0,padding:0,border:0}).hide(),this.container=a("<div />").attr("class",this.select.attr("class")).addClass("Tokenize"),1==this.options.maxElements&&this.container.addClass("OnlyOne"),this.dropdown=a("<ul />").addClass("Dropdown"),this.tokensContainer=a("<ul />").addClass("TokensContainer"),this.searchToken=a("<li />").addClass("TokenSearch").appendTo(this.tokensContainer),this.searchInput=a("<input />").attr("maxlength",this.options.searchMaxLength).appendTo(this.searchToken),this.container.append(this.tokensContainer).append(this.dropdown).insertAfter(this.select),this.tokensContainer.on("click",function(a){a.stopImmediatePropagation(),c.searchInput.get(0).focus(),c.dropdown.is(":hidden")&&""!=c.searchInput.val()&&c.search()}),this.searchInput.on("keydown",function(a){c.resizeSearchInput(),c.keydown(a)}),this.searchInput.on("keyup",function(a){c.keyup(a)}),this.searchInput.on("paste",function(){setTimeout(function(){c.resizeSearchInput()},10),setTimeout(function(){var b=c.searchInput.val().split(",");b.length>1&&a.each(b,function(a,b){c.tokenAdd(b.trim(),"")})},20)}),a(document).on("click",function(){c.dropdownHide(),1==c.options.maxElements&&c.searchInput.val()&&c.tokenAdd(c.searchInput.val(),"")}),this.resizeSearchInput(),a("option:selected",this.select).each(function(){c.tokenAdd(a(this).attr("value"),a(this).html(),!0)})},dropdownShow:function(){this.dropdown.show()},dropdownPrev:function(){a("li.Hover",this.dropdown).length>0?a("li.Hover",this.dropdown).is("li:first-child")?(a("li.Hover",this.dropdown).removeClass("Hover"),a("li:last-child",this.dropdown).addClass("Hover")):a("li.Hover",this.dropdown).removeClass("Hover").prev().addClass("Hover"):a("li:first",this.dropdown).addClass("Hover")},dropdownNext:function(){a("li.Hover",this.dropdown).length>0?a("li.Hover",this.dropdown).is("li:last-child")?(a("li.Hover",this.dropdown).removeClass("Hover"),a("li:first-child",this.dropdown).addClass("Hover")):a("li.Hover",this.dropdown).removeClass("Hover").next().addClass("Hover"):a("li:first",this.dropdown).addClass("Hover")},dropdownAddItem:function(b,c,d){if(void 0==d&&(d=c),a('li[data-value="'+b+'"]',this.tokensContainer).length)return!1;var e=this,f=a("<li />").attr("data-value",b).attr("data-text",c).html(d).on("click",function(b){b.stopImmediatePropagation(),e.tokenAdd(a(this).attr("data-value"),a(this).attr("data-text"))}).on("mouseover",function(){a(this).addClass("Hover")}).on("mouseout",function(){a("li",e.dropdown).removeClass("Hover")});return this.dropdown.append(f),!0},dropdownHide:function(){this.dropdownReset(),this.dropdown.hide()},dropdownReset:function(){this.dropdown.html("")},resizeSearchInput:function(){var b=a("<div />").css({position:"absolute",visibility:"hidden"}).addClass("TokenizeMeasure").html(this.searchInput.val());a("body").append(b),this.searchInput.width(b.width()+25),b.remove()},resetSearchInput:function(){this.searchInput.val(""),this.resizeSearchInput()},resetPendingTokens:function(){a("li.PendingDelete",this.tokensContainer).removeClass("PendingDelete")},keydown:function(c){if(c.keyCode==b.COMMA)c.preventDefault(),this.tokenAdd(this.searchInput.val(),"");else switch(c.keyCode){case b.BACKSPACE:0==this.searchInput.val().length&&(c.preventDefault(),a("li.Token.PendingDelete",this.tokensContainer).length?this.tokenRemove(a("li.Token.PendingDelete").attr("data-value")):a("li.Token:last",this.tokensContainer).addClass("PendingDelete"),this.dropdownHide());break;case b.TAB:case b.ENTER:if(a("li.Hover",this.dropdown).length){var d=a("li.Hover",this.dropdown);c.preventDefault(),this.tokenAdd(d.attr("data-value"),d.attr("data-text"))}else this.searchInput.val()&&(c.preventDefault(),this.tokenAdd(this.searchInput.val(),""));this.resetPendingTokens();break;case b.ESCAPE:this.resetSearchInput(),this.dropdownHide(),this.resetPendingTokens();break;case b.ARROW_UP:c.preventDefault(),this.dropdownPrev();break;case b.ARROW_DOWN:c.preventDefault(),this.dropdownNext();break;default:this.resetPendingTokens()}},keyup:function(a){if(a.keyCode!=this.options.validator)switch(a.keyCode){case b.TAB:case b.ENTER:case b.ESCAPE:case b.ARROW_UP:case b.ARROW_DOWN:break;case b.BACKSPACE:this.searchInput.val()?this.search():this.dropdownHide();break;default:this.searchInput.val()&&this.search()}},search:function(){var b=this,c=1;if(this.options.maxElements>0&&a("li.Token",this.tokensContainer).length>=this.options.maxElements)return!1;if("select"==this.options.datas){var d=!1,e=new RegExp(this.searchInput.val().replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i");this.dropdownReset(),a("option",this.select).not(":selected").each(function(){return c<=b.options.nbDropdownElements?void(e.test(a(this).html())&&(b.dropdownAddItem(a(this).attr("value"),a(this).html()),d=!0,c++)):!1}),d?(a("li:first",this.dropdown).addClass("Hover"),this.dropdownShow()):this.dropdownHide()}else a.ajax({url:this.options.datas,data:this.options.searchParam+"="+this.searchInput.val(),dataType:this.options.dataType,success:function(d){return d&&(b.dropdownReset(),a.each(d,function(a,d){if(!(c<=b.options.nbDropdownElements))return!1;var e=void 0;d[b.options.htmlField]&&(e=d[b.options.htmlField]),b.dropdownAddItem(d[b.options.valueField],d[b.options.textField],e),c++}),a("li",b.dropdown).length)?(a("li:first",b.dropdown).addClass("Hover"),b.dropdownShow(),!0):void b.dropdownHide()},error:function(a,b){console.log("Error : "+b)}})},tokenAdd:function(b,c,d){if(void 0==b||""==b)return!1;if((void 0==c||""==c)&&(c=b),void 0==d&&(d=!1),this.options.maxElements>0&&a("li.Token",this.tokensContainer).length>=this.options.maxElements)return this.resetSearchInput(),!1;var e=this,f=a("<a />").addClass("Close").html("&#215;").on("click",function(a){a.stopImmediatePropagation(),e.tokenRemove(b)});if(a('option[value="'+b+'"]',this.select).length)a('option[value="'+b+'"]',this.select).attr("selected","selected");else{if(!this.options.newElements)return this.resetSearchInput(),!1;var g=a("<option />").attr("selected","selected").attr("value",b).attr("data-type","custom").html(c);this.select.append(g)}return a('li.Token[data-value="'+b+'"]',this.tokensContainer).length>0?!1:(a("<li />").addClass("Token").attr("data-value",b).append("<span>"+c+"</span>").prepend(f).insertBefore(this.searchToken),d||this.options.onAddToken(b,c),this.resetSearchInput(),this.dropdownHide(),!0)},tokenRemove:function(b){var c=a('option[value="'+b+'"]',this.select);"custom"==c.attr("data-type")?c.remove():c.removeAttr("selected"),a('li.Token[data-value="'+b+'"]',this.tokensContainer).remove(),this.options.onRemoveToken(b),this.resizeSearchInput(),this.dropdownHide()}}),a.fn.tokenize=function(b){return void 0==b&&(b={}),this.each(function(){var d=new a.tokenize(a.extend({},a.fn.tokenize.defaults,b));d.init(a(this)),a(this).data(c,d)}),this},a.fn.tokenize.defaults={datas:"select",searchParam:"search",searchMaxLength:30,newElements:!0,nbDropdownElements:10,maxElements:0,dataType:"json",valueField:"value",textField:"text",htmlField:"html",onAddToken:function(){},onRemoveToken:function(){}}}(jQuery,"tokenize");