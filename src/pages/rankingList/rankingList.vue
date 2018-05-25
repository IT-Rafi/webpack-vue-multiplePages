
<template>
    <div id="container">
        <div class="date">{{users.periods}}期<span>({{users.startDate}}至{{users.endDate}})</span>
            <img v-if="users.proceed==1" src="../../images/jxz.png" alt="">
            <img v-else src="../../images/yjs.png" alt="">
        </div>
        <div class="usermsg">
            <div class="msgleft">
                <img :src="users.logoUrl" alt=""><span>{{users.nickName}}</span><img v-if="users.userRank!=-2" class="ranknum" :src="'images/level'+users.userRank+'.png'" alt="">
            </div>
            <ul class="msgrig">
                <li>
                    <p>我的排名</p>
                    <span>{{users.rank}}</span>
                </li>
                <li>
                    <p>收益率</p>
                    <span>{{users.rate}}%</span>
                </li>
            </ul>
        </div>
        <div class="transaction">
            <div class="transleft">
                <img src="../../images/Group.png" alt="">
                <p>登顶吃鸡者将额外获得<span>10000</span>元锦标赛资金</p>
            </div>
            <div class="transrig enterMimic" @click="goenter"></div>
        </div>
        <div class="past">
            <p class="pastleft">更新时间:{{users.updateTime}}</p>
            <span class="pastname" @click="prevhref" v-if="isprev"><img src="../../images/wqpm.png" alt="">往期排名</span>
        </div>
        
        <div class="rankList">
            <div class="haverank" v-if="isshow">
                <div class="rankListTtile">
                    <div class="Equal pm">排名</div>
                    <div class="Equal nic">昵称</div>
                    <div>收益率</div>
                </div>
                <div class="lists">
                    <div class="Single" v-for="(item, index) in listData">
                        <div class="ranks Equal">
                            <span v-if="index==0"><img src="../../images/leaderboard_no1.png" alt=""></span>
                            <span v-else-if="index==1"><img src="../../images/leaderboard_no2.png" alt=""></span>
                            <span v-else-if="index==2"><img src="../../images/leaderboard_no3.png" alt=""></span>
                            <span v-else>{{index+1}}</span>
                        </div>
                        <div class="userHead Equal">
                            <img :src="item.logoUrl" @click="persons(item.client_id)"  alt="">{{item.nickName}}
                            <img  v-if="item.userRank!=-2"  id="rankdw" :src="'images/level'+item.userRank+'.png'" alt="">
                        </div>
                        <div class="Profit">{{toDecimal(item.rate)}}%</div>
                    </div>
                </div>
            </div>
            <div class="notrank" v-else>
                <img class="crown" src="../../images/leaderboard_emptystates.png" alt="">
                <h3>虚位以待</h3>
                <p>暂无人上榜，快去交易打榜吧</p>
                <img class="button enterMimic" @click="goenter" src="images/tradebutton.png" alt="">
            </div>
        </div>


        <span @click="reset" class="sx">
            <img src="../../images/icon_sx.png" alt="刷新按钮">
        </span>
        <p id="loading">
            <img src="../../images/loading.gif" alt="">
        </p>
        <div class='mask hide'></div>
        <section class="mess suc-tc tx-tc hide">
            <div class="txt-c">
                <p class='suc-text c-fff'></p>
            </div>
        </section>
        <modalComponent v-if='modalShow' :modalMsg='modalMsg' :btnObj='btnObj' :closeBtn='closeBtn' :cfmOperate="cfmOperate" :title='modalTitle' :canInput='modalHasInput' :level='userLevel' @closeModal='closeModal' @openMimic='openMimic' @openActual='openActual' @confirmOpenActual='confirmOpenActual' @doMission='doMission'></modalComponent>
    </div>
