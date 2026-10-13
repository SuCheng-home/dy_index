var orgURL='';
var simpleOrgURL='';
var groupURL='';
var allDataURL='';
var isShowUserPart='';
var orgTarget='';//显示目标组织架构，all，depart，user  all部门和用户均可选择     depart可选择部门但用户不显示       user可选择用户但部门没有选择框
var orgRange='';//range manage表示管理范围，  release表示显示发布范围的组织架构
var departType='';
var singleChose='';
var inputRootIds='';
var isIgnoreDepart=false;
var seacherOlderValue='';
var dragging = false; 
var showUserType=1;//1代表父母,老师  2代表学生，老师，应对地址簿显示学生，如种子选手的需求
var iX, iY;
var otherSchool='';
var subDepartType = '';
var urlPrefix = '/wxcepClient/';
var addrUrlPrefix = location.href.indexOf('weixiaojia.net') !== -1 || location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net' : 'https://www.zhxiaoyuan.cn';

/**
 * 初始化绑定事件
 * @return {[type]} [description]
 */
function initAddressEvent(json){
    //头部事件绑定
    $('.wxcep-address-header-item').bind('click', function() {
        var index=$('.wxcep-address-header-item').index($(this));
           $('.wxcep-address-header-item').removeClass('header-active');
           $('.wxcep-address-header-item').eq(index).addClass('header-active');
           $('.wxcep-address-content-item').removeClass('content-active');
           $('.wxcep-address-content-item').eq(index).addClass('content-active');
    });
    //initAddressAjaxUrl();
    initAddressDataInIndex();
}

function loadWxcepAddress(initSourceHtml,loadWxcepAddress,json,callback){
        $('#wxcep-dialog').empty();
        var addressHtml=privateCreateAddressHtml(json);
        $('#wxcep-dialog').append(addressHtml);//加载模态框
        initAddressEvent(json);//初始化事件
        
        $('#wxcep-address-dailog').modal({//弹出模态框
                backdrop: 'static',
                keyboard: false
        });

        $('#btn-address-dialog').click(function() {
            privateAddressSure(loadWxcepAddress,callback); //点击确定按钮回调
        });
        $('#btn-address-dialog-cancel').click(function(){
        	offBindKey();//取消绑定事件
        });
        privateInitAddressHeader(initSourceHtml);//初始化头部选项
        privateInitSearchInput();
        InitSecondLoad();
        inputRootIds=getInputSearchRange();
        bindKey();//绑定键盘事件
        bindMouseMove();//绑定键盘事件
}


