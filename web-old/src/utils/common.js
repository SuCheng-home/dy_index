export default {
    getDropDownList: (list, role) => {
        var array = new Array();
        for (let item of Object.values(list)) {
            array.push({ label: item[role.label], value: item[role.value] });
        }
        return array;
    },
    hasRoleByComponent:(sourceData,component)=>{
        let flag=false;
        if(sourceData){
            for(let i=0;i<sourceData.length;i++){
                if(sourceData[i].component==component){
                    flag=true;
                    break;
                }
            }
        }
        return flag;
    },
    getRoleNameByComponent:(sourceData,component)=>{
        let name='';
        if(sourceData){
            for(let i=0;i<sourceData.length;i++){
                if(sourceData[i].component==component){
                    name=sourceData[i].name;
                    break;
                }
            }
        }
        return name;
    }
}