import statusCodes from '../config/status.js';
import env from '../config/index.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { checkAccountData } from '../controllers/login.js';
import { checkPhone } from '../database/tableSettings.js';

const checkPhoneAccount = async ( req, res, next) => {

    let phone = req.params.phone || req.query.phone || req.body.phone;
    let phoneData = checkPhone(phone, true);

    if(!phoneData){
        sendError({status: statusCodes.BAD_REQUEST, response:res, message: "Phone number is not valid"});
        return false;
    }

    console.log("Phone Data : ", phoneData);

    let phoneFilter = phone.replace("+", "").replace(/\s+/g, "").replace(/-/g, "").replace("(", "").replace(")", "").replace(phoneData.countryCode.replace("+", ""), "");
    if(phoneFilter[0] == "0") phoneFilter = phoneFilter.replace("0", "");
    
    console.log("Phone Filter : ", phone, phoneFilter);

    let replace0 = "'" + phoneData.countryCode + "', ''";
    let replace1 = "'+', ''";
    let replace2 = "'(', ''";
    let replace3 = "')', ''";
    let replaceAll = `REPLACE(REPLACE(REPLACE(REPLACE(phone, ${replace0}), ${replace1}), ${replace2}), ${replace3})`;

    let account = await checkAccountData(phoneFilter, "phone", res, `CONCAT(
        REPLACE( LEFT(${replaceAll},1), '0', ''),      
        SUBSTRING(${replaceAll}, 2, CHAR_LENGTH(${replaceAll})
    )) = '${phoneFilter}'`);

    console.log("Account : ", account);

    if(account){
        send(200, res, "Account is found", account);
    } else {
        sendError({status: statusCodes.NOT_FOUND, response:res, message: "Account is not found"});
        return false;
    }
}

export {checkPhoneAccount};