function privateCreateAddressHtml(json){
    json=eval(json);
    var showOrg=json.org==undefined;//判断是否显示组织架构
    var showGroup=json.group==undefined;//判断是否显示群组
    var titlebool=json.title==undefined;//判断是否自定义标题
    singleChose=json.SingleChose==undefined;//判断是否定义单选选项
    var title=json.title;//地址簿标题
    otherSchool=json.otherSchool==undefined?'':json.otherSchool
    var html='';
    if(showOrg==false){
    	isShowUserPart=true; 
    	orgRange=json.org.range;
    	orgTarget=json.org.target;
    }else{
    	isShowUserPart=false;
    }
    if(json.departType==undefined||json.departType=='all'){
    	departType='all';
    }else{
    	departType=json.departType;
    }
    if(json.subDepartType === undefined) {
        subDepartType = 'all';
    } else {
        subDepartType = json.subDepartType;
    }
    if(json.org.showUserType=='1'||json.org.showUserType==undefined){
    	showUserType='1';
    }else{
    	showUserType=json.org.showUserType;
    }
    if(json.isIgnoreDepart==true){
    	isIgnoreDepart=true;
    }
    // if(json.urlPrefix) {
    //     urlPrefix = json.urlPrefix;
    // }

    initAddressDataInIndex();
    html+='<div id="wxcep-address-dailog" class="modal fade" role="dialog" aria-labelledby="gridSystemModalLabel">';
    html+='<div class="modal-dialog" role="document" style="margin: 0; position: absolute;left: 35%;top: 20px;" id="address-body">';
    html+='<div class="modal-content">';
    html+='<div class="modal-header" id="address-header" style="cursor: move;">';
    html+='<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="offBindKey()";><span aria-hidden="true">&times;</span></button>';
    if(titlebool==true){
        html+='<h4 class="modal-title" id="gridSystemModalLabel">地址簿</h4>';
    }
    else{
        html+='<h4 class="modal-title" id="gridSystemModalLabel">'+title+'</h4>';
    }
    html+='</div>';  
    html+='<div class="modal-body">';
    /*添加内容START*/
    html+='<div>';
    html+='<div class="search-space">';
    html+='<div class="search-input" >';
    html+='</div>';
    html+='<div class="search-result">';
	html+='</div>';
    html+='<div id="search-point"></div>';
    html+='</div>';
    html+='<div class="wxcep-address-header">';
    html+='<ul>';
    if(showOrg==false){
        html+='<li class="wxcep-address-header-item header-active">组织架构</li>'; 
    }
    if(showGroup==false){
        if(showOrg==true){
            html+='<li class="wxcep-address-header-item header-active">常用组</li>';
        }else{
            html+='<li class="wxcep-address-header-item">常用组</li>';
        }
    }
    html+='</ul>';
    html+='</div>';          
    html+='<div class="wxcep-address-content">'; 
    if(showOrg==false){
        html+='<div class="wxcep-address-content-item content-active" >';      
        html+='<div class="wxcep-address-guide">';
        html+='<ul>';                       
        html+='<li>'; 
        html+='<a class="common-a-style">全部</a><input type="hidden" value="0" />';
        html+='</li>';                             
        html+= '</ul>';                     
        html+= '</div>';
        html+='<div class="wxcep-address-list">';                         
        html+='<ul class="wxcep-address-ul-org">';   
        var orgData=null;
        if(orgRange=='manage'){//如果显示所有
            orgData=JSON.parse(localStorage.getItem('allOrg'));

        }else if(orgRange=='release'){
            orgData=JSON.parse(localStorage.getItem('simpleOrg'));

        }else{
            //console.log('地址参数不正确：org='+orgRange);
        }
        //orgData={departs:[{id:'1001',name:'学生'},{id:'1002',name:'老师'}],users:[{'id':'2001',name:'张三',photoImg:''},{'id':'2001',name:'张四',photoImg:''}]};
        for(var i=0;i<orgData.departs.length;i++){//循环部门数据
        	if(orgTarget=='user'){
        		if(checkShowDepartBytype(orgData.departs[i].type)){
        			if(checkIsIgnoreDepartType(orgData.departs[i].type)){//控制当前的部门要不要显示checkbox
        				html+='<li ><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+orgData.departs[i].type+'" onclick="loadChildByPId('+orgData.departs[i].id+',this);">'+orgData.departs[i].name+'</a><input type="checkbox" class="addressInputHidden ignoreInput" value="0,'+orgData.departs[i].id+'" data-type="'+orgData.departs[i].type+'" data-wxdepartid="'+orgData.departs[i].wxDepartId+'" data-wxtagId="'+orgData.departs[i].wxTagId+'" data-loginname="'+orgData.departs[i].loginname+'" onchange="orgChosed(this);"></li>';
        			}else{
        				html+='<li ><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+orgData.departs[i].type+'" onclick="loadChildByPId('+orgData.departs[i].id+',this);">'+orgData.departs[i].name+'</a><input type="checkbox" class="addressInputHidden" value="0,'+orgData.departs[i].id+'"  data-type="'+orgData.departs[i].type+'" data-wxdepartid="'+orgData.departs[i].wxDepartId+'" data-wxtagId="'+orgData.departs[i].wxTagId+'" data-loginname="'+orgData.departs[i].loginname+'" onchange="orgChosed(this);"></li>';
        			}

        		}
        	}else{
        		if(checkShowDepartBytype(orgData.departs[i].type)){
        			if(checkIsIgnoreDepartType(orgData.departs[i].type)){//控制当前的部门要不要显示checkbox
        				html+='<li ><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+orgData.departs[i].type+'" onclick="loadChildByPId('+orgData.departs[i].id+',this);">'+orgData.departs[i].name+'</a><input type="checkbox" class="addressInput ignoreInput"  value="0,'+orgData.departs[i].id+'"  data-type="'+orgData.departs[i].type+'" data-wxdepartid="'+orgData.departs[i].wxDepartId+'" data-wxtagId="'+orgData.departs[i].wxTagId+'" data-loginname="'+orgData.departs[i].loginname+'" onchange="orgChosed(this);"></li>';
        			}else{
        				html+='<li ><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+orgData.departs[i].type+'" onclick="loadChildByPId('+orgData.departs[i].id+',this);">'+orgData.departs[i].name+'</a><input type="checkbox" class="addressInput" value="0,'+orgData.departs[i].id+'"  data-type="'+orgData.departs[i].type+'" data-wxdepartid="'+orgData.departs[i].wxDepartId+'" data-wxtagId="'+orgData.departs[i].wxTagId+'" data-loginname="'+orgData.departs[i].loginname+'" onchange="orgChosed(this);"></li>';
        			}
        		}
        	}
        }
        if(orgTarget!='depart'){
        	for(var i=0;i<orgData.users.length;i++){//循环用户数据
                html+='<li><img src="'+orgData.users[i].photoImg+'"><a>'+orgData.users[i].name+'</a><input type="checkbox" class="addressInput" value="1,'+orgData.users[i].id+'" data-wxdepartid="'+orgData.users[i].wxDepartId+'" data-mobile="'+orgData.users[i].mobile+'"  data-type="'+orgData.users[i].type+'"  data-wxtagId="'+orgData.users[i].wxTagId+'" data-loginname="'+orgData.users[i].loginname+'" onchange="orgChosed(this);"></li>';
           }
        }
        
        html+='</ul>';
        html+='</div>';
        
        if(singleChose==true){
        	html+='<div class="wxcep-address-user-checkAll">';
            html+='<span id="wxcep-address-user-checkAll">';
            html+='<label for="wxcep-address-user-checkAll-input">全选</label>';
            html+='<input id="wxcep-address-user-checkAll-input"  type="checkbox" class="addressInput" onclick="addressCheckOrg(this);"/>';
            html+='</span>';
            html+='</div>';
        }
        
        html+='</div>';   
    }           
    if(showGroup==false){
        if(showOrg==true){
            html+='<div class="wxcep-address-content-item content-active">';
        }else{
            html+='<div class="wxcep-address-content-item" >';
        }
        html+='<div class="wxcep-address-group-header"><span>全选</span></div>';
        html+='<div class="wxcep-address-list">';
        html+='<ul class="wxcep-address-ul-group">';
        var groupData=JSON.parse(localStorage.getItem('groupData'));
        for(var i=0;i<groupData.length;i++){
        	if(orgTarget=='user'){
        		html+='<li><img src="' + urlPrefix + 'resources/admin/images/group.png"  /><a href="javascript:void(0);" onclick="loadAddressGroupData('+groupData[i].id+',this);">'+groupData[i].name+'</a></li>';
        	}else{
        		html+='<li><img src="' + urlPrefix + 'resources/admin/images/group.png"  /><a href="javascript:void(0);" onclick="loadAddressGroupData('+groupData[i].id+',this);">'+groupData[i].name+'</a><input type="checkbox" class="addressInput" value="2,'+groupData[i].id+'" data-type="'+groupData[i].type+'" data-wxdepartid="'+groupData[i].wxDepartId+'" data-wxtagId="'+groupData[i].wxTagId+'" data-loginname="'+groupData[i].loginname+'" onchange="groupChosed(this);" /></li>';
        	}
             
        }
        html+='</ul>';
        html+='</div> ';
        if(singleChose==true){
        	 html+='<div class="wxcep-address-user-checkAll">';
             html+='<span id="wxcep-address-user-checkAll">';
             html+='<label for="wxcep-address-user-checkAll-input">全选</label>';
             html+='<input id="wxcep-address-user-checkAll-input"  type="checkbox" class="addressInput" onclick="addressCheckGrop(this);"/>';
             html+='</span>';
             html+='</div>';
        }
        html+='</div>';
    }                  
    html+='</div>';            
    html+= '</div>';   

    /*添加内容END*/
    html+='</div>';
    html+='<div class="modal-footer">';
    html+='<button type="button" id="btn-address-dialog-cancel" class="btn btn-default" data-dismiss="modal">取消</button>';
    html+='<button type="button" id="btn-address-dialog" class="btn btn-primary">确定</button>';
    html+='</div>';
    html+='</div>';
    html+='</div>';
    html+='</div>';
    return html;
}


