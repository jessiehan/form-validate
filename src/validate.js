/*
 * validate
 * https://github.com/jessiehan/form-validate
 *
 * Copyright (c) 2013 hpp
 * Licensed under the MIT license.
 */

(function($) {
	
	var regPattern={
		text:function(text){
			return $.trim(text).length===0?false:true;
		},
		mobile:function(mobile){
			return /^1[3-9]\d{9}$/.test(mobile);
		},
		email:function(email){
      	 	return /^(?:[a-z0-9]+[_\-+.]?)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i.test(email);
   	 	},
		date:function(date){
	        var reg = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/
	          , taste, d;

	        if (!reg.test(date)) return false;

	        taste = reg.exec(date);
	        year = +taste[1], month = +taste[3] - 1, day = +taste[5];
	        d = new Date(year, month, day);

	        return year === d.getFullYear() && month === d.getMonth() && day === d.getDate();
		},
		daterange:function(start,end){
			var valid=false;
			if(regPattern.date(start)&&regPattern.date(end)){
		        var reg = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/;
				var startArray=reg.exec(start);
				var endArray=reg.exec(end);
				var startTs=new Date(startArray[1],startArray[3]-1,startArray[5]).getTime();
				var endTs=new Date(endArray[1],endArray[3]-1,endArray[5]).getTime();
				
				if(endTs>startTs){
					valid=true;
				}
				
			}
			return valid;
		
		},
		price:function(price){
			return /^[0-9]+.?[0-9]*$/.test(price);
		},
		pricerange:function(start,end){
			var valid=false;
			if(regPattern.price(start)&&regPattern.price(end)){
				//console.log(parseFloat(end))
				//console.log(parseFloat(start))
				
				if(parseFloat(end)>parseFloat(start)){
					valid=true;
				}
			}
			return valid;
		},
		number:function(number){
			return /^[0-9]+$/.test(number);
		},
		numberrange:function(start,end){
			var valid=false;
			if(regPattern.number(start)&&regPattern.number(end)){
				if(parseFloat(end)>parseFloat(start)){
					valid=true;
				}
				
			}
			return valid;
		},
		radio:function($field){
			return $field.find('input:checked').length===1?true:false;
		},
		checkbox:function($field){
			return $field.find('input:checked').length>0?true:false;
		},
		select:function($field){
			return $field.find('select').val().length>0?true:false;
		}
		
		
		

		
	}
	



    // Collection method.
    $.fn.validate = function(options) {
		
    	var $form=this,
  	  		options=options||{},
			itemClass=options.itemClass||'item',
			requireName=options.requireName||'required',
			$submitBtn=options.$submitBtn||$('input.submit');
	 	   	validCallback=options.validCallback||function(){},
	  	  	unvalidCallback=options.unvalidCallback||function(){}; 
		 
	  	  
		
		//获取需要验证的表单项，一一验证
		function validateForm($form){
			var isValid=true;
			$form.find('.'+itemClass+'['+requireName+']').each(function(){
				if(!validateField($(this))){
					isValid=false;
				}	
				
			});
		
			if(isValid){
				validCallback();
			}else{
				unvalidCallback();
			}
		
		}
	
	
		function validateField($field){
			var type=$field.data('type');
			var isValid;
			if(type.indexOf('range')>=0){
				var start=$field.find('input:eq(0)').val();
				var end=$field.find('input:eq(1)').val();
				isValid=regPattern[type].call(this,start,end);
				
			}else if(type.indexOf('radio')>=0||type.indexOf('checkbox')>=0||type.indexOf('select')>=0){
				isValid=regPattern[type].call(this,$field);
				
			}else{
				var text=$field.find('input').val();
				isValid=regPattern[type].call(this,text);
			}

			if(!isValid){
				$field.addClass('error');
			}
			
		
			return isValid;
		
		}
	    
		var inputDom=$form.find('.'+itemClass+'['+requireName+'] input'+',.'+itemClass+'['+requireName+'] select');
		
		inputDom.focus(function(){
			$(this).parents('.'+itemClass).removeClass('error');
		});
		
		inputDom.blur(function(){
			validateField($(this).parents('.'+itemClass));
			
		});

		$submitBtn.click(function(){
	    	validateForm($form);
			
		});
  	 	
	
    };

 
 
 
 
 
 
 
 
 

}(jQuery));
