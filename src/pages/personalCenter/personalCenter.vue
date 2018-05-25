<template>
    <div class="personalCenter">
        <div flex class="main">
            <div class="content">
                <div flex="box:mean" class="userInfo" >
                    <div flex class="gold-coin">
                        <i class="gold-coin-icon"></i>
                        <div flex="cross:center" class="gold-coin-num" style="font-size: .28rem;">{{money_num}}</div>
                    </div>
                    <div flex="dir:top cross:center">
                        <div class="avatar">
                            <img :src='avatarUrl' alt="">
                        </div>
                    </div>
                    <div flex="dir:right">
                        <div flex="main:center cross:center" class="modify-nickname" @click="mNickname=true">修改昵称</div>
                    </div>
                </div>
                <div flex="dir:top main:center cross:center">
                    <div flex="dir:left cross:center main:center" class="mt-1">
                        <div class="nickname">{{nickname}}</div>
                        <img :src='segment' class="segment" v-if="segment!=''">
                    </div>
                    <div class="mt-1 userId">（{{userId}}）</div>
                </div>                        
                <!-- 导航 -->
                <div flex="box:mean" class="tab-title">
                    <div :class="{'cur':curId === 0}" @click="curId=0" flex="main:center cross:center">资产</div>
                    <div :class="{'cur':curId === 1}" @click="curId=1" flex="main:center cross:center" >战绩</div>
                    <!-- <div :class="{'cur':curId === 2}" @click="curId=2" flex="main:center cross:center">师徒</div>
                    <div :class="{'cur':curId === 3}" @click="curId=3" flex="main:center cross:center">关注</div>
                    <div :class="{'cur':curId === 4}" @click="curId=4" flex="main:center cross:center">玩法</div> -->
                </div>
                <!-- 内容1 -->
                <div v-show="curId===0" class="tab-content">
                    <div flex="main:justify">
                        <div class="attendance-text fz14">签到</div>
                        <div class="fz14">已连续签到<span class="continuity">{{continuity}}</span>天</div>
                    </div>
                    <ul class="attendance-list">
                        <li  flex="dir:top"  v-for="item in sign_list" :key="item.index">
                            <div flex="main:center cross:center" class="week">{{weekArr[item.weekdays-1]}}</div>
                            <div class="attendance-item">
                                <i class="yqd" :class="[checkState(item.isSign)]"></i>
                                <div flex="dir:top main:center cross:center" class="mt-8">
                                    <i class="yqd-icon"  :class="[item.isSign==0 ? 'wqd-icon' : '']"></i>
                                    <span class="yqd-jb" :class="[item.isSign==0 ? 'wqd-jb' : '']">{{ item.gold }}金币</span>
                                </div>
                            </div>
                        </li>
                        <li flex="dir:top main:center cross:center" class="attendance fz14" @click="sign">签到</li>
                    </ul>
                    <div flex="main:justify" class="mtb2">
                        <div class="attendance-text fz14">锦标赛资金</div>
                        <div class="fz14" @click="toRecord('2')">明细</div>
                    </div>
                    <div flex="dir:top main:center" class="real-money">
                        <div flex="dir:left cross:center" class="ml3">
                            <span class="money-title">可启用锦标赛资金</span>
                            <i class="tip" @click="dialog=true;tipText='牛币满1000可启用'"></i>
                        </div>
                        <div flex="dir:left cross:center" class="ml3">
                            <div flex="cross:center" flex-box="1">
                                <div class="money-num">{{realDisk_avaliableIncome}}</div>
                                <div class="accumulative">累计：<span>{{realDisk_totalEarnIncome}}</span></div>
                            </div>
                            <div flex="main:center cross:center" flex-box="0" class="open-real-money" @click="real_account">启用牛币参赛</div>
                        </div>
                    </div>
                    <div flex="main:justify" class="mtb2">
                        <div class="attendance-text fz14">我的奖金</div>
                        <div class="fz14" @click="toRecord('1')">明细</div>
                    </div>                    
                    <div flex="dir:top main:center" class="real-money">
                        <div flex="dir:left cross:center" class="ml3">
                            <div flex="dir:left cross:center"  flex-box="1">
                                <span class="money-title">奖金</span>
                                <i class="tip" @click="dialog=true;tipText='奖金将提现至您的微信余额'"></i>
                            </div>
                            <div flex="main:center cross:center" flex-box="0" class="open-real-money" @click="cash">领取</div>
                        </div>
                        <div flex="dir:left cross:center" class="ml3">
                            <div flex="cross:center" flex-box="1">
                                <div class="money-num">{{avaliableIncome}}</div>
                                <div class="accumulative">累计：<span>{{totalEarnIncome}}</span></div>
                            </div>
                            <div flex="main:center cross:center" flex-box="0" class="bonusTip" @click='toWallet'>奖金将提现至您的<span class="bonusTipSpan">微信余额</span></div>
                        </div>
                    </div>
                </div>
                <!-- 内容2 -->
                <div v-show="curId===1" class="tab-content">
                    <div flex="main:justify">
                        <div class="attendance-text fz14">荣耀时刻</div>
                    </div>
                    <div flex="main:center cross:center" class="glory-moment" :class="cj_status==2 ?'':'glory-moment2'">
                        <div flex="dir:top cross:center">
                            <template v-if="cj_status == 2">
                                <i class="glory-con"></i>
                                <p class="peak"><span>{{top1Count}}</span>次登顶</p>
                            </template>
                            <template v-else-if="cj_status == 1">
                                <i class="glory-con2"></i>
                                <p class="peak"><span></span>最好名次{{bestRank}}名</p>
                            </template>
                            <template v-else>
                                <i class="glory-con2"></i>
                                <p class="peak">您未参加过比赛</p>
                            </template>
                        </div>
                        <div flex="dir:top" class="record-date" v-if="cj_status != 0">
                            <p>最佳战绩日期</p>
                            <p class="date">{{periods}}</p>
                        </div>
                    </div>
                    <div flex="main:justify" class="mtb2">
                        <div class="attendance-text fz14">我的战绩</div>
                    </div>                    
                    <div flex="dir:left cross:center" class="record-info fz14">
                        <div flex="dir:left cross:center" flex-box="1">
                            <div flex="main:center cross:center" class="record-type fz16 ml3">预选赛</div>
                            <div flex="dir:top" class="ml3">
                                <div><span class="op6">参赛期数：</span><span class="op1">{{simulation_periodsCount}}</span></div>
                                <div class="mt1"><span class="op6">比赛胜率：</span><span class="op1">{{simulation_totalSuccessRate}}%</span></div>
                            </div>
                        </div>
                        <div flex="dir:top" flex-box="0" class="operation">
                            <div flex="main:center cross:center" class="view-operation" @click="toDetails('1')">查看操作</div>
                            <div class="pt5"><span class="op6">期均收益：</span><span class="op1">{{simulation_averageRate}}%</span></div>
                        </div>
                    </div>                                        
                    <div flex="dir:left cross:center" class="record-info fz14 mt2">
                        <div flex="dir:left cross:center" flex-box="1">
                        <div flex="main:center cross:center" class="record-type real-disk fz16 ml3">锦标赛</div>
                            <div flex="dir:top" class="ml3">
                                <div><span class="op6">参赛期数：</span><span class="op1">{{realDisk_periodsCount}}</span></div>
                                <div class="mt1"><span class="op6">比赛胜率：</span><span class="op1">{{realDisk_totalSuccessRate}}%</span></div>
                            </div>
                        </div>    
                        <div flex="dir:top" flex-box="0" class="operation">
                            <div flex="main:center cross:center" class="view-operation" @click="toDetails('0')">查看操作</div>
                            <div class="pt5"><span class="op6">期均收益：</span><span class="op1">{{realDisk_averageRate}}%</span></div>
                        </div>
                    </div>                        
                                                          
                </div>
            </div>
        </div>

        <!-- 遮罩 -->
        <div class="dialog-wrapper" v-if="dialog">
            <div class="dialog">
                <span class="closeTip" @click="dialog=false"></span>
                <div class="modal-content">
                    <div class="modal-title">提醒</div>
                    <p class="modal-text">{{tipText}}</p>
                </div>
                <div flex="main:center cross:center" class="ok-btn">
                    <div @click="dialog=false">知道了</div>
                </div>                
            </div>
        </div>
        <div class="dialog-wrapper" v-if="mNickname">
            <div class="dialog">
                <span class="closeTip" @click="mNickname=false"></span>
                <div flex="dir:top cross:center" class="modal-content">
                    <div class="modal-title">修改昵称</div>
                    <div flex="main:center cross:center" class="container-modify-nickname">
                        <input type="text" placeholder="请输入新昵称" v-model="nick_name">
                    </div>
                </div>
                <div flex="main:center cross:center" class="ok-btn">
                    <div class="btn-cancel" @click="mNickname=false">取消</div>
                    <div class="btn-ok" @click="modifyNickName">确定</div>
                </div>                
            </div>
        </div>
        <div flex="main:center">
            <div class="toast_wrap" v-if="showWrap" :class="showContent ?'fadein':'fadeout'">{{errorData}}</div>
        </div>
    </div>    
