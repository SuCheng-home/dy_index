(function( $ ){

    //婢舵艾顦查柅澶嬵攱閸忋劑锟�/閸欏秹锟�
    $.fn.wycheckall = function( type ) {
        $(this).click(function(){
            var hasChk = $(this).is(':checked');
            $('.'+type).each(function(index, element) {
                $(this).prop('checked',hasChk);
            });
        });
    };
//婢舵艾顦查柅澶嬵攱闁瀚ㄧ€涙劗琚懕鏂垮З閻栧墎琚�
    $.fn.wycheckChild = function( type ) {
        $(this).click(function(){
            var numFlag=0;
            var childClass=$(this).prop('class');
            $('.'+childClass).each(function(index) {
                if($(this).is(':checked')){
                    numFlag++;
                }
            });
            if(numFlag>0){
                $('.'+type).prop('checked',true);
            }
        });
    };
    $.fn.wyAddress = function(json,callback ) {
        $(this).click(function(){
            var loadAddressSourceId=$(this).prop('id');
            showAddress(loadAddressSourceId,json,callback);

        });
    };

    $.fn.wyImgView = function() { //鍥剧墖棰勮
        var currentObj=$(this);

        $(this).find('img').click(function(event) {
            if($(this).parent().get(0).tagName!='A' ){
                var imgs=currentObj.find('img');
                var imgArray=new Array();

                for(var i=0;i<imgs.length;i++){
                    if($(this).parent().get(0).tagName!='A'){
                        imgArray.push($(imgs[i]).attr('src'));
                    }
                }
                var imgSrc=$(this).prop('src');
                var json={currentURL:imgSrc,imgArray:imgArray};
                privateGetIndexDocument().imgView.view(json);
            }

        });
    };
    $.fn.wyImgView_back = function() { //鍥剧墖棰勮
        var currentObj=$(this);
        $(this).find('.view-img').click(function(event) {
            var imgs=currentObj.find('.view-img');
            var imgArray=new Array();
            for(var i=0;i<imgs.length;i++){
                imgArray.push($(imgs[i]).attr('data-src'));
            }
            var imgSrc=$(this).attr('data-src');
            var json={currentURL:imgSrc,imgArray:imgArray};
            privateGetIndexDocument().imgView.view(json);
        });
    };

})( jQuery );

$(function(){
    $(document).ajaxSend(privateOnAjaxSend).ajaxStop(privateOnComplete);//鐠併垽妲凙JAX娴滃娆�
});

/**
 * 鐎电鐦藉鍡楄剨閸戯拷
 * @param  {[type]}   message  [閸愬懎顔怾
 * @param  {Function} callback [閸ョ偠鐨熼崙鑺ユ殶閸氬秶袨閿涘苯褰查崠鍨倳]
 * @return {[type]}            [閺冪嚪
 */
function wxcepAlert(message){
    window.ELEMENT.Message({
        message: message,
        type: 'error'
    });
}
/**
 * 鐎电鐦藉锟�
 * @param  {[type]}   message  [閹绘劗銇氶崘鍛啇]
 * @param  {Function} callback [閸ョ偠鐨熼崙鑺ユ殶閸氬秶袨閿涘苯褰查崠鍨倳]
 * @return {[type]}            [閺冪嚪
 */
function wxcepConfirm(message,callback,callbackCancel){
    privateGetIndexDocument().bootboxConfirm(message,callback,callbackCancel);
}

/**
 * 閸掗攱鏌婇懛顏囬煩妞ょ敻娼�
 * @return {[type]} [閺冪嚪
 */
function wxcepRefreshSelf(){
    window.location.href=window.location.href;
}

//瀵懓鍤崷鏉挎絻缁拷
function showAddress(loadAddressSourceId,json,callback){
    var initSourceHtml=getAddressHeaderHtml(loadAddressSourceId);
    privateGetIndexDocument().loadWxcepAddress(initSourceHtml,loadAddressSourceId,json,callback);
}

/**
 * 閸︽澘娼冪花鍨灥婵瀵查柅澶嬪閻╊喗鐖�
 * @param  {[type]} sourceData [description]
 * @return {[type]}            [description]
 */
function wxcepInitAddress(sourceData){
    $('#'+sourceData.id).empty().append(sourceData.html);
}


/**
 * 閼惧嘲褰囬崷鏉挎絻缁ㄥ灝鍨垫慨瀣婢舵挳鍎�
 * @param  {[type]} 閻愮懓鍤崗鍐閻ㄥ嚘D [description]
 * @return {[type]}          [description]
 */