/**
 * 地址簿添加群组
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function wxcepAddressAddGroup(obj){
    var currentIndex=$('.wxcep-address-groups input').index(obj);
    var currentValue=$(obj).val();
    var currentCheckState=$(obj).prop('checked');
    var currentgroupName=$('.wxcep-address-groups span').eq(currentIndex).text();
    if(currentCheckState==true){//如果是选中状态，则添加群组
        var groupHtml='<span class="search-item">';
        groupHtml+='<input type="hidden" value="2,'+currentValue+'" />';
        groupHtml+='<img src="' + urlPrefix + 'resources/admin/images/group.png" />';
        groupHtml+='<span class="search-item-des">'+currentgroupName+'</span>';
        groupHtml+='<span class="search-item-del" onclick="wxcepRemoveHeaderItem(this);"></span>'; 
        groupHtml+='</span>'; 
        $('.search-input').append(groupHtml);
    }
    else{//如果是非选中状态，则取消群组
        $('.search-item input').each(function(index) {
            if(currentValue==$(this).val().split(',')[1]){
                $('.search-item').eq(index).remove();
            }
        });
    }
    setToButtom();
    stopEventBubble();
}
/**
 * 地址簿添加用户
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function wxcepAddressAddUser(obj){
    var currentIndex=$('#wxcep-address-user-userlist input').index(obj);
    var currentValue=$(obj).val();
    var currentCheckState=$(obj).prop('checked');
    var currentUserName=$('#wxcep-address-user-userlist span').eq(currentIndex).text();
    var currentImgSrc=$('#wxcep-address-user-userlist img').eq(currentIndex).prop('src');
    if(currentCheckState==true){//如果是选中状态，则添加人员
        var userHtml='<span class="search-item">';
        userHtml+='<input type="hidden" value="1,'+currentValue+'" />';
        userHtml+='<img src="'+currentImgSrc+'" />';
        userHtml+='<span class="search-item-des">'+currentUserName+'</span>';
        userHtml+='<span class="search-item-del" onclick="wxcepRemoveHeaderItem(this);"></span>'; 
        userHtml+='</span>'; 
        $('.search-input').append(userHtml);
    }
    else{//如果是非选中状态，则取消人员
        $('.search-item input').each(function(index) {
            if(currentValue==$(this).val().split(',')[1]){
                $('.search-item').eq(index).remove();
            }
        });
    }
    setToButtom();
    stopEventBubble();
}

//移除地址簿头部的选项
function wxcepRemoveHeaderItem(obj){
    var currentIndex=$('.search-item-del').index($(obj));
    var currentItemValue= $('.search-item input').eq(currentIndex).val();
    $('.search-item').eq(currentIndex).remove();//删除自身
    var addressItems=$('.wxcep-address-list input:checked');
    for(var i=0;i<addressItems.length;i++){
    	if(currentItemValue==addressItems.eq(i).val()){
    		//console.log(addressItems.eq(i).val());
    		addressItems.eq(i).prop('checked',false);
    		break;
    	}
    	
    }
    privateInitSearchInput();

}

/**
 * 用于设置地址簿头部向下滚动至底部
 */
function setToButtom(){
    document.getElementById('search-point').scrollIntoView(false);
}

/**
 * 点击整行选择群组事件
 */
function wxcepGroupClick(obj){
    var currentIndex=   $('.wxcep-address-group').index($(obj));
    $('.wxcep-address-group input').eq(currentIndex).click();

}

/**
 * 点击整行选择用户事件
 */
function excepChoseUser(obj){
    var currentIndex= $('#wxcep-address-user-userlist li').index($(obj));
    $('#wxcep-address-user-userlist li input').eq(currentIndex).click();
}



//阻止事件冒泡
function stopEventBubble(){
     var e=getEvent();
        if(window.event){
            e.cancelBubble=true;//阻止冒泡
         }else if(e.preventDefault){
            e.stopPropagation();//阻止冒泡
         }
}


//得到事件
function getEvent(){
     if(window.event)    {return window.event;}
     func=getEvent.caller;
     while(func!=null){
         var arg0=func.arguments[0];
         if(arg0){
             if((arg0.constructor==Event || arg0.constructor ==MouseEvent
                || arg0.constructor==KeyboardEvent)
                ||(typeof(arg0)=="object" && arg0.preventDefault
                && arg0.stopPropagation)){
                 return arg0;
             }
         }
         func=func.caller;
     }
     return null;
}


/**
 * 地址簿选择组织架构时全选反选
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function addressCheckOrg(obj  ){
    if($(obj).prop('checked')){
        $('.wxcep-address-ul-org input').each(function(index) {
            if($(this).prop('checked')==false&&$(this).css('display')!='none'){
                $(this).click();
            }
        });
    }else{
         $('.wxcep-address-ul-org input').each(function(index) {
            if($(this).prop('checked')&&$(this).css('display')!='none'){
                $(this).click();
            }
        });
    }
    
}

/**
 * 地址簿选择组织架构时全选反选
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function addressCheckGrop(obj  ){
    if($(obj).prop('checked')){
        $('.wxcep-address-ul-group input').each(function(index) {
            if($(this).prop('checked')==false){
                $(this).click();
            }
        });
    }else{
         $('.wxcep-address-ul-group input').each(function(index) {
            if($(this).prop('checked')){
                $(this).click();
            }
        });
    }
    
}

/**
 * 地址簿检索鼠标进入
 * @return {[type]} [description]
 */
function addressSearchMouseOver(obj){
    $(obj).addClass('search-result-chosed');

}

/**
 * 地址簿检索鼠标离开
 * @return {[type]} [description]
 */
function addressSeachMouseOut(obj){
     $(obj).removeClass('search-result-chosed');

}

function addressSeachChose(obj){
    var currentIndex=$('.search-result li').index($(obj));
    var currentInputObj=$('.search-result input[type=hidden]').eq(currentIndex);
    var currentValue=currentInputObj.val();
    var currentLoginName=currentInputObj.attr('data-loginname');
    var mobile=currentInputObj.attr('data-mobile');
    var type=currentInputObj.attr('data-type');
    var currentImgSrc=$('.search-result img').eq(currentIndex).prop('src');
    var currentUserName=$('.search-result span').eq(currentIndex).text();
    var userHtml='<span class="search-item">';
        userHtml+='<input type="hidden" value="1,'+currentValue+'" data-type="'+type+'" data-wxdepartid="0" data-wxtagId="0" data-mobile="'+mobile+'" data-loginname="'+currentLoginName+'"/>';
        userHtml+='<img src="'+currentImgSrc+'" />';
        userHtml+='<span class="search-item-des">'+currentUserName+'</span>';
        userHtml+='<span class="search-item-del" onclick="wxcepRemoveHeaderItem(this);"></span>'; 
        userHtml+='</span>'; 
    $('#wxcep-address-searchValue').remove();
    if(singleChose==false){
    	$('.search-input').empty();
    }
    $('.search-input').append(userHtml);
    $('.search-input').append('<input type="text" autocomplete="off"  name="address-serach" value="" id="wxcep-address-searchValue" onkeyup="addressSerachInput();"  />')
    $('#wxcep-address-searchValue').val(' ').focus();
    $('.search-result').hide().empty();
    
    initChosedItems();	
}

/**
 * 地址簿的点击确定按钮
 * @return {[type]} [description]
 */