</template>
<script>
import urlConfig from './../../api/personalCenter.js'
export default {
    data() {
        return {
            money_num:0,
            curId:0,
            dialog:false,
            mNickname:false,
            nickname:'',
            userId:'',
            nick_name:'',
            continuity:0,
            cj_status:2,
            top1Count:'0',
            avatarUrl: '',
            segment:'',
            sign_list: [
                        {
                        "weekdays": "1",
                        "isSign": "0",
                        "gold": "3000"
                        },
                        {
                        "weekdays": "2",
                        "isSign": "0",
                        "gold": "3000"
                        },
                        {
                        "weekdays": "3",
                        "isSign": "0",
                        "gold": "4000"
                        },
                        {
                        "weekdays": "4",
                        "isSign": "0",
                        "gold": "4000"
                        },
                        {
                        "weekdays": "5",
                        "isSign": "0",
                        "gold": "4000"
                        },
                        {
                        "weekdays": "6",
                        "isSign": "0",
                        "gold": "5000"
                        },
                        {
                        "weekdays": "7",
                        "isSign": "0",
                        "gold": "5000"
                        }
                     ],
            weekArr: ['周一','周二','周三','周四','周五','周六','周日'],
            avaliableIncome:0,    
            totalEarnIncome:0,
            realDisk_avaliableIncome:0,
            realDisk_totalEarnIncome:0, 
            showWrap:false,    // 是否显示组件
            showContent:false,  // 作用:在隐藏组件之前,显示隐藏动画  
            errorData:'',
            tipText:'',
            periods:'',
            bestRank:'0',
            simulation_periodsCount:'0',
            simulation_averageRate:'0',
            simulation_totalSuccessRate:'0',
            realDisk_periodsCount:'0',
            realDisk_averageRate:'0',
            realDisk_totalSuccessRate:'0',
            isMpEnv:'',
            appId:''
        }
    },
    created:function(){
        this.isMpEnv = this.Util.common.getQueryString('isMp');
        this.userId = this.Util.common.getQueryString('userid');
    },
    mounted() {
        this.$nextTick(()=>{
            this.appId=this.isMpEnv=='true'?'wx1ca2e4335cab4e96_MINWX':'';
            this.gold_sum();
            this.load_user_info();
            this.getUserSegment();
            this.signList();
            this.get_total_info();
            this.get_real_report_info();
            this.getHonourData();
            this.getMyScoreData();
            this.getMyScoreRealData();
            // dplus统计
            let PLATFORM = this.isMpEnv=='true'?'MINIAPP':'H5';
            dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": PLATFORM });
        })

    },
    methods: {
        checkState(val){
            if(val==0){
                return 'wqd'
            }else if(val==3){
                return 'dqd-icon'
            }
        },
        showToast(msg,time) {
            if(!this.showContent){
                var time = time || 3000;
                this.errorData = msg;
                this.showWrap=true;
                this.showContent=true;
                setTimeout(() => {this.showContent = false} ,time);
                setTimeout(() => {this.showWrap=false} ,Number(time)+300);
            }
        },
        // 获取用户金币余额
        gold_sum(){
            let url = urlConfig.user+'share/api/gold_sum?user_id='+this.userId+'&share_test_tag=rpt';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    this.money_num = res.result.data;
                }
            })
        },        
        // 获取用户信息
        load_user_info(){
            let url = urlConfig.user+'share/open_api/load_user_info?user_id='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    this.nickname = res.result.nickname;
                    this.avatarUrl = res.result.photo;
                    console.log(res);
                }
            })
        },      
        // 获取用户段位
        getUserSegment(){
            $.ajax({
                url: urlConfig.apiAccunt+'/api/account/rank/info?hexunId='+this.userId,
                dataType: 'jsonp',
                success: res => {
                    if(res.resultKey=='ok'){
                        alert(res.data.rank)
                        if(res.data.rank!='none'){
                            this.segment='/src/images/segment/stockGod'+res.data.rank+'.png'
                        }
                    }
                }
            })
        },      
        // 修改昵称
        modifyNickName(){
            let that=this;
            let url = urlConfig.user+'share/user_api/modifyNickName?user_id='+this.userId+'&nick_name='+this.nick_name+'&share_test_tag=rpt';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    if(res.respCode=="T"){
                        that.mNickname=false;
                        that.nickname = that.nick_name;
                        that.showToast('昵称修改成功');
                        $.ajax({
                            url: urlConfig.apiAccunt+'/api/redis/nickNameToRedis?hexunId='+that.userId,
                            dataType: 'jsonp',
                            success: res => {
                                console.log(res);
                            }
                        })
                    }else{
                        that.showToast(res.errorData);
                    }
                }
            })
        },
        // 获取签到列表数据
        signList(){
            let that=this;
            let url = urlConfig.user+'share/sign_api/signList?user_id='+this.userId+'&share_test_tag=rpt';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    let weekDay = new Date().getDay();
                    let data = res.result;
                    if(data=='' || data.length==0){
                        return false;
                    }
                    that.sign_list=data;
                    
                    var j = 0;
                    var max = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].isSign == 1) {
                            j++;
                        } else {
                            if (j > max) {
                                max = j;
                            }
                            j = 0;
                        }
						if (data[i].weekdays >= weekDay && data[i].isSign!=1) {
							data[i].isSign=3;
						}                        
                    }
                    if (j > max) max = j;
                    that.continuity=max;
                    that.sign_list=data;
                }
            })
        }, 
        // 用户签到
        sign(){
            let that=this;
            let url = urlConfig.user+'share/sign_api/sign?user_id='+this.userId+'&share_test_tag=rpt';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    console.log(res);
                    if(res.respCode=="T") {
                        that.signList()
                    }else{
                        that.showToast(res.errorData);
                    }
                }
            })
        },                         
        // 锦标赛资金
        get_total_info(){
            let that=this;
            let url = urlConfig.apiAccunt+'/api/front/income/account/get_total_info?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    console.log(res);
                    // 可用锦标赛资金
                    that.realDisk_avaliableIncome = res.data.data.avaliableIncome;
                    // 累计
                    that.realDisk_totalEarnIncome = res.data.data.totalIncome;
                }
            })
        },                        
        // 我的奖金
        get_real_report_info(){
            let that=this;
            let url = urlConfig.apiAccunt+'/api/front/income/account/get_real_report_info?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    that.avaliableIncome = res.data.data.avaliableIncome;// 奖金
                    that.totalEarnIncome = res.data.data.totalEarnIncome;// 累计
                }
            })
        },
        toRecord(flag){
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/record/record?userid=' + this.userId + '&flag='+flag+'&isMp='+this.isMpEnv })
            } else {
                window.location.href='transRecord.html?userid='+this.userId+'&flag='+flag+'&isMp='+this.isMpEnv
            }            
        },
        toDetails(flag){
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/detailed/detailed?hxid=' + this.userId + '&state='+flag+'&isMp='+this.isMpEnv })
            } else {
                window.location.href='detailed.html?hxid='+this.userId+'&state='+flag+'&isMp='+this.isMpEnv
            }            
        },
        // 开启实盘校验
        real_account(){
            let that=this;
            let url = urlConfig.apiAccunt+'/api/front/income/account/valid/real_account?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    if(res.resultKey=='ok'){
                        switch (res.data.validData.code) {
                            case '0':
                                that.showToast('你已有实盘！');
                                break;
                            case '1':
                                that.showToast('你不是新用户！');
                                break;
                            case '2':
                                that.showToast('你已有提交记录！');
                                break;
                            case '3':
                                that.showToast('你的锦标赛资金不足1000');
                                break;
                            case '4':
                                that.approval();
                                break;
                            default:
                                that.showToast(res.errorMessage);
                                break;
                        }                        
                    }else{
                        that.showToast(res.errorMessage);
                    }
                }
            })
        },                                 
        // 用户开启实盘账户
        approval(){
            let that=this;
            let url = urlConfig.apiAccunt+'/api/front/income/comfirm/approval?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    if(res.resultKey=='ok'){
                        that.showToast('成功启动锦标赛资金');
                    }else{
                        that.showToast(res.errorMessage);
                    }
                }
            })
        },                                 
        // 我的奖金领取
        cash(){
            let that=this;
            let url = urlConfig.apiAccunt+'/api/front/income/apply/cash?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    if(res.resultKey=='ok'){
                        that.showToast('奖金领取成功');
                    }else{
                        that.showToast(res.errorMessage);
                    }
                }
            })
        },
        // 提到微信余额
        toWallet() {
            let that=this;
            console.log(that.appId);
            
            $.ajax({
                url: urlConfig.queryBalance,
                dataType: "jsonp",
                success: data => {
                    if (data.respCode == 'T' && data.result.is_success == 'T') {
                        data.result.account_list.forEach(item => {
                            if (item.account_type == '101') {
                                if (Number(item.available_balance) >= 1) {
                                    $.ajax({
                                        url: urlConfig.getWXTXurl,
                                        dataType: "jsonp",
                                        data: {
                                            backUrl: encodeURIComponent(location.href),
                                            appid: that.appId
                                        },
                                        success: data => {
                                            if (data.respCode == '0') {
                                                var url = 'https://callvip.hexun.com/rpsapi/jump?go_url='+ encodeURIComponent(data.respData);
                                                window.location.href = url;
                                            } else {
                                                that.showToast(data.errorMgs);
                                            }
                                        }
                                    })
                                } else {
                                    that.showToast('钱包余额不足1元');
                                }
                            }
                        })
                    } else {
                        that.showToast('您暂未开通钱包');
                    }
                }
            })
        },        
        // 查询荣耀时刻或最好成绩
        getHonourData(){
            let that=this;
            let url = urlConfig.apiAccunt+'/api/redis/getHonourData?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    console.log(JSON.stringify(res));
                    if(res.resultKey=='ok'){
                        let status = res.data.honourData.status;
                        that.cj_status = status;
                        if(status=='2'){
                            // 得过第一
                            that.periods = res.data.honourData.periods;
                            that.top1Count = res.data.honourData.top1Count;
                        }else if(status=='1'){
                            // 有排名
                            that.bestRank = res.data.honourData.bestRank;
                            that.periods = res.data.honourData.periods;
                        }else {
                            // 没有参加过比赛
                        }
                    }
                }
            })
        },                                 
        // 我的战绩(模拟盘)
        getMyScoreData(){
            let that=this;
            let url = 'https://api-stockmatch.hexun.com/api/redis/getMyScoreData?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    console.log(res);
                    if(res.resultKey=='ok'){
                        let simulation_status = res.data.myScoreData.status;
                        that.simulation_status = simulation_status;
                        if(simulation_status==1){
                            that.simulation_periodsCount = res.data.myScoreData.periodsCount; //参赛期数
                            let totalSuccessRate = res.data.myScoreData.totalSuccessRate; //胜率
                            that.simulation_totalSuccessRate = totalSuccessRate.toString().slice(0,5);
                            let averageRate = res.data.myScoreData.averageRate; //期均收益
                            that.simulation_averageRate = averageRate.toString().slice(0,5);
                        }
                    }
                }
            })
        },                                 
        // 我的战绩(实盘)
        getMyScoreRealData(){
            let that=this;
            let url = 'https://api-stockmatch.hexun.com/api/real/redis/getMyScoreRealData?hexunId='+this.userId;
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: res => {
                    if(res.resultKey=='ok'){
                        let realDisk_status = res.data.myScoreRealData.status;
                        that.realDisk_status = realDisk_status;
                        if(realDisk_status==1){
                            that.realDisk_periodsCount = res.data.myScoreRealData.periodsCount; //参赛期数
                            let totalSuccessRate = res.data.myScoreRealData.totalSuccessRate; //胜率
                            that.realDisk_totalSuccessRate = totalSuccessRate.toString().slice(0,5);
                            let averageRate = res.data.myScoreRealData.averageRate; //期均收益
                            that.realDisk_averageRate = averageRate.toString().slice(0,5);
                        }
                    }
                }
            })
        }                                 
    }
};
</script>
<style lang='less' scoped>
@bast: 2/100rem;
.w(@num){
    width: @num*@bast;
}
.h(@num){
    height: @num*@bast;
}
.f(@num){
    font-size: @num*@bast;
}
.fz14 {
    .f(14);
}
.fz16 {
    .f(16);
}
.pa{
    position: absolute;
}
.cf {
    color: #fff;
}
.personalCenter {
    .pa;
    color: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #282F7E;
}
.mt1 {
    margin-top: .16rem;
}
.mt2 {
    margin-top: .16rem;
}
.mtb2 {
    margin: .2rem 0 .2rem 0;
}
.ml3 {
    margin-left: .3rem;
}
.mt-8 {
    margin-top: -8%;
}
.mt-1 {
    margin-top:.1rem;
}

