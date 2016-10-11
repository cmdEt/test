
var BackData;
var TotalPage;
var pageSize = 10;

$(function (){
			
			jQuery.support.cors = true;  //ie8及低版本允许跨域

           $(document).ready(function() {
              $('#reservation').daterangepicker(null, function(start, end, label) {
                console.log(start.toISOString(), end.toISOString(), label);
              });
           });

             //获取当前时间    
	       window.onload = function()
			 {  
			 	var startTime2EndTime = "";
			 	var date = new Date();
                var time = new Array(date.getFullYear(),parseInt(date.getMonth())+1,date.getDate());
                var endTime = time.join("-");
			 	var startTime = FindStartTime(endTime);
			 	startTime2EndTime = SameFormat(startTime)+" ~ "+SameFormat(endTime);
			    document.getElementById("reservation").value = startTime2EndTime;
			 }

			 function FindStartTime(endTime){

                 var startTime = "";
                 var arr = endTime.split("-");
                 
                 if(arr[1] > 1){
                 arr[1] = parseInt(arr[1]) - 1;   //查询一个月的数据
                 if(parseInt(arr[2])>28){
                     arr[2] = parseInt(arr[2]) - 3;   
                 }
                 var list = new Array(arr[0],arr[1],arr[2]);
                 startTime =  list.join("-");
                 
               }
               else{

                  arr[0] = parseInt(arr[0]) - 1;
                  arr[1] = 12; 
                  if(parseInt(arr[2])>28){
                     arr[2] = parseInt(arr[2]) - 3;   
                 } 
                  var list = new Array(arr[0],arr[1],arr[2]);
               
                  startTime =  list.join("-");                
               }

               return  startTime;
			 }

              //时间统一格式
			 function SameFormat(time){
                 var arr = time.split("-");
                 if(arr[1]<10){
                 	arr[1] = 0 + arr[1];
                 }
                 if(arr[2]<10){
                 	arr[2] = 0 + arr[2];
                 }
                
                 var list = new Array(arr[0],arr[1],arr[2]);
                 return list.join("-");
                 
			 }

    //查询数据
    $("#btn").click(function(){
    	
        var tableName = "Testpolice";
        var pathTime = document.getElementById("reservation").value;
        var carType = document.getElementById("carType").value;
        var carNumber = document.getElementById("carNumber").value;
        alert(pathTime);
        alert(carType);
        alert(carNumber);
        $.ajax({  
	        url:"http://localhost:8080/xxzys/rest/test/test1",
	        cache:false,
	        method: "GET", 
	        dataType:"text",	
	        data: {"table":tableName,"time":pathTime,"Type":carType,"carNum":carNumber},
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
	        	        alert("加载数据失败!");
                        // alert(XMLHttpRequest.status);
                        // alert(XMLHttpRequest.readyState);
                        // alert(textStatus);
                    },
	        success:function(json) {

	        		var data = eval('(' + json + ')');
	        		console.log(data);
	        	    BackData = data;
                   $.each(BackData,function(key,val){   //获取总页数
	                   	if(val.length%pageSize==0){
	                     TotalPage = val.length/pageSize;	
	                    }
	                    else{
                         TotalPage = Math.ceil(val.length/pageSize);  //向上取整
	                    }
                   	
                   });
	               var tbody = "";
	               $('#tb').html("");     //清空table
	               $.each(BackData,function(key,val){
	               	 for(var i=0;i<pageSize;i++){ 
	               	 	  var tr = "<tr>";
	                   for(var a in val[i] ){				                   
				               tr +=  "<td>"+val[i][a]+"</td>";
	                         }
	                         tr +=  "</tr>";
	                         tbody += tr; 
	                       }
	                 	 });
		            if(TotalPage != 0){
		            $('#DictTypeTable').children('tbody').append(tbody);
		            getPageUI(TotalPage);
		         }
		         else{
		         	tbody = "<tr><td>暂无数据！</td></tr>"
		         	$('#DictTypeTable').children('tbody').append(tbody);     
		         }

	        }
	          
       });  
    });

function getData(e, originalEvent, type, page){

	              var tbody = "";
	               $('#tb').html("");     //清空table
	               $.each(BackData,function(key,val){
	               	 for(var i=(page-1)*pageSize;i<(page-1)*pageSize+pageSize;i++){
	               	 	  var tr = "<tr>";
	                   for(var a in val[i] ){				                  
				               tr +=  "<td>"+val[i][a]+"</td>";
	                         }
	                         tr +=  "</tr>";
	                         tbody += tr; 
	                       }
	                 	 });
	               	            
	            $('#DictTypeTable').children('tbody').append(tbody);
	           
	   
    }


       function getPageUI(TotalPage){   

        	var element = $('#pageUl');//获得数据装配的位置
        	//初始化所需数据
	        var options = {
	            bootstrapMajorVersion:3,//版本号。3代表的是第三版本
	            currentPage: 1, //当前页数
	            numberOfPages: 5, //显示页码数标个数
	            totalPages:TotalPage, //总共的数据所需要的总页数
	            itemTexts: function (type, page, current) {  
	            		//图标的更改显示可以在这里修改。
	            switch (type) {  
	                    case "first":  
	                        return "<<";  
	                    case "prev":  
	                        return "<";  
	                    case "next":  
	                        return ">";  
	                    case "last":  
	                        return ">>";  
	                    case "page":  
	                        return  page;  
	                }                 
	            }, 
            tooltipTitles: function (type, page, current) {
				//如果想要去掉页码数字上面的预览功能，则在此操作。例如：可以直接return。
                switch (type) {
		            case "first":
		                return "Go to first page";
		            case "prev":
		                return "Go to previous page";
		            case "next":
		                return "Go to next page";
		            case "last":
		                return "Go to last page";
		            case "page":
		                return (page === current) ? "Current page is " + page : "Go to page " + page;
		        }
            },
            onPageClicked: function (e, originalEvent, type, page) { 
               
                 //单击当前页码触发的事件。若需要与后台发生交互事件可在此通过ajax操作。page为目标页数。
                 getData(e, originalEvent, type, page);
            }
        };
        element.bootstrapPaginator(options);	//进行初始化
    }

    
});