function privateAddressSure(loadAddressSourceId,callback){
    if(typeof callback=='function'){
        var departs='';
        var users='';
        var groups='';
        var jsondata='';
        var sourceData='';
        var jsondataContaintWx='';
        var html='';
        var searchImg=$('.search-input img');//获取所有的图片
        var searchSpan=$('.search-item-des');//获取所有文本内容
        var departArray=new Array();
        var userArray=new Array();
        var groupArray=new Array();
        $('.search-input input[type="hidden"]').each(function(index) {
        	var itemParent=$(this).parent();
        	var imgsrc=itemParent.find('img').attr('src');
        	var name=itemParent.find('.search-item-des').text();
            var arryitem=$(this).val().split(',');
            var wxDepartId=$(this).attr('data-wxdepartid');
        	var wxtagId=$(this).attr('data-wxtagId');
        	var mobile= $(this).attr('data-mobile');
        	var loginname=$(this).attr('data-loginname');
        	var type=$(this).attr('data-type');
        	if(type==undefined||type=='undefined'){
        		type=-1;
        	}
        	if(wxDepartId==undefined||wxDepartId=='undefined'){
        		wxDepartId='';
        	}
        	if(wxtagId==undefined||wxtagId=='undefined'){
        		wxtagId='';
        	}
        	if(mobile==undefined||mobile=='undefined'){
        		mobile='';
        	}
        	if(loginname==undefined||loginname=='undefined'){
        		loginname='';
        	}
            switch(arryitem[0]){
                case '0':
                      departs+=arryitem[1]+',';
                      departArray.push({'id':arryitem[1],'wxDepartId':wxDepartId,'name':name,'imgsrc':imgsrc,'type':type});
                      break;
                case '1':
                      users+=arryitem[1]+',';
                      userArray.push({'id':arryitem[1],'loginname':loginname,'name':name,'avatar':imgsrc,'mobile':mobile,'type':type});
                      break;
                case '2':
                      groups+=arryitem[1]+',';
                      groupArray.push({'id':arryitem[1],'wxtagId':wxtagId,'name':name,'imgsrc':imgsrc,'type':type});
                      break;
            }
            html+='<span class="address-source-item">';
            html+='<img src="'+searchImg.eq(index).prop('src')+'">';
            html+='<input type="hidden" value="'+$(this).val()+'" data-type="'+type+'" data-wxdepartid="'+wxDepartId+'" data-wxtagId="'+wxtagId+'" data-mobile="'+mobile+'" data-loginname="'+loginname+'">';
            html+='<span class="address-source-item-des">'+searchSpan.eq(index).text()+'</span>';
            html+='</span>';
        });
        jsondata='{dapart:['+departs+'],user:['+users+'],group:['+groups+']}';
        sourceData={'id':loadAddressSourceId,'html':html};
        jsondataContaintWx={'dapart':departArray,'user':userArray,'group':groupArray};
        // console.log(jsondataContaintWx);
        callback(sourceData,jsondata,jsondataContaintWx);
        $('#wxcep-address-dailog').modal('hide');
    }
    else{
        //console.log('地址簿按钮定义的回调方法不是函数！');
    }
    offBindKey();//关闭绑定事件
}

/**
 * 初始化地址簿头部
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
function privateInitAddressHeader(html){
    
    //console.log(html);
    $('.search-input').empty().append(html);

}

/**
 * 初始化地址簿ajax的请求路径（部门ajax，用户ajax）
 * @return {[type]} [description]
 */
function initAddressAjaxUrl(){
    //运用ajax的方式获取json数据，注因为此方法要赋值全局变量，使用getJSON是不支持讲ajax同步的
    /*$.ajax({
        url: 'resources/template/address3.json',
       // url: 'address3.json',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(data){
            orgURL=data.orgURL;
            groupURL=data.groupURL;
            simpleOrgURL=data.simpleOrgURL;
            allDataURL=data.allDataURL;
        }
    });*/
	 orgURL= 'depart/departChild';
     groupURL= urlPrefix + 'groups/usersByGroup';
     simpleOrgURL= urlPrefix +  'depart/release';
    allDataURL= addrUrlPrefix + '/ucenter-web/api/address/init';
}



/**
 * 处理用户数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function privateDealUserData(data){
    var headerItems=$('.search-item input');
    var html='';
    for (var i=0;i<data.data.length;i++) {
        var numFlag=0;
        html+='<li onclick="excepChoseUser(this)">'; 
        html+='<img src="'+data.data[i].photoImg+'"  />';       
        html+='<span>'+data.data[i].name+'</span>';  
        headerItems.each(function(index) {
            if($(this).val().split(',')[1]==data.data[i].id){
                numFlag++;
                html+='<input class="addressInput" type="checkbox" value="1,'+data.data[i].id+'" checked="checked" onclick="wxcepAddressAddUser(this);">'; 
                return false;
            }
        }); 
        if(numFlag==0){
            html+='<input class="addressInput" type="checkbox" value="1,'+data.data[i].id+'" onclick="wxcepAddressAddUser(this);">';        
        }
        html+='</li>';
    };
    if(data.data.length==0){
        html+='<li>当前部门不存在用户！</li>'; 
    }
    
    $('#wxcep-address-user-userlist').empty().append(html);
}






/**
 * 组装检索内容
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
function privateSearchPackage(json){
	//console.log('开始检索');
    var html='<ul>';
    for (var i=0;i<json.data.length;i++) {
    	if(i==0){
    	  html+='<li onmouseover="addressSearchMouseOver(this);"  onmouseout="addressSeachMouseOut(this);" onclick="addressSeachChose(this);" class="search-result-chosed">';
    	}else{
    		html+='<li onmouseover="addressSearchMouseOver(this);"  onmouseout="addressSeachMouseOut(this);" onclick="addressSeachChose(this);">';
    	}
        html+='<img src="'+json.data[i].photoImg+'" />';
        html+='<span>'+json.data[i].name+'</span>';                          
        html+='<input type="hidden" value="'+json.data[i].id+'" data-mobile="'+json.data[i].mobile+'" data-type="'+json.data[i].type+'"  data-wxdepartid="0" data-wxtagId="0" data-loginname="'+json.data[i].loginname+'"/>';        
        html+='<input type="text" value=""/>'; 
        html+='</li>';                            
    };
    html+='</ul>';
   // console.log('拼接的html：'+html);
    $('.search-result').empty().append(html).show();
   // console.log('清空加输出html');
    gotoTop4Search();

}


/**
 * 新的方法
 */
/**
 * 在首页初始化地址簿数据
 * @return {[type]} [description]
 */
function initAddressDataInIndex(){
	initAddressAjaxUrl();
	var allData=null;
    $.ajax({
        url: allDataURL,
        type: 'GET',
        dataType: 'json',
        global: false,
        async: false,
        data: {
            token: window.token
        },
        success:function(data){
        	allData=data.data;
        	localStorage.setItem('allOrg',JSON.stringify(allData.school));
            localStorage.setItem('simpleOrg',JSON.stringify({
                departs: allData.departs,
                users: allData.users
            }));
            localStorage.setItem('groupData',JSON.stringify(allData.groups));
        	
        },error:function(XMLHttpRequest, textStatus, errorThrown){
                //console.log('地址簿获取所有数据失败！出错描述：'+'XMLHttpRequest：'+XMLHttpRequest+'textStatus：'+textStatus+'errorThrown：'+errorThrown);
        }
    });
   
    
    
}

/**
 * 根据当前id获取子元素集合
 * @param  {[type]} departId [description]
 * @return {[type]}          [description]
 */
function loadChildByPId(departId,obj){
	var departType=$(obj).attr('data-type');
    $.ajax({
        url: addrUrlPrefix + '/ucenter-web/api/address/queryByDepartId',
        type: 'POST',
        dataType: 'json',
        data: {token: window.token, departId: departId, userTypes :showUserType},
        global: false,
        success:function(data){
        	var currentIndex=$('.wxcep-address-ul-org a').index(obj);
        	var checkedFlag= $('.wxcep-address-ul-org input').eq(currentIndex).prop('checked');
            var currentName=$(obj).text();
            packageChildOrgData(data.data,checkedFlag);//组装子组织架构数据
            rewriteGuide(departId,currentName,departType);//重写地址簿组织架构上的导航
            gotoTop();

        },error:function(XMLHttpRequest, textStatus, errorThrown){
                //console.log('地址簿获取下层数据失败！出错描述：'+'XMLHttpRequest：'+XMLHttpRequest+'textStatus：'+textStatus+'errorThrown：'+errorThrown);
        }
    });
}