.main {
  height: 100%;
  overflow: auto;
  background-image: linear-gradient(-180deg, #3d7fd3 0%, #2552b4 100%);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  .content {
      width: 100%;
      margin: .2rem
  }
}
.gold-coin-icon {
  width: .48rem;
  height: .48rem;
  background-image: url(../../images/yqd.png);
  background-size:100% 100%;
  z-index: 2;
}
.gold-coin-num {
    .f(14);
    width: 1.76rem;
    height: .46rem;
    background: #26378B;
    margin-left: -.2rem;
    text-indent: .24rem;
    border-radius: 0 100px 100px 0;
}
.avatar {
    width: 1.28rem;
    height: 1.28rem;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    overflow:hidden;
    img {
        width: 1.28rem;
        height: 1.28rem;
        border-radius: 50%;        
    }
}
.segment {
    .w(34);
    .h(16);
    margin-left: .1rem;
}
.level {
    width: .72rem;
    height: .32rem;
    text-align: center;
    background: #DF5144;
    border-radius: 100px;
    margin-top: -.24rem;
}
.nickname {
    font-size: .32rem;
}
.userId {
    .f(12);
}
.modify-nickname {
    width: 1.28rem;
    height: .48rem;
    border: 1px solid rgba(255,255,255,0.30);
    border-radius: 2px;
}

