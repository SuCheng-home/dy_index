window.onload=function(){
  var dateStr = (new Date().getMonth() + 1) + '-' + new Date().getDate();
  var grayDateList = ['12-13'];
  if(grayDateList.indexOf(dateStr) !== -1) {
    document.querySelector('html').style.filter='grayscale(1)';
    document.querySelector('html').style.WebkitFilter='grayscale(1)';
  }else{
    document.querySelector('html').style.filter=0;
    document.querySelector('html').style.WebkitFilter=0;
  }
}