/**
 * 根据当前id获取子元素集合
 * @param  {[type]} departId [description]
 * @return {[type]}          [description]
 */
function loadChildByPId4Guid(departId,departType){
    $.ajax({
        url: addrUrlPrefix + '/ucenter-web/api/address/queryByDepartId',
        type: 'GET',
        dataType: 'json',
        data: {token: window.token, departId: departId, userTypes :showUserType},
        global: false,
        success:function(data){
            packageChildOrgData(data.data,false);//组装子组织架构数据
        },error:function(XMLHttpRequest, textStatus, errorThrown){
                //console.log('地址簿获取下层数据失败！出错描述：'+'XMLHttpRequest：'+XMLHttpRequest+'textStatus：'+textStatus+'errorThrown：'+errorThrown);
        }
    });
}

/**
 * 组装子组织架构数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function packageChildOrgData(data,checkedFlag){
    var childDepartData=data.departs;
    var childUserData=data.users;
    var html='';
    if(childDepartData.length==0&&childUserData.length==0){
    	html+='<li>暂无人员数据！</li>';
    }
    else{
    	var headerItems=$('.search-item input');
    	for (var i=0;i<childDepartData.length;i++) {
//          console.log(childDepartData[i])
    		if(checkedFlag==true){
    			 var checkHtml='checked="true" disabled';
    			 if(orgTarget=='user'){
    				 if(checkShowDepartBytype(childDepartData[i].type)){
    					 if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
    						 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInputHidden" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
    					 }else{
    						 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInputHidden" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
    					 }
    					 
    				 }
    			}else{
    				 if(orgTarget=='depart'){
    					 if(childDepartData[i].hasChild=='1'){
	    						 if(checkShowDepartBytype(childDepartData[i].type)){
	    							 if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
	    								 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
	    							 }else{
	    								 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
	    							 }
	    							 
	    						 }
    						 }else{
    							 if(checkShowDepartBytype(childDepartData[i].type)){
    								 if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
    									 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" class="nochild4depart">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
    								 }else{
    									 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" class="nochild4depart">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
    								 }
    								 
    							 }
    					}
    				 }else{
    					 if(checkShowDepartBytype(childDepartData[i].type)){
    						 if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
    							 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
    						 }else{
    							 html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
    						 }
    					
    					 }
    				 }
    			 }
    			
    		}else{
    			if(orgTarget=='user'){
    				if(checkShowDepartBytype(childDepartData[i].type)){
    					if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
    						html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox"  class="addressInputHidden ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
    					}else{
    						html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox"  class="addressInputHidden" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
    					}
    					
    				}
    			}else{
    				var numFlag=0;
	       			 headerItems.each(function(index) {
	       				 if($(this).val().split(',')[1]==childDepartData[i].id){
	       		                numFlag++;
	       		                if(orgTarget=='depart'){
	       		                	if(childDepartData[i].hasChild=='1'){
	       		                		if(checkShowDepartBytype(childDepartData[i].type)){
	       		                			if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
	       		                				html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" checked="true" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
	       		                			}else{
	       		                				html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" checked="true" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
	       		                			}
	       		                			
	       		                		}
	       		                	}else{
	       		                		if(checkShowDepartBytype(childDepartData[i].type)){
	       		                			if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
	       		                				html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" class="nochild4depart">'+childDepartData[i].name+'</a><input type="checkbox" checked="true" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
	       		                			}else{
	       		                				html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" class="nochild4depart">'+childDepartData[i].name+'</a><input type="checkbox" checked="true" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'" data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
	       		                			}
	       		                			
	       		                		}
	       		                	}
	       		                }else{
	       		                	if(checkShowDepartBytype(childDepartData[i].type)){
	       		                		if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
	       		                			html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" checked="true" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'"  data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
	       		                		}else{
	       		                			html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" checked="true" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'"  data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
	       		                		}
	       		                		
	       		                	}
	       		                }
	       		                
	       		                return false;
	       		          }
	       			 });
       			 if(numFlag==0){
       				 if(orgTarget=='depart'){
       					 if(childDepartData[i].hasChild=='1'){
       						if(checkShowDepartBytype(childDepartData[i].type)){
       							if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
       								html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
       							}else{
       								html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
       							}
       							
       						}
       					 }else{
       						if(checkShowDepartBytype(childDepartData[i].type)){
       							if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
       								html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" class="nochild4depart">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
       							}else{
       								html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" class="nochild4depart">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput" value="0,'+childDepartData[i].id+'"data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'" data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
       							}
       						}
       					 }
       				 }else{
       					if(checkShowDepartBytype(childDepartData[i].type)){
       						if(checkIsIgnoreDepartType(childDepartData[i].type)){//控制当前的部门要不要显示checkbox
       							html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput ignoreInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'"  data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
       						}else{
       							html+='<li><img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png"><a data-type="'+childDepartData[i].type+'" onclick="loadChildByPId('+childDepartData[i].id+',this);">'+childDepartData[i].name+'</a><input type="checkbox" class="addressInput" value="0,'+childDepartData[i].id+'" data-type="'+childDepartData[i].type+'" data-wxdepartid="'+childDepartData[i].wxDepartId+'" data-wxtagId="'+childDepartData[i].wxTagId+'"  data-mobile="'+childDepartData[i].mobile+'"  data-loginname="'+childDepartData[i].loginname+'" onchange="orgChosed(this);"></li>';
       						}
       						
       					}
       				 }
       				 
       			 }
    			}
    			 
    		}
           
    		
        };
        
        
        if(orgTarget!='depart'){
        	for (var i=0;i<childUserData.length;i++) {
            	if(checkedFlag==true){
            		var checkHtml='checked="true" disabled';
            		 html+='<li><img src="'+childUserData[i].photoImg+'"><a>'+childUserData[i].name+'</a><input type="checkbox" class="addressInput" value="1,'+childUserData[i].id+'" ddata-type="'+childUserData[i].type+'" data-wxdepartid="'+childUserData[i].wxDepartId+'" data-wxtagId="'+childUserData[i].wxTagId+'" data-mobile="'+childUserData[i].mobile+'"  data-loginname="'+childUserData[i].loginname+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
            	}else
            		{
    		        	 //var headerItems=$('.search-item input');
    		   			 var numFlag=0;
    		   			 headerItems.each(function(index) {
    		   				 if($(this).val().split(',')[1]==childUserData[i].id){
    		   		                numFlag++;
    		   		                html+='<li><img src="'+childUserData[i].photoImg+'"><a>'+childUserData[i].name+'</a><input type="checkbox" checked="true" class="addressInput" value="1,'+childUserData[i].id+'" data-type="'+childUserData[i].type+'" data-wxdepartid="'+childUserData[i].wxDepartId+'" data-wxtagId="'+childUserData[i].wxTagId+'" data-mobile="'+childUserData[i].mobile+'"  data-loginname="'+childUserData[i].loginname+'" onchange="orgChosed(this);" ></li>';
    		   		                return false;
    		   		          }
    		   			 });
    		   			 if(numFlag==0){
    		   				html+='<li><img src="'+childUserData[i].photoImg+'"><a>'+childUserData[i].name+'</a><input type="checkbox" class="addressInput" value="1,'+childUserData[i].id+'" data-type="'+childUserData[i].type+'" data-wxdepartid="'+childUserData[i].wxDepartId+'" data-wxtagId="'+childUserData[i].wxTagId+'" data-mobile="'+childUserData[i].mobile+'"  data-loginname="'+childUserData[i].loginname+'" onchange="orgChosed(this);" ></li>';
    		   			 }
            		}
                //html+='<li><img src="'+childUserData[i].photoImg+'"><a>'+childUserData[i].name+'</a><input type="checkbox" class="addressInput" value="1,'+childUserData[i].id+'" onchange="orgChosed(this);" '+checkHtml+'></li>';
            };
        }
        
    }
    $('.wxcep-address-ul-org').empty().append(html);

}

/**
 * 重写地址簿组织架构上的导航
 * @param  {[type]} id   [description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function rewriteGuide(id,name,departType){
    $('.wxcep-address-guide ul').append('<li><a class="common-a-style">'+name+'</a><input type="hidden" value="'+id+'"></li>');
    var  guideItems=$('.wxcep-address-guide ul li');
    var  nameItems=$('.wxcep-address-guide ul li a');
    var  guideIdItems=$('.wxcep-address-guide ul li input');
    //guideItems.eq(0).empty().append('<a href="javascript:void(0);" onclick="getRootOrg();">全部<span>></span></a>');
    for(var i=0;i<guideItems.length-1;i++){
        if(i==0){
            guideItems.eq(i).empty().append('<a href="javascript:void(0);" onclick="getRootOrg();">全部</a><span>></span><input type="hidden" value="0" />');
        }
        else{
        	var currentId=guideIdItems.eq(i).val();
            var currentName=nameItems.eq(i).text();
            guideItems.eq(i).empty().append('<a href="javascript:void(0);" data-type="'+departType+'" onclick="loadGuideByClick('+currentId+',this);">'+currentName+'</a><span>></span><input type="hidden" value="'+currentId+'" />');
        }
    }
   
}

/**
 * 获取根部门的组织架构
 * @return {[type]} [description]
 */
