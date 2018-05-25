//正式环境
const urlEnv = 'https://api-stockmatch.hexun.com';
//测试环境
// const urlEnv = 'https://test-stockmatch.hexun.com';

// if (process.env.NODE_ENV === 'production') {
//     var urlEnv = 'https://api-stockmatch.hexun.com';
// } else {
//     //todo  接口测试地址
//     var urlEnv = 'https://api-stockmatch.hexun.com';
// }

const urlConfig = {
    domain: urlEnv.replace(/api-/, ''),
    whiteList: `${urlEnv}/api/experience/existHexunId`,
    queryMimic: `${urlEnv}/api/redis/persionyieldRate`,
    queryMimicRT: `${urlEnv}/api/validAccount/query`, //实时查表来判断是否有在期模拟盘，redis有延迟
    regMimic: `${urlEnv}/api/account/regAccount`,
    mimicInfo: `${urlEnv}/api/front/income/account/get_total_info`,
    actualInfo: `${urlEnv}/api/front/income/account/get_real_report_info`,
    actualRate: `${urlEnv}/api/realAssets/query`,
    queryActual: `${urlEnv}/api/front/income/account/valid/real_account`,
    regActual: `${urlEnv}/api/front/income/comfirm/approval`,
    withdraw: `${urlEnv}/api/front/income/apply/cash`,
    addCookie: 'https://wizard-stock.hexun.com/ucenter/addcookie.aspx',
    getMimicRecord: `${urlEnv}/api/front/income/account/get_detail_info`,
    getActualRecord: `${urlEnv}/api/realAccount/detail`,
    checkLogin: 'https://regtool.hexun.com/wapreg/checklogin.aspx?format=json&encode=no',
    getRecord: `${urlEnv}/api/redis/transactionStockCodeData`,
    stockMarket: 'https://hqwiapi.hexun.com/a/quotelist',
    honerList: `${urlEnv}/api/redis/previousHonourYieldRate`,
    chickenList: `${urlEnv}/api/redis/yieldRate`,
    transTime: `${urlEnv}/api/redis/isTransaction`,
    coinNum: 'https://callwx.hexun.com/share/api/gold_sum?share_test_tag=rpt&user_id=',
    queryBalance: 'https://callvip.hexun.com/payapi/service?service=query_balance',
    getWXTXurl: 'https://callvip.hexun.com/jsapi/wxtx/getWXtxUrl',
    awardNew: `${urlEnv}/api/gold/operUser`,
    user: 'https://callwx.hexun.com/',
    accunt: 'https://stockmatch.hexun.com',
    apiAccunt: 'https://api-stockmatch.hexun.com',
}
export default urlConfig