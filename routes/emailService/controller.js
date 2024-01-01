import mailService from "../../core/mailService/index.js";
import { convertExcelToArray , checkMandatoryFieldsInExcel } from '../../core/utils/utils.js';
import { configuration } from "../../core/config/config.js";
import response from "../../core/response.js";

export async function sendMail(req,res,next){
  try {
    if(!req.file) throw Error('File is required !!');
    const sendMail = new mailService();
    const arr = convertExcelToArray(req.file);
    //* checking mandatory fields in array
    checkMandatoryFieldsInExcel(arr, ['name','to','content','subject']);
    if(arr?.length){
      arr.forEach((item,index)=>{
        const mailOptions = {
          to: item?.to, // list of receivers
          subject: item?.subject ? item.subject : `Random Subject`, // Subject line
          bodyVariables:{
            __name__:item?.name,
            __content__:item?.content
          }
        }
        setTimeout(()=>{
          sendMail.sendMail(mailOptions);
        },index*1000);
      })
    }else {
      throw new Error("Excel sheet is empty!!")
    }
    return response(res,[],'Mail sent successfully');
  } catch (error) {
    next(error)
  }
}