</template>    
    <script>
    import urlConfig from '../../api/index.js'
    import modalComponent from '../index/modalComponent.vue'
    export default {
        components: {
            modalComponent: modalComponent
        },
        data: function () {
            return {
                users: {userRank:-2},
                isprev: true,
                listData: [],
                isshow: true,
                modalShow:false,
                modalMsg: '',
                btnObj: {},
                modalTitle: '',
                modalHasInput: false,
                userLevel: -2,
                cfmOperate: "", //openM,close
                closeBtn: null,
                coinNum:0
            }
        },
        mounted: function () {
            $("#loading").show()
        },
        created(){
            document.title="战力排行榜";
            var hxid = this.getUrlParam("hxid");
            this.isMp = this.Util.common.getQueryString('isMp');
            if (this.isMp == 'true') {
                dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": "MINIAPP" });
            } else {
                dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": "H5" });
            }
            if (hxid) {
                this.userid = hxid;
            } else {
                this.userid = ""
            }
            this.getUsermage();
            this.getPrev();
            this.getRanklist()
            this.getCoinNum(this.userid)
        },
        methods: {
            getUsermage: function () {
                var that = this;
                $.ajax({
                    type: "post",
                    url: urlConfig.oneyieldRate+"?hexunId=" + that.userid,
                    dataType: "jsonp",
                    success: function (data) {
                        console.log(data);
                        if (data.resultKey == "ok" && data.data.oneyieldRate != "") {
                            console.log(data.data.oneyieldRate[0]);
                            that.users = data.data.oneyieldRate[0];
                            that.users.updateTime = that.users.updateTime.split(" ")[0];
                            that.users.startDate = that.users.startDate.substring(5);
                            that.users.endDate = that.users.endDate.substring(5);
                            if (that.users.rate == "") {
                                that.users.rate = "--"
                            } else {
                                that.users.rate = that.toDecimal(that.users.rate)
                            }
                            if (that.users.rank == "") {
                                that.users.rank = "--"
                            }
                        }
                    }
                });
            },
            goenter: function () {
                this.confirmOpenMimic()
            },
            prevhref: function () {
                if (this.isMp == 'true') {
                    wx.miniProgram.navigateTo({ url: "/pages/previousRanking/previousRanking?hxid=" + this.userid + "&isMp=true" })
                } else {
                    location.href = urlConfig.domain+"/front/previousRanking.html?hxid=" + this.userid;
                }


            },
            getUrlParam: function (string) {
                //构造一个含有目标参数的正则表达式对象  
                var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
                //匹配目标参数  
                var r = window.location.search.substr(1).match(reg);
                //返回参数值  
                if (r != null) return unescape(r[2]);
                return null;
            },
            getPrev: function () {
                var that = this;
                $.ajax({
                    type: "post",
                    url: urlConfig.previousyieldRate+"?hexunId=" + that.userid + "&pageNO=1",
                    dataType: "jsonp",
                    success: function (data) {
                        //                  console.log(data);
                        if (data.resultKey == "ok" && data.data.previousyieldrate == "") {
                            that.isprev = false;
                        }
                    }
                });
            },
            getRanklist: function () {
                var that = this;
                $.ajax({
                    type: "post",
                    url: urlConfig.chickenList+"?hexunId=" + that.userid,
                    dataType: "jsonp",
                    success: function (data) {
                        //                  console.log(data);
                        if (data.resultKey == "ok" && data.data.yieldrate != "") {
                            console.log(data);
                            that.listData = (data.data.yieldrate).sort(that.sorts("rank"));
                        } else {
                            that.isshow = false
                        }
                        $("#loading").hide()
                    }
                });
            },
            sorts: function (property) {
                return function (x, y) {
                    var a = x[property],
                        b = y[property];
                    if (isNaN(a)) {
                        return a.localeCompare(b)
                    } else {
                        return a - b
                    }
                }
            },
            reset: function () {
                this.getRanklist();
                this.getUsermage();
                $("#loading").show()
            },
            persons: function (client_id) {
                if (this.isMp == 'true') {
                    wx.miniProgram.navigateTo({ url: "/pages/personalRecord/personalRecord?userId=" + client_id + "&isMp=true" })
                } else {
                    location.href = urlConfig.domain+"/front/personalRecord.html?userId=" + client_id
                }

            },
            toDecimal: function (x) {
                var f = parseFloat(x);
                if (isNaN(f)) {
                    return "--";
                }
                var f = Math.round(x * 100) / 100;
                var s = f.toString();
                var rs = s.indexOf('.');
                if (rs < 0) {
                    rs = s.length;
                    s += '.';
                }
                while (s.length <= rs + 2) {
                    s += '0';
                }
                return s;
            },
            closeModal() {
                this.modalShow = false;
            },
            //拿到和讯id去获取模拟盘的情况并处理
            openMimic(openNum) {
                this.closeModal();
                $.ajax({
                    url: urlConfig.regMimic + '?hexunId=' + this.userid + '&parAmount=' + openNum,
                    dataType: 'jsonp',
                    success: data => {
                        console.log(data)
                        // debugger
                        if (data.resultKey == 'ok') {
                            if (data.data.account == null) {
                                this.Util.common.msgTip('模拟盘注册接口：未返回account对象');
                                return;
                            }
                            if (data.data.account.isNewUser) {
                                this.showModal('股神争霸新用户您好，30000金币已放入您的钱包，快去预选赛大显身手吧', 'geted');
                                this.coinNum = Number(this.coinNum) + 20000;
                                this.$nextTick(() => {
                                    if (this.coinNum >= 10000) {
                                        $('.progress').width('100%');
                                        $('.coin-icon').css('left', '2.95rem');
                                    } else {
                                        $('.progress').width((this.coinNum / 100).toFixed(2) + '%');
                                        $('.coin-icon').css('left', (3.05 * (Number(this.coinNum).toFixed(2) / 10000) - 0.08) + 'rem');
                                    }
                                })
                            } else {
                                if (this.isMpEnv == 'true') {
                                    wx.miniProgram.navigateTo({ url: '/pages/simulation/simulation?client_id=' + this.userid + '&fund_account=' + data.data.account.accountId })
                                } else {
                                    window.location.href = urlConfig.mimicEnv + '?client_id=' + this.userid + '&fund_account=' + data.data.account.accountId;
                                }
                            }

                        } else {
                            this.Util.common.msgTip('模拟盘注册接口：' + data.errorMessage)
                        }
                    }
                })
            },
            getCoinNum(userid) {
                $.ajax({
                    url: urlConfig.coinNum + userid,
                    dataType: 'jsonp',
                    success: data => {
                        if (data.respCode == 'T') {
                            
                            this.coinNum = Number(data.result.data.toFixed(0));
                            this.$nextTick(() => {
                                console.log(this.coinNum)
                                if (this.coinNum >= 10000) {
                                    $('.progress').width('100%');
                                    $('.coin-icon').css('left', '2.95rem');
                                } else {
                                    $('.progress').width((this.coinNum / 100).toFixed(0) + '%');
                                    $('.coin-icon').css('left', (3.05 * (Number(this.coinNum) / 10000) - 0.08) + 'rem');
                                }
                            })
                        } else {
                            this.Util.common.msgTip('大网金币接口exception')
                        }
                    }
                })
            },
            validMimicAccount(userid) {
                $.ajax({
                    url: urlConfig.queryMimic + '?hexunId=' + userid,
                    dataType: 'jsonp',
                    success: data => {
                        console.log(data)
                        //确定接口正常response
                        if (data.resultKey == 'ok') {
                            let res = data.data.persionyieldRate;
                            this.nextPeriod = res.periods;
                            this.mimicTips = res.isTranstion == 0 ? res.periods.slice(2, 6) + '期即将开赛' : res.periods.slice(2, 6) + '期已开赛';
                            this.actualTips = res.isTranstion == 0 ? res.periods.slice(2, 6) + '期即将开赛' : res.periods.slice(2, 6) + '期已开赛';
                            if (res.personData.status == 0) {
                                //在期，显示模拟盘情况
                                this.mimicStatus = 'hasMimic';
                                this.mimicObj = res.personData;
                            } else if (res.personData.status == 1) {
                                //不在期，有战报
                                this.mimicStatus = 'report';
                                this.mimicReportObj = res.personData;
                            } else {
                                this.mimicStatus = 'openMimic';

                            }
                        } else {
                            //系统错误
                            this.Util.common.msgTip('模拟盘非实时查询接口：' + data.errorMessage);
                        }
                    },
                    error: (XMLHttpRequest, textStatus, errorThrown) => {
                        console.log(textStatus)
                    }
                })
            },
            confirmOpenMimic() {
                $.ajax({
                    url: urlConfig.queryMimicRT + '?hexunId=' + this.userid,
                    dataType: 'jsonp',
                    success: data => {
                        console.log(data)
                        if (data.resultKey == 'ok') {
                            //判断是否有模拟盘记录
                            if (data.businessKey == 'user_is_null') {
                                this.openMimic(10000);
                            } else {
                                this.userLevel = data.data.fundAccount.rank;
                                //不在期
                                if (data.data.fundAccount.status == 0) {
                                    
                                    this.$nextTick(() => {
                                        console.log(this.coinNum)
                                        if (this.coinNum < 10000) {
                                            //金币不足
                                            this.showModal(
                                                '您的金币不足10000，不能参与预选赛，做任务免费得金币', 'doMiss');
                                        } else {
                                            // this.showModal('您将消费10000金币参与' + this.nextPeriod.slice(2, 6) + '期预选赛', 'cfmsCancle', 'openM', false);
                                            //这里去判断段位
                                            if (data.data.fundAccount.rank == -2 || data.data.fundAccount.rank == 1 || data.data.fundAccount.rank == 0 || data.data.fundAccount.rank == -1) {
                                                let num = data.data.fundAccount.rank == -1 ? '5000' : '10000';
                                                this.showModal('您将消费' + num + '金币参与' + this.nextPeriod.slice(2, 6) + '期预选赛', 'cfmsCancle', 'openM', false);
                                            } else {
                                                this.showModal(
                                                    '您是股神' + data.data.fundAccount.rank + '段，单次预选赛最高可以使用' + data.data.fundAccount.rank + '万金币', 'cfmsCancle', 'openM', false, true, '启用资金');
                                            }
                                        }
                                    })

                                } else {
                                    //在期，跳转模拟盘
                                    if (this.isMpEnv == 'true') {
                                        wx.miniProgram.navigateTo({ url: '/pages/simulation/simulation?client_id=' + this.userid + '&fund_account=' + data.data.fundAccount.accountId })
                                    } else {
                                        window.location.href = urlConfig.mimicEnv + '?client_id=' + this.userid + '&fund_account=' + data.data.fundAccount.accountId;
                                    }
                                }

                            }

                        } else {
                            this.Util.common.msgTip('模拟盘查询接口：' + data.errorMessage);
                        }
                    }
                })


            },
            doMission() {
                this.closeModal();
                if (this.isMpEnv == 'true') {
                    wx.miniProgram.navigateTo({ url: "/pages/InvitingFriends/InvitingFriends?userId=" + this.userid + '&isMp=true' });
                } else {
                    this.Util.common.msgTip('分享赚金币功能只可在小程序使用');
                }

            },
            openActual() {
                this.closeModal();
                $.ajax({
                    url: urlConfig.regActual + '?hexunId=' + this.userid,
                    dataType: 'jsonp',
                    success: data => {
                        if (data.resultKey == 'ok') {
                            this.modalShow = false;
                            this.Util.common.msgTip('审核提交成功');
                        } else {
                            this.modalShow = false;
                            this.Util.common.msgTip('申请审核接口：' + data.errorMessage);
                        }
                    }
                })
            },
            confirmOpenActual() {
                this.showModal(
                    '您将消费' + this.actualNum + '牛币参与锦标赛，审核通过后下一交易日开赛。', 'cfmsCancle', 'openA', false);
            },
            showModal(msg, btn, cfmOperate = 'close', close = true, canInput = false, title = '提醒') {
                let btnArr = btn.split(',');
                this.modalMsg = msg;
                this.btnObj = {};
                this.closeBtn = close;
                this.modalTitle = title;
                this.modalHasInput = canInput;
                this.cfmOperate = cfmOperate;
                btnArr.map(item => {
                    this.btnObj[item] = true;
                })
                this.modalShow = true;
            },
        }
    }
    </script>
    <style lang='less' scoped>
        #container{
            font-size:.28rem;
            padding: .3rem .3rem 0;
            box-sizing: border-box;
            background: #f65836;
            height: 100%;
        }
        .sx{
            position: fixed;
            bottom: .6rem;
            right: .3rem;;
        }
        .sx img{
            width: .88rem;
            height: .88rem;
        }
        .date{
            color: #fff;
        }
        .date img{
            width: 1.08rem;
            height: .4rem;
            vertical-align: middle;
        }
        .date span{
            padding:0 .4rem;
        }
        .usermsg{
            overflow: hidden;
            margin: .2rem 0;
            display: flex;
            display: -webkit-flex;
        }
        .usermsg .msgleft{
            flex: 3;

        }
        .usermsg .msgleft img{
            width: .6rem;
            height: .6rem;
            background: #eee;
            border-radius: 50%;
            overflow: hidden;
            vertical-align: middle
        }
        .usermsg .msgleft .ranknum{
            width: 0.6rem;
            height: .3rem;
            border-radius: 0;
            margin-left: 2px;
        }
        .usermsg .msgleft span{
            color: #fff;
            padding-left: .2rem;
        }
        .usermsg .msgrig{
            flex: 2;
            display: flex;
            display: -webkit-flex;
            margin-left: .8rem
        }
        .usermsg .msgrig li{
            flex: 1;
            text-align: center;
        }
        .usermsg .msgrig li:nth-child(1){
            // margin-right: .2rem
        }
        .usermsg .msgrig li p{
            font-size: .24rem;
            color: #fff;
        }
        .usermsg .msgrig li span{
            font-size: .36rem;
            color:#FFDA00; 
        }
        .transaction{
            width: 100%;
            background: #FFF9EB;
            border: 1px solid #AD2126;
            border-radius: 5px;
            overflow: hidden;
            padding: .2rem;
            box-sizing: border-box;
        }
        .transleft{
            float: left;
        }
        .transleft p{
            display: inline-block;
            color: #6C3806;
            width: 4.1rem;
            padding-left: .1rem;
        }
        .transleft p span{
            color: #f7ac01;
        }
        .transleft img{
            width: .48rem;
            height: .48rem;
            vertical-align: initial;
        }
        .transrig{
            float: right;
            width: 1.28rem;
            height: .6rem;
            text-align: center;
            line-height: .6rem;
            color: #fff;
            background: url("../../images/tradebutton.png") no-repeat;
            background-size: 100%;
            margin-top: .08rem;
        }
        .past{
            width: 100%;
            overflow: hidden;
            color: #fff;
            margin: .2rem 0;
        }
        .pastleft{
            float: left;
            font-size: .24rem;
            margin-top: .05rem;
        }
        .pastname{
            float: right;
        }
        .pastname img{
            width: .32rem;
            height: .32rem;
            vertical-align: middle;
        }

        /* 有排行显示 */
        .rankList{
            width: 100%;
            background: #FFF9EB;
            border: 1px solid #AD2126;
            border-radius: 5px;
            overflow: hidden;
            padding: .2rem;
            box-sizing: border-box;
        }

        .rankListTtile{
            font-size: .24rem;
            color: #7c5020;
            border-bottom: 1px solid #E3D1BD;
            padding-bottom: .1rem;
        }
        .rankListTtile,.Single{
            display: flex;
            display: -webkit-flex;
            flex-direction: row;
        }
        .rankListTtile .nic{
            padding-left: 1rem;
        }
        .rankListTtile .pm{
            flex: 0 0 .8rem;
        }
        .Equal{
            flex: 1;
        }
        .Single{
            border-bottom: 1px solid #E3D1BD;
        }
        .Single div{
            margin: .2rem 0 .1rem;
        }
        .Single .ranks{
            flex: 0 0 .8rem;
            padding-top: .1rem;
        }
        .Single .ranks span{
            display: inline-block;
            text-align: center;
            width: .5rem;
            height: .5rem;
            line-height: .5rem;
        }
        .Single .ranks img{
            width: .45rem;
            height: .36rem;
            vertical-align: middle;
        }
        .Single .userHead{
            color: #6B3906;
        }
       
        .Single .userHead img{
            width: .72rem;
            height: .72rem;
            vertical-align: middle;
            margin-right: 5px;
            border-radius: 50%;
        }
        .Single .userHead #rankdw{
            width: .6rem;
            height:.3rem;
            border-radius: 0
        }
        .Single .Profit{
            font-size: .32rem;
            color: #c81528;
            font-weight: bold;
            padding-top: .1rem;
        }

        /* 没有排行显示 */
        .notrank{
            text-align: center;
            margin:.5rem 0;
        }
        .notrank .crown{
            width: 1.2rem;
            height: 1rem;
        }
        .notrank h3{
            font-size: .36rem;
            color: #7c5020;
            margin: .1rem 0;
        }
        .notrank p{
            color: #7c5020;
            margin-bottom: .2rem;
        }
        .notrank img{
            width: 1.72rem;
            height: .8rem;
        }

        #loading{
            position: fixed;
            width: 2rem;
            height: 2rem;
            margin: -1rem 0 0 -1rem;
            left: 50%;
            top: 50%;
            background: rgba(0,0,0,.5);
            border-radius: 10px;
            text-align: center;
            line-height: 2.3rem;
        }
        #loading img{
            vertical-align: inherit;
            width: .6rem;
            height: .6rem;
        }

       
        .pt30 {
            padding-top: 0.3rem;
        }
        .ft36 {
            font-size: .36rem;
        }
        .red {
            color: #ee5050;
        }
        .fc_9 {
            color: #999;
        }
        .ft24 {
            font-size: 0.241rem;
        }
        .tx-tc-btn {
            padding: .2rem .3rem;
        }
        .pt20 {
            padding-top: 0.2rem;
        }
        .btn-100 {
            width: 100%;
            height: .8rem;
            line-height: .8rem;
        }
        .btn-red {
            background: #ee5050;
            box-shadow: 0px 2px 5px #ee5050;
            display: inline-block;
            font-size: .28rem;
            cursor: pointer;
            border-radius: 999rem;
            text-align: center;
            color: #fff;
        }

        .error{
            position: absolute;
            width: 80%;
            left: 10%;
            top: 30%;
            text-align: center;
            color: #ee5050;
            background: #fff;
            padding: .2rem;
            box-sizing: border-box;
            border-radius: 5px;
            display:none;
        }
        .mask {
            background: rgba(0, 0, 0, .5);
            width: 100%;
            height: 100%;
            z-index: 19;
            position: fixed;
            top: 0px;
            left: 0px;
        }
        .mess {
            position: absolute;
            width: 80%;
            left: 10%;
            top: 30%;
            background: #fff;
            border-radius: .2rem;
            z-index: 20;
        }
        .suc-tc {
            width: 56%;
            font-size: .3rem;
            position: fixed;
            left: 22%;
            top: 40%;
            background: rgba(0, 0, 0, .6);
            border-radius: .25rem;
            z-index: 20;
            padding: .2rem .2rem;
            color: #fff
        }
        .hide{
            display: none
        }
    </style>
    