function getRootOrg(){
	//var headerItems=$('.search-item input');
	
	
    
    var orgData=null;
    if(orgRange=='manage'){
    	orgData=JSON.parse(localStorage.getItem('allOrg'));
    }else{
    	orgData=JSON.parse(localStorage.getItem('simpleOrg'));
    }
    packageChildOrgData(orgData,false);//组装子组织架构数据
    $('.wxcep-address-guide ul').empty().append('<li>全部</li>')
}

/**
 * 点击地址簿组织架构导航
 * @return {[type]} [description]
 */
function loadGuideByClick(departId,obj){
    var currentIndex=$('.wxcep-address-guide ul li a').index(obj);
    var departType=$(obj).attr('data-type');
    $('.wxcep-address-guide ul li').eq(currentIndex).empty().append('<a class="common-a-style">'+$(obj).text()+'</a><input type="hidden" value="'+departId+'">');
    $('.wxcep-address-guide ul li').eq(currentIndex).nextAll().remove();
    loadChildByPId4Guid(departId,departType);
    gotoTop();

}

/**
 * 组织架构选择
 * @param  {[type]} obg [description]
 * @return {[type]}     [description]
 */
function orgChosed(obj){

    var currentobj=$(obj);//获取当前对象
    var currentArry=currentobj.val().split(',');//拆分数组
    var currentIndex=$('.wxcep-address-list input').index(currentobj);//获取当前索引
    var currentName=$('.wxcep-address-list a').eq(currentIndex).text();
    var wxDepartId=currentobj.attr('data-wxdepartid');
    var wxTagId=currentobj.attr('data-wxtagid');
    var loginname=currentobj.attr('data-loginname');
    var mobile=currentobj.attr('data-mobile');
    var type=currentobj.attr('data-type');
    if(currentArry[0]=='0'){//如果是部门
        if(currentobj.prop('checked')==true){
            var departHtml='<span class="search-item">';
            departHtml+='<input type="hidden" value="0,'+currentArry[1]+'" data-type="'+type+'"  data-wxdepartid="'+wxDepartId+'" data-mobile="'+mobile+'"  data-wxtagid="'+wxTagId+'" data-loginname="'+loginname+'" />';
            departHtml+='<img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/address/depart.png" />';
            departHtml+='<span class="search-item-des">'+currentName+'</span>';
            departHtml+='<span class="search-item-del" onclick="wxcepRemoveHeaderItem(this);"></span>'; 
            departHtml+='</span>'; 
            $('.search-input').append(departHtml);
        }else{
            $('.search-item input').each(function(index) {
                if(currentArry[1]==$(this).val().split(',')[1]){
                    $('.search-item').eq(index).remove();
                }
            });
        }
    }
    if(currentArry[0]=='1'){//如果是成员
        var currentImgSrc=$('.wxcep-address-list img').eq(currentIndex).prop('src');
        if(currentobj.prop('checked')==true){//如果是选中状态，则添加人员
        var userHtml='<span class="search-item">';
        userHtml+='<input type="hidden" value="1,'+currentArry[1]+'" data-type="'+type+'"  data-wxdepartid="'+wxDepartId+'" data-mobile="'+mobile+'" data-wxtagid="'+wxTagId+'" data-loginname="'+loginname+'"/>';
        userHtml+='<img src="'+currentImgSrc+'" />';
        userHtml+='<span class="search-item-des">'+currentName+'</span>';
        userHtml+='<span class="search-item-del" onclick="wxcepRemoveHeaderItem(this);"></span>'; 
        userHtml+='</span>'; 
        $('.search-input').append(userHtml);
    }
    else{//如果是非选中状态，则取消人员
        $('.search-item input').each(function(index) {
            if(currentArry[1]==$(this).val().split(',')[1]){
                $('.search-item').eq(index).remove();
            }
        });
    }

    }
    privateInitSearchInput();
    singleValidate(currentobj.val());
}