function getAddressHeaderHtml(sourceId){
    var html='';
    var sourceHeaderImgs=$('#'+sourceId+' img');
    var sourceHeaderDes=$('#'+sourceId+' .address-source-item-des');
    $('#'+sourceId+' input').each(function(index) {
        var wxDepartId=$(this).attr('data-wxdepartid');
        var wxTagId=$(this).attr('data-wxtagId');
        var loginname=$(this).attr('data-loginname');
        var mobile=$(this).attr('data-mobile');
        var type=$(this).attr('data-type');
        html+='<span class="search-item">';
        html+='<input type="hidden" value="'+$(this).val()+'" data-type="'+type+'" data-wxdepartid="'+wxDepartId+'" data-mobile="'+mobile+'" data-wxtagId="'+wxTagId+'" data-loginname="'+loginname+'"/>';
        html+='<img src="'+sourceHeaderImgs.eq(index).prop('src')+'" />';
        html+='<span class="search-item-des">'+sourceHeaderDes.eq(index).text()+'</span>';
        html+='<span class="search-item-del" onclick="wxcepRemoveHeaderItem(this);"></span>';
        html+='</span>';
    });
    return html;
}


/**
 * 閺勫墽銇氶崝鐘烘祰閻ｅ矂娼�
 * @return {[type]} [description]
 */
function showLoadPage(){
    privateGetIndexDocument().loadPage('show');
}
/**
 * 闂呮劘妫岄崝鐘烘祰閻ｅ矂娼�
 * @return {[type]} [description]
 */
function hideLoadPage(){
    privateGetIndexDocument().loadPage('hidden');
}

function wyImgView(json) { //鍥剧墖棰勮
    //var json={currentURL:imgSrc,imgArray:imgArray};
    privateGetIndexDocument().imgView.view(json);

};
//缁変焦婀侀弬瑙勭《閸愬懘鍎存担璺ㄦ暏

/**
 * 閺勫墽銇氶崝鐘烘祰閻ｅ矂娼�
 * @return {[type]} [閺冪嚪
 */
function privateOnAjaxSend(){
    privateGetIndexDocument().loadPage('show');
}
/**
 * 闂呮劘妫岄崝鐘烘祰妞ょ敻娼�
 * @return {[type]} [閺冪嚪
 */
function privateOnComplete(){
    privateGetIndexDocument().loadPage('hidden');
}
/**
 * 閼惧嘲褰囨＃鏍€夐弬鍥ㄣ€傜€电钖�
 * @return {[type]} [閺傚洦銆傜€电钖刔
 */
function privateGetIndexDocument(){
    var iframeid='content_iframe';
    var iframeObj=$('#'+iframeid);
    if(iframeObj.length==0){//婵″倹鐏夋稉宥嗘Ц妫ｆ牠銆夊鐟板毉娴滃娆�
        iframeObj=$('#'+iframeid,window.parent.parent);
        if(iframeObj.length==0){//婵″倹鐏夋稉宥嗘Ц閺勵垯绨╃痪褏鏅棃銏㈡畱瀵懓鍤禍瀣╂
            iframeObj=window.parent.parent.parent.window;
        }
        else{
            iframeObj=window.parent.parent.window;
        }
    }
    else{
        iframeObj=window;
    }
    return iframeObj;
}

/**
 * 閼惧嘲褰囬崷鏉挎絻缁ㄨ法娈戦柅澶嬪閸愬懎顔�
 */
function getAddressDataContainNames(addressId){
    var arryInputs= $('#'+addressId+' .address-source-item input[type=hidden]');
    var arryNames=$('#'+addressId+' .address-source-item .address-source-item-des');
    var departArry=new Array();
    var userArry=new Array();
    var groupArry=new Array();
    var returnValue='';

    arryInputs.each(function(index){
        var arryCurrentValue=$(this).val().split(',');
        if(arryCurrentValue[0]=='0'){//婵″倹鐏夐弰顖炲劥闂傦拷
            departArry.push('{"id":"'+arryCurrentValue[1]+'","name":"'+arryNames.eq(index).text()+'"}');

        }else if(arryCurrentValue[0]=='1'){//婵″倹鐏夐弰顖滄暏閹达拷
            userArry.push('{"id":"'+arryCurrentValue[1]+'","name":"'+arryNames.eq(index).text()+'"}');

        }else{//婵″倹鐏夐弰顖滃參缂侊拷
            groupArry.push('{"id":"'+arryCurrentValue[1]+'","name":"'+arryNames.eq(index).text()+'"}');
        }

    });
    returnValue='{"departs":['+departArry+'],"users":['+userArry+'],"groups":['+groupArry+']}';
    return returnValue
}

//*闁插秵鏌婇崚婵嗩潗閸栨牜鍏㈢紒鍕殶閹癸拷/
function reInitGropData(){
    privateGetIndexDocument().reInitGropData();
}

function gotoHomePage(){//閺勫墽銇氭＃鏍€�
    privateGetIndexDocument().showPageHome();
}


function loadAjaxPage(json,callback){//寮傛鍔犺浇
    privateGetIndexDocument().loadAjaxPage(json,callback);
}

//*閸掋倖鏌囬弰顖氭儊閺勵垱鏋冩禒锟�/
function checkFile(filePath){
    var isFile=false;
    var file = filePath;
    //var strFileName = file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");
    var file_ext = new Array("doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf");
    var FileExt = file.replace(/.+\./, "");
    var file_count = 0;
    for (x in file_ext) {
        if (FileExt.toLowerCase() == file_ext[x]) {
            file_count++;
        }
    }
    if (file_count > 0) {
        isFile=true;
    }
    return isFile;
}

