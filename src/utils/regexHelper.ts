import { List } from "echarts";

export default function(){
    const clearCharactersByRegex = function(str : string) : any{
        //按照[ ],[,],[，]来分割一个字符串并返回一个数组
            return str?.split(/[(\r\n)\r\n]|，|,/);
    }
    return{
        clearCharactersByRegex,
    }
}