/**
 * 加载群组数据
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
function loadAddressGroupData(groupId,obj){
    //AJAX
    $.ajax({
        url: groupURL,
        type: 'POST',
        dataType: 'json',
        data: {id:groupId},
        global: false,
        success:function(data){
        	var currentIndex=$('.wxcep-address-ul-group a').index(obj);
        	var checkedFlag= $('.wxcep-address-ul-group input').eq(currentIndex).prop('checked');
            packageChildGroupData(data,checkedFlag);//组装子组织架构数据
            rewriteGroupGuid();//重写群组头部引导
            gotoTop();
        },error:function(XMLHttpRequest, textStatus, errorThrown){
               // console.log('地址簿群组成员数据失败！出错描述：'+'XMLHttpRequest：'+XMLHttpRequest+'textStatus：'+textStatus+'errorThrown：'+errorThrown);
        }
    });

}

/**
 * 组装群组数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function packageChildGroupData(data,checkFlag){
    var currentData=data.users;
    var html='';
    if(currentData.length>0){
    	for(var i=0;i<currentData.length;i++){
    		if(checkFlag){
    			html+='<li><img src="'+currentData[i].photoImg+'"><a>'+currentData[i].name+'</a><input type="checkbox" checked="true" disabled class="addressInput" value="1,'+currentData[i].id+'" data-type="'+currentData[i].type+'"  data-wxdepartid="'+currentData[i].wxDepartId+'" data-mobile="'+currentData[i].mobile+'" data-wxtagid="'+currentData[i].wxTagId+'" data-loginname="'+currentData[i].loginname+'" onchange="orgChosed(this);"></li>';
    		}else{
    			html+='<li><img src="'+currentData[i].photoImg+'"><a>'+currentData[i].name+'</a><input type="checkbox" class="addressInput" value="1,'+currentData[i].id+'" data-wxtagid="'+currentData[i].wxTagId+'" data-mobile="'+currentData[i].mobile+'" data-loginname="'+currentData[i].loginname+'"  onchange="orgChosed(this);"></li>';
    		}
        }
    }else{
    	html+='<li>暂无人员数据！</li>';
    }
    
    $('.wxcep-address-ul-group').empty().append(html);
    initChosedItems();
}

/**
 * 重写群组头部引导
 * @return {[type]} [description]
 */
function rewriteGroupGuid(){
    $('.wxcep-address-group-header').empty().append('<a href="javascript:void(0);" onclick="loadGroupData();"><返回</a>')
}

/**
 * 加载群组数据
 * @return {[type]} [description]
 */
function loadGroupData(){
    var html='';
    var groupData=JSON.parse(localStorage.getItem('groupData'));
    for(var i=0;i<groupData.length;i++){
    	if(orgTarget=='user'){
    		html+='<li><img src="' + urlPrefix + 'resources/admin/images/group.png"  /><a href="javascript:void(0);" onclick="loadAddressGroupData('+groupData[i].id+',this);">'+groupData[i].name+'</a></li>';
    	}else{
    		html+='<li><img src="' + urlPrefix + 'resources/admin/images/group.png"  /><a href="javascript:void(0);" onclick="loadAddressGroupData('+groupData[i].id+',this);">'+groupData[i].name+'</a><input type="checkbox" class="addressInput" value="2,'+groupData[i].id+'" data-type="'+groupData[i].type+'" data-wxdepartid="'+groupData[i].wxDepartId+'" data-wxtagid="'+groupData[i].wxTagId+'" data-mobile="'+groupData[i].mobile+'" data-loginname="'+groupData[i].loginname+'" onchange="groupChosed(this);"/></li>';
    	}
        
    }
    $('.wxcep-address-group-header').empty().append('<span>全选</span>');
    $('.wxcep-address-ul-group').empty().append(html);
    initChosedItems();
    gotoTop();//滚动条置顶
}

/**
 * 选择群组
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function groupChosed(obj){
     var currentIndex=$('.wxcep-address-ul-group input').index(obj);
    var currentValue=$(obj).val();
    var currentCheckState=$(obj).prop('checked');
    var currentgroupName=$('.wxcep-address-ul-group a').eq(currentIndex).text();
    var wxDepartId=$(obj).attr('data-wxdepartid');
    var wxTagId=$(obj).attr('data-wxtagId');
    var loginname=$(obj).attr('data-loginname');
    var mobile=$(obj).attr('data-mobile');
    var type=$(obj).attr('data-type');
    if(currentCheckState==true){//如果是选中状态，则添加群组
        var groupHtml='<span class="search-item">';
        groupHtml+='<input type="hidden" value="'+currentValue+'" data-type="'+type+'" data-wxdepartid="'+wxDepartId+'" data-mobile="'+mobile+'" data-wxtagId="'+wxTagId+'" data-loginname="'+loginname+'"  />';
        groupHtml+='<img src="' + urlPrefix + 'resources/admin/images/group.png" />';
        groupHtml+='<span class="search-item-des">'+currentgroupName+'</span>';
        groupHtml+='<span class="search-item-del" onclick="wxcepRemoveHeaderItem(this);"></span>'; 
        groupHtml+='</span>'; 
        $('.search-input').append(groupHtml);
    }
    else{//如果是非选中状态，则取消群组
        $('.search-item input').each(function(index) {
            if(currentValue.split(',')[1]==$(this).val().split(',')[1]){
                $('.search-item').eq(index).remove();
            }
        });
    }
    privateInitSearchInput();
    singleValidate(currentValue);
}



/**
 * 初始化搜索框的位置
 * @return {[type]}      [description]
 */
function privateInitSearchInput(){
	if(orgTarget!='depart'){
		$('#wxcep-address-searchValue').remove();
		var html=''
		if($('.search-input .search-item').length>0){
			html='<input type="text" autocomplete="off" name="address-serach" id="wxcep-address-searchValue" onkeyup="addressSerachInput();" value="" >';
		}else{
			if(departType=='s'&&showUserType=='2'){
				html='<input type="text" autocomplete="off"  name="address-serach" id="wxcep-address-searchValue" value="" placeholder="请输入学生姓名快速找人"  onkeyup="addressSerachInput();"  >';
			}else{
				html='<input type="text" autocomplete="off"  name="address-serach" id="wxcep-address-searchValue" value="" placeholder="请输入姓名或手机快速找人"  onkeyup="addressSerachInput();"  >';
			}
        }
        $('.search-input').append(html);
            if($('.search-input .search-item').length>0){
            $('#wxcep-address-searchValue').val(' ').focus();
        }else{
            $('#wxcep-address-searchValue').val('').focus();
        }
		
		
	}
	
}


/**
 * 地址簿检索需求
 * @return {[type]} [description]
 */
function addressSerachInput(){
    //console.log('keyup事件');
    // console.log(addressSerachInput);
	// if(addressSerachInput.length==$('#wxcep-address-searchValue').val().trim().length){
	// 	if($('#wxcep-address-searchValue').val()==''){
	//         $('.search-result').hide();
	//     }
	// 	return;
	// }     
	
    if($('#wxcep-address-searchValue').val().trim()==''){
        $('.search-result').hide();
    }else{
         //后台获取值
    	var userids='';
    	$('.search-item input').each(function(index){
    		var dataArry=$(this).val().split(',');
    		if(dataArry[0]=='1'){
    			userids+=dataArry[1]+',';
    		}
        });
    	var searchContent=$('#wxcep-address-searchValue').val().trim();
         $.ajax({
             url: addrUrlPrefix + '/ucenter-web/api/address/retrievalUsers',
             type: 'POST',
             dataType: 'json',
             data: {'excludeUserIds':userids,'condition':searchContent,userTypes: showUserType, departIds: inputRootIds,schoolId: window.school, token: window.token},
             global:false,
             success:function(data){
            	 $('.search-result').empty().hide();
                privateSearchPackage(data);
             },
             error:function(XMLHttpRequest, textStatus, errorThrown){
                //console.log('地址簿检索出错！出错描述：'+'XMLHttpRequest：'+XMLHttpRequest+'textStatus：'+textStatus+'errorThrown：'+errorThrown);
             }
         })
       
    }
   
}