.tab-title {
    .h(36);
    .fz16;
    margin-top: .5rem;
    background: #26378B;
    box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.30);
    border-radius: 100px;
    div:first-child {
        border-radius: 100px 0 0 100px;
    }
    div:last-child {
        border-radius: 0 100px 100px 0;
    }
}
.cur {
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
    background-image: linear-gradient(0deg, #1974EF 0%, #50A8FF 100%);
}
.tab-content {
    margin-top: .2rem;
    padding-bottom: .4rem; 
}
.attendance-text {
    position: relative;
    left: 10px;
}
.attendance-text:before {
    .w(4);
    .h(14);
    content: ""; 
    position: absolute;
    left: -10px;
    bottom: 2px;
    background-image: linear-gradient(-180deg, #FFDF5F 0%, #FF9C28 100%);
    border-radius: 100px;
}
.continuity {
    color:#FFCF2F;
    margin:0 .06rem;
}
.attendance-list {
  display: flex;
  flex-flow: row wrap;
  margin-top: .16rem;
  align-content: flex-start;
  border-radius: 4px;
  overflow: hidden;
  li {
    box-sizing: border-box;
    flex: 0 0 25%;
  }
}
.week {
    .h(22);
    background-image: linear-gradient(0deg, #1974EF 0%, #50A8FF 100%);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.29);
}
.attendance-item {
    .h(77);
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.25);
}
.yqd {
    display: block;
    width: .54rem;
    height: .54rem;
    background-image: url(../../images/qd.png);
    background-size: cover;
    background-repeat: no-repeat;
}
.wqd {
    background-image: url(../../images/wqd.png);
}
.yqd-icon {
    margin: -0.02rem 0 0.08rem 0;
    display: block;
    width: .48rem;
    height: .48rem;
    background-image: url(../../images/yqd.png);
    background-size: 100% 100%;
}
.wqd-icon {
    background-image: url(../../images/wqd-icon.png);
}
.dqd-icon {
    background-image: url(../../images/dqd.png);
}
.yqd-jb {
    color: #FF9C28;
}
.wqd-jb {
    color: #999999;
}
.attendance {
    .h(99);
    background: #FF9C28;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
}
.real-money {
    .h(60);
    background-image: linear-gradient(0deg, #1974EF 0%, #50A8FF 100%);
    border: 1px solid rgba(255,255,255,0.50);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.29);
    border-radius: 6px;    
}
.money-title {
    .f(14);
    opacity: 0.6;
}
.tip {
    width: 0.28rem;
    height: 0.28rem;
    background-image: url(../../images/tip.png);
    background-size: 100% 100%;
    margin-left: .12rem;
}
.money-num {
    .f(18)
}
.accumulative {
    .f(14);
    margin-left: .2rem
}
.open-real-money {
    .w(95);
    .h(24);
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    margin-right: .2rem
}
.bonusTip {
    margin:0.12rem 0.2rem 0 0;
}
.bonusTipSpan {
    color: #FF9C28;
    margin-left:.06rem;
}

// 战绩部分
.glory-moment {
    .h(178);
    border-radius: 6px;
    margin-top: .16rem;
    position: relative;
    background-image: url(../../images/gm1.png);
    background-size: cover;    
}
.glory-moment2 {
    background-image: url(../../images/gm2.png);    
}
.glory-con {
    .w(100);
    .h(100);
    background-image: url(../../images/jb.png);
    background-size: 100%;
}
.glory-con2 {
    width: 2.2rem;
    height: 1.9rem;
    background-image: url(../../images/hz.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.record-date {
    position: absolute;
    top: 8%;
    right: 4%;
    .date {
        text-align:right
    }    
}
.peak {
    .f(18);
    margin-top: .12rem;
    span {
        color: #FFCF2F;
    }
}
.record-info {
    .h(86);
    .f(14);
    background-image: linear-gradient(0deg, #1974EF 0%, #50A8FF 100%);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.29);
    border-radius: 4px;
}
.record-type {
    .w(64);
    .h(64);
    border-radius: 50%;
    background: #FFCF2F;
}
.real-disk {
    background: #9178FF;
}
.view-operation {
    .h(24);
    .w(80);
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    margin-top: -7%;
    position: absolute;
    right: 0;
}
.operation{
    margin-right: .3rem;
    position: relative;
}
.pt5 {
    padding-top: .5rem;
}
/* 弹窗start */
.closeTip {
    display: block;
    width: .52rem;
    height: .48rem;
    background-image: url(../../images/coin2.png);
    background-size:cover;
    position: absolute;
        right: 0;
    top: -10px;
    z-index: 9998;
}
.modal-content {
    width: 100%;
    .h(132);
    border-radius: 6px 6px 0 0;
    background: #FFFFFF;
}
.modal-title {
    .f(18);
    font-weight: bold;
    color: #333333;
    text-align: center;
    padding-top: 5%;
    padding-bottom: 6%;
}
.modal-text {
    .f(16);
    color: #666666;
    margin-left: 5.3%;
}
.ok-btn {
    width: 100%;
    .h(78);
    background: #F2F2F2;
    border-radius: 0 0 6px 6px;
    div {
        .w(180);
        .h(48);
        .f(18);
        text-align: center;
        line-height: 0.96rem;
        background-image: linear-gradient(-180deg, #FFDF69 0%, #F79B2A 100%);
        box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.20);
        border-radius: 100px;         
    }
}

.dialog-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.50);
    z-index:999;
}
.dialog {
    .w(320);
    .h(210);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 6px;
    background-color: #FFFFFF;
}
.closeTip {
    .f(18);
    .w(32);
    .h(32);
    line-height: 0.58rem;
    right: -10px;
    text-align: center;
    top: -10px;
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)), radial-gradient(#f2f2f2, #cccccc);
    border-radius: 50%;
    box-shadow: inset 0 1px 1px rgba(191, 191, 191, 0.75), 0 2px 1px rgba(0, 0, 0, 0.25);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    border: 2px solid #e6e6e6;
    color: #F96533;
    position: absolute;
}
.closeTip:before {
    content: "\2716";
}
/* 弹窗end */

.container-modify-nickname {
    .w(290);
    .h(48);
    background: #DCF4FF;
    box-shadow: inset 1px 1px 1px 0 rgba(184,214,255,0.80);
    border-radius: 4px;
    input {
        .f(14);
        .w(270);
        .h(40);
        background: #DCF4FF;
    }
    input::-webkit-input-placeholder {
         color: #71ABFF;
     }
}

.btn-cancel {
    width: 2.74rem !important;
    color: #999999;
    margin-right: .2rem;
    background-image: linear-gradient(-180deg, #EAEAEA 0%, #D8D8D8 100%)  !important;
}
.btn-ok {
    width: 2.74rem !important;
}
.op6 {
    opacity: 0.6;
}
.op1 {
    opacity: 1;
}

.toast_main {
    display: flex;
    justify-content: center;
  }
.toast_wrap{
    min-width: 120px;
    position: fixed;
    margin:auto;
    bottom: 6%;
    background: rgba(0,0,0,.60);
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    color:#fff;
    box-sizing: border-box;
    z-index: 999999;
  }
  .fadein {
    animation: animate_in 0.25s;
  }
  .fadeout {
    animation: animate_out 0.25s;
    opacity: 0;
  }
  @keyframes animate_in {
    0% {
      opacity: 0;
      -webkit-transform:scale(.2);
      transform: translateY(100px)
    }
    100%{
      opacity: 1;
      -webkit-transform:scale(12);
      transform: translateY(0)
    }
  }
  @keyframes animate_out {
    0% {
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
</style>