//*閸掋倖鏌囬弰顖氭儊閺勵垰娴橀悧锟�/
function checkImg(filePath){
    var isFile=false;
    var file = filePath;
    //var strFileName = file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");
    var file_ext = new Array("jpg", "jpeg", "png", "gif", "bmp");
    var FileExt = file.replace(/.+\./, "");
    var file_count = 0;
    for (x in file_ext) {
        if (FileExt.toLowerCase() == file_ext[x]) {
            file_count++;
        }
    }
    if (file_count > 0) {
        isFile=true;
    }
    return isFile;
}

/**
 * 閲嶆柊鍔犺浇椤甸潰
 */
function reLoadPage(){
    privateGetIndexDocument().reLoadPage();
}

/**
 * 鍘籌E鎵撳嵃鐨勯〉鐪夐〉鑴�
 */
function pageHeaderFooterRemove(){
    var hkey_root,hkey_path,hkey_key;
    hkey_root="HKEY_CURRENT_USER";
    hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
    try{
        var RegWsh = new ActiveXObject("WScript.Shell") ;
        hkey_key="header" ;
        RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"") ;
        hkey_key="footer" ;
        RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"") ;
    }
    catch(e){

    }
}

// 瀵煎嚭excel
function exportExcel(ele, fileName) {
    exportFile(ele, 'name', fileName + '.xls');
}

function exportFile(tableid,name,filename) {
    if(getExplorer() === 'ie'){
        var curTbl = document.getElementById(tableid);
        curTbl.style.border="1px";
        curTbl.style.backgroundClip="padding-box";
        curTbl.style.position="relative";

        var oXL;
        try{
            oXL = new ActiveXObject("Excel.Application"); //鍒涘缓AX瀵硅薄excel
        }catch(e){
            alert("鏃犳硶鍚姩Excel!\n\n濡傛灉鎮ㄧ‘淇℃偍鐨勭數鑴戜腑宸茬粡瀹夎浜咵xcel锛�"+"閭ｄ箞璇疯皟鏁碔E鐨勫畨鍏ㄧ骇鍒€俓n\n鍏蜂綋鎿嶄綔锛歕n\n"+"宸ュ叿 鈫� Internet閫夐」 鈫� 瀹夊叏 鈫� 鑷畾涔夌骇鍒� 鈫� 瀵规病鏈夋爣璁颁负瀹夊叏鐨凙ctiveX杩涜鍒濆鍖栧拰鑴氭湰杩愯 鈫� 鍚敤");
            return false;
        }
        var oWB = oXL.Workbooks.Add();
        var oSheet = oWB.ActiveSheet;
        var Lenr = curTbl.rows.length;
        for (i = 0; i < Lenr; i++){
            var Lenc = curTbl.rows(i).cells.length;
            for (j = 0; j < Lenc; j++){
                oSheet.Cells(i + 1, j + 1).value = curTbl.rows(i).cells(j).innerText;
            }
        }
        oXL.Visible = true;

    }else {
        tableToExcel(tableid,name,filename)
    }
}

function getExplorer() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
}

var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html><head><meta charset="UTF-8"></head><body><table border="1">{table}</table></body></html>',
        base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; })
        };
    return function(table, name,filename) {
        if (!table.nodeType) table = document.getElementById(table);
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};

        document.getElementById("dLink").href = uri + base64(format(template, ctx));
        document.getElementById("dLink").download = filename;
        document.getElementById("dLink").click();
    }
})();
// 获得顶层window
function getTopWindow() {
    return top.window;
}

function showHintMessage(config) {
    config = $.extend({}, {
        message: 'error',
        type: 'error',
        duration: 2000
    }, config);

    var styleStr = 'z-index: 9999;position: fixed;left: 50%;transform: translateX(-50%);-ms-transform: translateX(-50%);-moz-transform: translateX(-50%);-webkit-transform: translateX(-50%);' +
        'min-width: 380px;padding: 10px;top: 30px;font-size: 14px;border-radius: 5px;';
    var iconClass = 'glyphicon ';
    switch (config.type) {
        case 'error':
            styleStr += 'background-color: #ffdfdf;color: #f56c6c;border: 1px solid #fcb1b1;';
            iconClass += ' glyphicon-exclamation-sign';
            break;
        case 'success':
            styleStr += 'background-color: #e1f3d8;color: #48a548;border: 1px solid #6dda6d;';
            iconClass += ' glyphicon-ok';
            break;
    }
    var topjq = getTopWindow().$;
    var $htmlStr = topjq('<div class="global-hint-message" style="' + styleStr + '"><span style="margin-right: 10px;" class="' + iconClass + '" aria-hidden="true"></span>' +
        config.message + '</div>');
    topjq('body').append($htmlStr);
    $htmlStr.fadeIn(300);
    getTopWindow().setTimeout(function() {
        $htmlStr.fadeOut(300, function() {
            $(this).remove();
        });
    }, config.duration);
}