//初始化二次加载
function InitSecondLoad(){
	var items=$('.wxcep-address-list input');
	var headerItems=$('.search-item input[type=hidden]');
	items.each(function(index){
		var numFlag=0;
		var currentValue=$(this).val();
		headerItems.each(function(index){
			if(currentValue==$(this).val()){
				numFlag++;
				return false;
			}
		});
		if(numFlag>0){
			$(this).prop('checked',true);
		}
	});
	
}

//初始化加载列表后喻头部对应的选项，相同则被选中
function initChosedItems(){
	var headerItems=$('.search-item input[type=hidden]');
	var listItems=$('.wxcep-address-list input');
	listItems.each(function(index){
		var currentItem=$(this);
		headerItems.each(function(index){
			if(currentItem.prop('display')!='none'){
				if(currentItem.val()==$(this).val()){
					currentItem.prop('checked',true);
				}
			}
		});
	});
	
}

//单选验证，去掉非当前选择的对象
function singleValidate(value){
	if(singleChose==false){
		$('.wxcep-address-list input').each(function(index){
			if($(this).prop('checked')==true){
				var currentValue=$(this).val();
				//console.log('value'+value+'#$(this).val()'+currentValue);
				if(value!=currentValue){
					$(this).prop('checked',false);
				}
				var seacherItems=$('.search-item');
				$('.search-item input').each(function(index){
					if($(this).val()!=value){
						seacherItems.eq(index).remove();
					}
				});
			}
		});
	}
	
}

//地址簿检索后上下选择
function addressSearchUpAndDown(str){
	var searchItems=$('.search-result li');
	var searchItemInputs=$('.search-result li input[type=text]');
	var currentIndex=searchItems.index($('.search-result-chosed'));
	//console.log('当前检索内容行数：'+searchItems.length);
	//console.log('当前的索引是：'+currentIndex);
	var allLength=searchItems.length;
	
	if(str=='up'){//如果是键盘上键
		if(currentIndex==0){
			currentIndex=allLength-1;
		}else{
			currentIndex=currentIndex-1;
		}
		
	}else{//如果是键盘下键
		if(currentIndex<allLength-1){
			currentIndex++;
		}else{
			currentIndex=0;
		}
	}
	searchItems.removeClass('search-result-chosed').eq(currentIndex).addClass('search-result-chosed');
	searchItemInputs.eq(currentIndex).focus();
}

//地址簿检索回车事件
function addressSearchEnder(){
	var searchItems=$('.search-result li');
	if(searchItems.length>0){
		addressSeachChose($('.search-result-chosed'));
	}
	
}

//将列表的div滚动条置顶
function gotoTop(){
	$('.wxcep-address-list').scrollTop(0);
}

//将检索列表置顶
function gotoTop4Search(){
	$('.search-result').scrollTop(0);
}

//绑定键盘事件
function bindKey(){
	/*var indexPageJQDocument=$(privateGetIndexDocument());
	var indexPageJSDocument=privateGetIndexDocument();*/
	// 绑定键盘按下事件  
	$('body').on('keypress',function(e){
		// 回车键事件  
	       if(e.which == 13) {  
	    	   addressSearchEnder();
	       }  
	});
	$('body').on('keydown',function(event){
		if(event.keyCode == 38){  
        	  addressSearchUpAndDown('up'); 
          }else if (event.keyCode == 40){   
        	  addressSearchUpAndDown('down'); 
          } 
	});
}

//接触绑定
function offBindKey(){
    $('body').off('keypress');
    $('body').off('keydown');
    
}

//通过部门id检测此部门是否在当前的departType控制线显示
function checkShowDepartBytype(type){
	var isShowDepart=false;
	switch (departType) {
		case 't':
			if(type=='1'||type=='7'||type=='5'){
				isShowDepart=true;
			}
			break;
		case 's':
				if(type=='2'||type=='3'||type=='4'||type=='5'){
					isShowDepart=true;
				}
				break;
		case 'sf':
				if(type=='10'||type=='5'||type=='11'||type=='12'){
					isShowDepart=true;
				}
				break;
		case 'outside':
				if(type=='20'||type=='5'||type=='21'){
					isShowDepart=true;
				}
				break;
		case 'tOrOutside':
				if(type=='1'||type=='7'||type=='20'||type=='5'||type=='21'){
					isShowDepart=true;
				}
				break;
		case 'all':
			isShowDepart=true;
			break;
	}
	return isShowDepart;
}
/**
 * 检查是否存在部门不需要checkedbox
 * @param {Object} type
 */
function checkIsIgnoreDepartType(type){
	var flag=false;
	if(isIgnoreDepart){
		if(type==1||type==2||type==5){
			flag=true;
		}
	}
    if( orgRange === 'manage') {
        flag = true;
        switch(subDepartType) {
            case 'all_depart':
                flag = false;
                break;
            case 'all':
                if(type === 3 || type === 4) {
                    flag = false;
                }
                break;
            case 'grade':
                if(type === 3) {
                    flag = false;
                }
                break;
            case 'class':
                if(type === 4) {
                    flag = false;
                }
                break;
            default:
                if(type === 3 || type === 4) {
                    flag = false;
                }
                break;
        }
    }
	return flag;
}

//获取检索范围（部门拼接而成）
function getInputSearchRange(){
	var orgData=null;
	var rootIds='';
    if(orgRange=='manage'){
    	orgData=JSON.parse(localStorage.getItem('allOrg'));
    }else{
    	orgData=JSON.parse(localStorage.getItem('simpleOrg'));
    }
    for(var i=0;i<orgData.departs.length;i++){
    	if(checkShowDepartBytype(orgData.departs[i].type)){
    		rootIds+=orgData.departs[i].id+',';
    	}
    }
	return rootIds;
	
	
}

/*重新初始化群组数据*/
function reInitGropData(){
	//AJAX
    $.ajax({
        url: urlPrefix + 'groups/groupJson_list',
        type: 'POST',
        dataType: 'json',
        global: false,
        success:function(data){
        	localStorage.setItem('groupData',JSON.stringify(data));
        },error:function(XMLHttpRequest, textStatus, errorThrown){
                //console.log('重新加载群组数据失败：：'+'XMLHttpRequest：'+XMLHttpRequest+'textStatus：'+textStatus+'errorThrown：'+errorThrown);
        }
    });
}

/**
 * 绑定鼠标移动事件
 */
function bindMouseMove(){
	$("#address-header").mousedown(function(e) { 
			dragging = true; 
			iX = e.clientX - $('#address-body').position().left; 
			iY = e.clientY - $('#address-body').position().top; 
			return false; 
			}); 
			document.onmousemove = function(e) { 
			if (dragging) { 
	
			var e = e || window.event; 
			var oX = e.clientX - iX; 
			var oY = e.clientY - iY; 
			if(oY>0){
			    $("#address-body").css({"left":oX + "px", "top":oY + "px"}); 
			}else{
				dragging = false; 
			}
			return false; 
			} 
		}; 
		$("#address-header").mouseup(function(e) { 
		dragging = false; 
	}); 
}



