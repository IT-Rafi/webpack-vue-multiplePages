<template>
    <div class='container'>
        <!-- 规则入口 -->
        <span class='ruleBtn' @click='toRule'></span>
        <span class='refresh' @click='refreshPage'></span>
        <div class="header">
            <div class='headerL'>
                <span class='redDot' v-show='showDot'></span>
                <img class="photo" :src='photo' @click='toAccount'></img>
            </div>
            <div class='headerR'>
                <div class="HrTop"><span class='nickName'>{{nickname||'未登录'}}</span><img class='levelImg' v-if='userLevel>-2' :src='"../../images/level"+userLevel+".png"'><span class="mission" @click='doMission'>做任务赚金币</span></div>
                <div class="HrBottom">
                    <span class='coin-icon'></span>
                    <div class="coinProgress">
                        <div class="progress"></div>
                    </div>
                    <span class='coinNum'>{{coinNum||'0'}}<span class='c-fff'>/10000</span></span>
                </div>
            </div>
        </div>
        <div class="stockIndex">
            <div class='hu'>
                <span class='icon-hu'>沪</span>
                <span class="stockNum"><span class="asset">{{hu[0]>0?(hu[0]/100).toFixed(2):'--'}}</span><span class="income" :class="[hu[1]>=0?'c-zhang':'c-die']">{{hu[1]>0?'+':''}}{{hu[1]/100}}%</span></span>
            </div>
            <div class='hu shen'>
                <span class='icon-hu'>深</span>
                <span class="stockNum"><span class="asset">{{shen[0]>0?(shen[0]/100).toFixed(2):'--'}}</span><span class="income" :class="[shen[1]>=0?'c-zhang':'c-die']">{{shen[1]>0?'+':''}}{{shen[1]/100}}%</span></span>
            </div>
            <div class='hu chuang'>
                <span class='icon-hu'>创</span>
                <span class="stockNum"><span class="asset">{{chuang[0]>0?(chuang[0]/100).toFixed(2):'--'}}</span><span class="income" :class="[chuang[1]>=0?'c-zhang':'c-die']">{{chuang[1]>0?'+':''}}{{chuang[1]/100}}%</span></span>
            </div>
            <div class='shen'></div>
            <div class='chuang'></div>
        </div>
        <div class="noob" @click='toBenben'>
        </div>
        <div class="MandA">
            <div class='mimic'>
                <!-- 无在期但有战报 -->
                <div v-show='mimicStatus=="report"&&isTransTime!=1' class='report'>
                    <div class='tips'>{{mimicReportObj.reportPeriods?mimicReportObj.reportPeriods.slice(2,6):''}}期预选赛战报</div>
                    <div class='reportInfo'>
                        <div class='current'>
                            <p class='currentTxt c-white'>本期收益</p>
                            <p class='currentNum f-18'>{{mimicReportObj.mt_new_income>0?mimicReportObj.mt_new_income.toFixed(2):'0.00'}}</p>
                        </div>
                        <div class='total'>
                            <p class='totalTxt c-white'>总共赚取牛币</p>
                            <p class='totalNum f-18'>{{mimicReportObj.mt_total_income>0?mimicReportObj.mt_total_income.toFixed(2):'0.00'}}</p>
                        </div>
                    </div>
                    <div class='geted' @click='mimicStatus="openMimic"'></div>
                </div>
                <!-- 无在期模拟盘且无战报 -->
                <div v-show='mimicStatus=="openMimic"' class='openMimic'>
                    <div class="matchTips">{{mimicTips}}</div>
                    <div class='openBg'></div>
                    <div class='openBtn' @click='confirmOpenMimic'></div>
                </div>
                <!-- 有在期模拟盘 -->
                <div v-show='mimicStatus=="hasMimic"' class='hasMimic'>
                    <div class='total'>
                        <p class='totalTxt'>总资产</p>
                        <p class='totalNum'>{{mimicObj.total_assets||'0.00'}}</p>
                    </div>
                    <div class='rate'>
                        <p class='rateTxt'>收益率</p>
                        <p class='rateNum'>{{mimicObj.rate||'0.00'}}%</p>
                    </div>
                    <div class='openBtn' @click='enterMimic'></div>
                </div>
            </div>
            <div class='actual'>
                <!-- 无在期实盘且有战报 -->
                <div v-show='actualStatus=="report"&&isTransTime!=1' class='reportA'>
                    <div class='tips'>{{actualReportObj.reportPeriods||"上"}}期锦标赛战报</div>
                    <div class='reportInfo'>
                        <div class='current'>
                            <p class='currentTxt c-white'>本期收益</p>
                            <p class='currentNum f-18'>{{actualReportObj.newEarnIncome>0?actualReportObj.newEarnIncome.toFixed(2):'0.00'}}</p>
                        </div>
                        <div class='total'>
                            <p class='totalTxt c-white'>总共赚取奖金</p>
                            <p class='totalNum f-18'>{{actualReportObj.totalEarnIncome>0?actualReportObj.totalEarnIncome.toFixed(2):'0.00'}}</p>
                        </div>
                    </div>
                    <div class='getedA' @click='actualStatus="openActual"'></div>
                </div>
                <!-- 无在期实盘且无战报 -->
                <div v-show='actualStatus=="openActual"||actualStatus=="report"&&isTransTime==1' class='openActual'>
                    <div class="matchTips">{{actualTips}}</div>
                    <div class='openBgA'></div>
                    <div class='openBtnA' @click='validActualAccount(userid,"1")'></div>
                </div>
                <!-- 有在期实盘 -->
                <div v-show='actualStatus=="hasActual"' class='hasActual'>
                    <div class='total'>
                        <p class='totalTxt'>总资产</p>
                        <p class='totalNum'>{{actualObj.total_assert||'0.00'}}</p>
                    </div>
                    <div class='rate'>
                        <p class='rateTxt'>收益率</p>
                        <p class='rateNum'>{{actualObj.fullIncomeRate||'0.00'}}%</p>
                    </div>
                    <div class='openBtnA' @click='enterActual(userid)'></div>
                </div>
            </div>
        </div>
        <div class='rankList'>
            <div class='tabTag'>
                <div class='honerShow' v-show='honerTag'>
                    <span class='iconHS'></span>
                    <span class='txtH'>荣誉榜</span>
                </div>
                <div class='honer' v-show='!honerTag' @click='honerTag=!honerTag'>
                    <span class='iconH'></span>
                    <span class='txtH'>荣誉榜</span>
                </div>
                <div class='chickenShow' v-show='!honerTag'>
                    <span class='iconCS'></span>
                    <span class='txtH'>排行榜</span>
                </div>
                <div class='chicken' v-show='honerTag' @click='honerTag=!honerTag'>
                    <span class='iconC'></span>
                    <span class='txtH'>排行榜</span>
                </div>
            </div>
            <div class='rankContent'>
                <div class='contentH' v-show='honerTag'>
                    <div class='honerItem' v-for="(item,index) in honerList">
                        <div class='itemHeader'>
                            <span class='index c-f06'>{{item.periods.slice(2,6)}}期冠军</span>
                            <span class='coin'></span>
                        </div>
                        <div class='userInfo'>
                            <span class='first'></span><img class='userLogo' :src='item.logoUrl' @click='toHisRank(item.client_id)'></img>
                            <div class='info'>
                                <p class='name ft28 c-fff'><span>{{item.nickName}}</span><img class='levelImg' v-if='item.userRank>-2' :src='"../../images/level"+item.userRank+".png"'></p>
                                <p class='rate'>
                                    <span class='txt c-f06'>总成功率&nbsp;&nbsp;</span>
                                    <span class='rateTotal c-dinFF5A58'>{{item.totalSuccessRate?item.totalSuccessRate.toFixed(2):'0.00'}}%</span>
                                    <span class='txt c-f06'>&nbsp;&nbsp;&nbsp;&nbsp;总期数&nbsp;&nbsp;</span>
                                    <span class='rateTotal c-dinFF5A58'>{{item.periodsCount}}</span>
                                </p>
                            </div>
                        </div>
                        <div class='transInfo'>
                            <p class='rate'>
                                <span class='txt c-f06'>本期收益率：</span>
                                <span class='rateThis c-dinFF5A58'>{{item.rate?item.rate.toFixed(2):'0.00'}}%</span>
                            </p>
                            <p class="perfect"><span class='c-f06'>精彩交易：</span><span class='c-fff f-28'>{{item.stockList.join('、')||'暂无精彩交易'}}</span></p>
                        </div>
                    </div>
                </div>
                <div class='contentC' v-show='!honerTag'>
                    <div class='title'><span class='td1'>排名</span><span class='td2'>赛期</span><span class='td3'>昵称</span><span class='td4'>收益率</span></div>
                    <div class='rankDiv' v-show='chickenList.length>0'>
                        <div class='rank f-28' v-for='(item,index) in chickenList'><span class='td1'><span :class='[item.rank==1?"first":item.rank==2?"second":"third"]'></span></span><span class='td2 c-fff'>20{{item.periods||'----'}}</span><span class='td3 c-fff' @click='toHisRank(item.client_id)'>{{item.nickName}}<img class='levelImg' v-if='item.userRank>-2' :src='"../../images/level"+item.userRank+".png"'></span><span class='td4 c-dinFF5A58'>{{item.rate>0?item.rate.toFixed(2):'0.00'}}%</span></div>
                    </div>
                    <div class='noRank c-fff' v-show='chickenList.length<=0'>
                        暂无排行数据
                    </div>
                    <div class='myRank'>
                        <span class="time">更新时间：<span class='c-din000'>{{chickenList.length>0?chickenList[0].updateTime:'--'}}</span></span>
                        <span class="myBtn" @click='toRank'>查看我的排名</span>
                    </div>
                </div>
            </div>
            <!-- 跑马灯 -->
            <div v-if='hasMarquee'>
                <marquee behavior="scroll" direction="up" scrolldelay="50" scrollamount="1" class='marqueeE f-28 c-fff'>
                    <p v-for="(item,index) in transList"><span class='name'>{{item.nickName}}</span><span class='time'>{{item.business_time}}</span><span class='oprate' :class="[item.entrust_bs=='买入'?'c-FF5A58':'c-00FFA2']">{{item.entrust_bs}}</span><span class='stock'>{{item.stock_code}}</span></p>
                </marquee>
            </div>
            <!-- 无跑马灯数据，还未到今天交易时间或今日交易时间已过 -->
            <div class="noMarquee f-28 c-fff" v-if='!hasMarquee'>
                非交易时间，暂无数据更新
            </div>
        </div>
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
import modalComponent from './modalComponent.vue'
export default {
    components: {
        modalComponent: modalComponent
    },
    data() {
        return {
            userid: '',
            coinNum: 0,
            photo: '',
            nickname: '',
            userToken: '',
            snapCookie: '',
            loginStateCookie: '',
            // appId: '',
            isMpEnv: '',
            hu: [],
            shen: [],
            chuang: [],
            mimicStatus: 'openMimic',
            mimicAccountId: null,
            mimicObj: {},
            mimicReportObj: {},
            nextPeriod: null,
            actualStatus: 'openActual',
            actualUrl: '',
            actualObj: {},
            actualReportObj: {},
            mimicTips: '',
            actualTips: '',
            honerTag: false,
            hasMarquee: true,
            modalShow: false,
            modalMsg: '',
            btnObj: {},
            modalTitle: '',
            modalHasInput: false,
            userLevel: -2,
            cfmOperate: null, //openM,close
            closeBtn: null,
            transList: [{}],
            honerList: [],
            chickenList: [],
            isTransTime: 1,
            actualNum: 0,
            showDot: true,
            disable: false

        }
    },
    created() {},
    mounted() {
        this.isMpEnv = this.Util.common.getQueryString('isMp');
        this.userid = this.Util.common.getQueryString('userid');
        this.userToken = this.Util.common.getQueryString('userToken');
        this.snapCookie = this.Util.common.getQueryString('snapCookie');
        this.loginStateCookie = this.Util.common.getQueryString('loginStateCookie');
        // this.photo = this.Util.common.getQueryString('photo');
        // this.nickname = decodeURIComponent(this.Util.common.getQueryString('nickname'));
        // this.appId = this.Util.common.getQueryString('appId');
        this.$nextTick(() => {
            if (this.isMpEnv == 'true') {
                //小程序环境
                this.setCookie();
                dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": "MINIAPP" });
            } else {
                dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": "H5" });
                $.ajax({
                    url: urlConfig.checkLogin,
                    dataType: 'jsonp',
                    success: data => {
                        if (data.islogin == 'True') {
                            this.userid = data.userid;
                            this.getCoinNum(data.userid);
                            this.getUserInfo(data.userid);
                            this.getMyRank(data.userid);
                            this.validMimicAccount(data.userid);
                            this.validActualAccount(data.userid, "0");
                            this.getHonerList();
                            this.getChickenList(data.userid);

                        } else {
                            //未登录
                        }
                    }
                })
            }
        });
        this.transTime();
        this.loopMarket(10000);
    },
    updated() {

    },
    methods: {
        //msg为提醒内容;btn传字符串，想显示的按钮名称以,隔开;cfmOperate为确认操作，取值openA，openM，close，confirmOpenA;close默认true，想隐藏右上角关闭按钮传false
        //cfmsCancle小的确定和取消按钮，cfml大的确定按钮，geted知道了，openA一键开启实盘，doMiss去做任务
        //canInput 弹窗是否有输入功能
        //title 弹窗title

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
        //获取用户信息
        getUserInfo(userid) {
            $.ajax({
                url: urlConfig.userInfo + userid,
                dataType: 'jsonp',
                success: data => {
                    console.log(data)
                    if (data.respCode == 'T') {
                        this.nickname = data.result.nickname;
                        this.photo = data.result.photo;
                    } else {
                        this.Util.common.msgTip('获取用户信息失败')
                    }
                }
            })
        },
        getMyRank(userid) {
            $.ajax({
                url: urlConfig.queryRank + userid,
                dataType: 'jsonp',
                success: data => {
                    console.log(data)
                    if (data.resultKey == 'ok') {
                        this.userLevel = data.data.rank.rank;
                    } else {
                        this.Util.common.msgTip('获取用户段位失败')

                    }
                }
            })
        },
        refreshPage() {
            if (!this.disable) {
                this.disable = true;
                this.getCoinNum(this.userid);
                this.validActualAccount(this.userid, "0");
                this.validMimicAccount(this.userid);
                this.getHonerList();
                this.getChickenList(this.userid);
                this.getUserInfo(this.userid);
                this.Util.common.msgTipNoMask('刷新成功', 1000);
                setTimeout(() => {
                    this.disable = false;
                }, 6000);
            } else {
                this.Util.common.msgTipNoMask('请勿频繁刷新', 1000);
            }

        },
        setCookie() {
            $.ajax({
                url: urlConfig.addCookie,
                type: 'POST',
                data: {
                    SnapCookie: this.snapCookie,
                    LoginStateCookie: this.loginStateCookie,
                    userToken: this.userToken
                },
                dataType: 'jsonp',
                 jsonp: "jsonp_callback",
                jsonpCallback: 'jsonp_callback',
                success: data => {
                    if (data.status == 1) {
                        this.getCoinNum(this.userid);
                        this.getUserInfo(this.userid);
                        this.getMyRank(this.userid);
                        this.validActualAccount(this.userid, "0");
                        this.validMimicAccount(this.userid);
                        this.getHonerList();
                        this.getChickenList(this.userid);
                    } else {
                        //未登录，异常处理机制
                        this.Util.common.msgTip('种cookie接口exception')
                    }

                }
            })
        },
        transTime() {
            $.ajax({
                url: urlConfig.transTime,
                dataType: 'jsonp',
                success: data => {
                    if (data.resultKey == 'ok') {
                        this.isTransTime = data.data.isTransaction;
                    } else {
                        this.Util.common.msgTip('查询是否交易时间接口：' + data.errorMessage);
                    }
                }
            })
        },
        toRank() {
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/rankList/rankList?userid=' + this.userid + '&isMp=true' })
            } else {
                window.location.href = urlConfig.domain + '/front/rankingList.html?hxid=' + this.userid;
            }
        },
        toBenben() {
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/benben/benben?hxid=' + this.userid + '&isMp=true' })
            } else {
                window.location.href = 'https://kgames.hexun.com/games/index.html?hxid=' + this.userid;
            }
        },
        toAccount() {
            // this.$router.push({
            //     name: 'account',
            //     params: {
            //         id: this.userid,
            //         photo: this.photo,
            //         nickname: this.nickname
            //     }
            // })
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/myEarnings/myEarnings?userid=' + this.userid + '&isMp=true' })
                setTimeout(() => {
                    this.showDot = false;
                }, 1000)
            } else {
                window.location.href = urlConfig.domain + '/front/myEarnings.html?userid=' + this.userid;
                setTimeout(() => {
                    this.showDot = false;
                }, 1000)
            }
        },
        loopMarket(loopTime) {
            this.getMarket();
            this.getRecord();
            setInterval(() => {
                $.ajax({
                    url: urlConfig.transTime,
                    dataType: 'jsonp',
                    success: data => {
                        if (data.resultKey == 'ok') {
                            this.isTransTime = data.data.isTransaction;
                            if (data.data.isTransaction == 1) {
                                this.getMarket();
                                setTimeout(() => {
                                    this.getRecord();
                                }, 300000)
                            }
                        } else {
                            this.Util.common.msgTip('查询是否交易时间接口：' + data.errorMessage);
                        }
                    }
                })
            }, loopTime)
        },

        getCoinNum(userid) {
            $.ajax({
                url: urlConfig.coinNum + userid,
                dataType: 'jsonp',
                success: data => {
                    if (data.respCode == 'T') {
                        this.coinNum = Number(data.result.data.toFixed(0));
                        this.$nextTick(() => {
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
        getActualRate(userid) {
            $.ajax({
                url: urlConfig.actualRate + '?hexunId=' + userid,
                dataType: 'jsonp',
                success: data => {
                    if (data.resultKey == 'ok') {
                        this.actualObj = data.data.result || {};
                    } else {
                        this.Util.common.msgTip('获取在期实盘收益接口：' + data.errorMessage);

                    }
                }
            })
        },
        getMarket() {
            $.ajax({
                url: urlConfig.stockMarket + '?code=sse000001,szse399001,szse399006&column=price,updownrate&callback=callback',
                dataType: 'jsonp',
                jsonpCallback: 'callback',
                success: data => {
                    this.hu = data.Data[0][0];
                    this.shen = data.Data[0][1];
                    this.chuang = data.Data[0][2];
                }
            })
        },
        getRecord() {
            $.ajax({
                url: urlConfig.getRecord,
                dataType: 'jsonp',
                success: data => {
                    if (data.resultKey == 'ok') {
                        let res = data.data.transactionStockCodeData;
                        console.log(res)
                        if (res.status == 0) {
                            this.hasMarquee = false;
                        } else {
                            this.hasMarquee = true;
                            this.transList = res.result;
                        }
                    } else {
                        this.Util.common.msgTip('跑马灯接口：' + data.errorMessage);
                    }
                }
            })
        },
        getChickenList(userid) {
            $.ajax({
                url: urlConfig.chickenList + '?hexunId=' + userid,
                dataType: 'jsonp',
                success: data => {
                    if (data.resultKey == 'ok') {
                        if (data.data.yieldrate.length > 0) {
                            let arr = [];
                            data.data.yieldrate.map(item => {
                                arr[item.rank - 1] = item;
                            })
                            this.chickenList = arr.slice(0, 3);
                        } else {

                        }
                    } else {
                        this.Util.common.msgTip('吃鸡榜潜力接口：' + data.errorMessage);

                    }
                }
            })
        },
        getHonerList() {
            $.ajax({
                url: urlConfig.honerList,
                dataType: 'jsonp',
                success: data => {
                    if (data.resultKey == 'ok') {
                        this.honerList = data.data.previousyieldrate.filter(item => item.proceed == 0).slice(0, 5);
                        this.$nextTick(() => {
                            $('.contentH').width(this.honerList.length == 0 ? '7.2rem' : (6.1 * this.honerList.length + 0.3) + 'rem');
                        })
                    } else {
                        this.Util.common.msgTip('荣誉榜接口：' + data.errorMessage);

                    }
                }
            })
        },
        closeModal() {
            this.modalShow = false;
        },
        toHisRank(hisId) {
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({
                    url: '/pages/personalRecord/personalRecord?userId=' + hisId + '&isMp=true'
                });
            } else {
                window.location.href = urlConfig.domain + '/front/personalRecord.html?userId=' + hisId;
            }
        },
        toRule() {
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/rule/rule' });
            } else {
                window.location.href = urlConfig.domain + '/front/rule.html'
            }
        },
        //进入在期的模拟盘
        enterMimic() {
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/simulation/simulation?client_id=' + this.userid + '&fund_account=' + this.mimicObj.fund_account })
            } else {
                window.location.href = urlConfig.mimicEnv + '?client_id=' + this.userid + '&fund_account=' + this.mimicObj.fund_account;
            }
        },
        //拿到和讯id去获取模拟盘的情况并处理
        openMimic(openNum) {
            console.log(openNum)
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
                                this.getCoinNum(this.userid);
                                this.$nextTick(() => {
                                    if (this.coinNum < 10000) {
                                        //金币不足
                                        this.showModal(
                                            '您的金币不足10000，不能参与预选赛，做任务免费得金币', 'doMiss');
                                    } else {
                                        //这里去判断段位
                                        if (data.data.fundAccount.rank == -2 || data.data.fundAccount.rank == 1 || data.data.fundAccount.rank == 0) {
                                            this.showModal('您将消费10000金币参与' + this.nextPeriod.slice(2, 6) + '期预选赛', 'cfmsCancle', 'openM', false);
                                        } else if (data.data.fundAccount.rank == -1) {
                                            this.showModal('您现在处于平民段位，只能消费5000金币参与' + this.nextPeriod.slice(2, 6) + '期预选赛', 'cfmsCancle', 'openM', false);

                                        } else if (data.data.fundAccount.rank >= 2) {
                                            this.showModal(
                                                '您是股神' + data.data.fundAccount.rank + '段，单次预选赛可以使用' + data.data.fundAccount.rank + '万金币，请输入1万的整数倍金额开启预选赛', 'cfmsCancle', 'openM', false, true, '启用资金');
                                        } else {
                                            this.Util.common.msgTip('模拟盘查询接口返回的段位是：' + data.data.fundAccount.rank);
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
        validMimicAccount(userid) {
            $.ajax({
                url: urlConfig.queryMimic + '?hexunId=' + userid,
                dataType: 'jsonp',
                success: data => {
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
        enterActual(userid) {
            this.closeModal();

            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/actual/actual?hexunId=' + userid + '&url=' + encodeURIComponent(this.actualUrl) })
            } else {
                window.location.href = this.actualUrl + '?hexunId=' + userid;
            }
        },
        confirmOpenActual() {
            this.showModal(
                '您将消费' + this.actualNum + '牛币参与锦标赛，审核通过后下一交易日开赛。', 'cfmsCancle', 'openA', false);
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
        //查询实盘状态接口，flag暂时用来区分两种调用接口的方式
        validActualAccount(userid, flag) {
            $.ajax({
                url: urlConfig.queryActual + '?hexunId=' + userid + '&from=index',
                dataType: 'jsonp',
                success: data => {
                    if (data.resultKey == 'ok') {
                        let res = data.data.validData;
                        this.actualNum = res.avliableincome;
                        if (flag == '0') {
                            if (res.code == '0') {
                                //显示已有实盘数据
                                this.actualStatus = "hasActual";
                                this.getActualRate(userid);
                                this.actualUrl = res.link_url;
                            } else if (res.code == '1') {
                                //显示战报
                                $.ajax({
                                    url: urlConfig.actualInfo + '?hexunId=' + userid,
                                    dataType: 'jsonp',
                                    success: data => {
                                        if (data.resultKey == 'ok') {
                                            this.actualReportObj = data.data.data;
                                            this.actualReportObj.reportPeriods = new Date(data.data.data.startDate.replace(/-/g, '/')).Format('MMdd');
                                            this.actualStatus = "report";
                                        } else {
                                            this.Util.common.msgTip('实盘战报接口：' + data.errorMessage);
                                        }
                                    }
                                })
                            } else {
                                //显示开启实盘界面
                                this.actualStatus = "openActual";
                            }
                        } else if (flag == '1') {
                            //在开启实盘界面点击开启实盘按钮
                            if (res.code == '1') {
                                if (this.actualNum >= 1000) {
                                    this.confirmOpenActual();
                                } else {
                                    this.showModal('您的牛币不足1000，不能参与锦标赛。请先参与预选赛赢取牛币', 'cfml');
                                }
                            }
                            if (res.code == '2') {
                                //用户已提交实盘审核，正在审核
                                //弹实盘资金将在下一个交易日启用弹窗
                                this.showModal('您申请参与锦标赛的牛币将在审核后下一交易日启用', 'geted');
                            }
                            if (res.code == '3') {
                                //用户金额不够启动额度
                                //弹可转实盘资金不足弹窗
                                this.showModal('您的牛币不足1000，不能参与锦标赛。请先参与预选赛赢取牛币', 'cfml');
                            }
                            if (res.code == '4') {
                                //用户符合注册实盘的资质但还未提交审核
                                //弹确认一键开启实盘界面
                                this.showModal('您的牛币尚未启用，请先申请启用', 'openA', 'confirmOpenA');
                            }
                        }
                    } else {
                        if (data.businessKey == 'user_not_exist') {
                            //todo
                            if (flag == '1') {
                                //弹可转实盘资金不足弹窗
                                this.showModal('您的牛币不足1000，不能参与锦标赛。请先参与预选赛赢取牛币', 'cfml');
                                return;
                            }
                            return;
                        }
                        this.Util.common.msgTip('实盘查询接口：' + data.errorMessage);

                    }
                }
            })
        }
    }
}
</script>
<style lang='less' scoped>
.c-white {
    color: rgba(255, 255, 255, 0.80);
}
.f-28 {
    font-size: .28rem;
}
.c-FF5A58 {
    color: #FF5A58 !important;
}
.c-00FFA2 {
    color: #00FFA2 !important;
}
.c-dinFF5A58 {
    /*font-family: DIN-Medium;*/
    font-size: .28rem;
    color: #FF5A58 !important;
}
.c-f06 {
    opacity: 0.6;
    font-family: PingFangSC-Regular;
    font-size: .28rem;
    color: #FFFFFF;
}
.c-din000 {
    font-family: DIN-Regular;
    letter-spacing: 0;
}
.f-18 {
    font-size: .36rem;
}
.c-fff {
    color: #fff !important;
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
}
.levelImg {
    width: .77rem;
    height: .36rem;
    margin-left: .1rem;
}
.container {
    background-color: #272F7D;
    overflow-y: scroll;
    height: 100%;
    .ruleBtn {
        display: inline-block;
        width: .48rem;
        height: 1.78rem;
        background: #FF7777;
        border-radius: .12rem 0 0 .12rem;
        position: fixed;
        z-index: 9;
        top: 31%;
        right: 0;
        background-image: url(../../images/rule2.png);
        background-size: .48rem 1.78rem;
    }
    .refresh {
        display: inline-block;
        width: .8rem;
        height: .8rem;
        border-radius: 2rem;
        position: fixed;
        z-index: 9;
        top: 71%;
        right: 1%;
        background-image: url(../../images/refresh2.png);
        background-size: .8rem .8rem;
    }
    .header {
        background-image: linear-gradient(45deg, #3D7FD3 0%, #2552B4 100%);
        border: .02rem solid rgba(255, 255, 255, 0.50);
        box-shadow: 0 .02rem .04rem 0 rgba(0, 0, 0, 0.30);
        border-top: none;
        border-radius: 6px;
        height: 1.32rem;
        width: 7.2rem;
        margin: 0 auto;
        .headerL {
            display: inline-block;
            width: .88rem;
            height: .88rem;
            border-radius: 2rem;
            border: .04rem solid rgba(255, 255, 255, 0.50);
            margin: .22rem .26rem;
            position: relative;
            .redDot {
                display: inline-block;
                position: absolute;
                width: .3rem;
                height: .3rem;
                background-image: url(../../images/redDot2.png);
                background-size: .3rem .3rem;
                top: -.05rem;
                left: -.05rem;
            }
            .photo {
                border-radius: 2rem;
            }
        }
        .headerR {
            display: inline-block;
            width: 5.46rem;
            height: .88rem;
            float: right;
            margin-top: .22rem;
            margin-right: .26rem;
            .HrTop {
                width: 100%;
                height: .5rem;
                line-height: .5rem;

                .nickName {
                    font-family: PingFangSC-Medium;
                    font-size: .28rem;
                    color: #FFFFFF;
                    line-height: .28rem;
                }
                .mission {
                    display: inline-block;
                    float: right;
                    height: .5rem;
                    line-height: .5rem;
                    width: 1.76rem;
                    border: .02rem solid rgba(255, 255, 255, 0.30);
                    border-radius: .04rem;
                    font-size: .24rem;
                    color: #FFFFFF;
                    text-align: center;
                }
            }
            .HrBottom {
                width: 100%;
                height: .38rem;
                line-height: .38rem;
                position: relative;
                .coin-icon {
                    left: -.08rem;
                    display: inline-block;
                    position: relative;
                    width: .48rem;
                    height: .48rem;
                    background-image: url(../../images/coin2.png);
                    background-size: .48rem .48rem;
                    z-index: 3;
                }
                .coinProgress {
                    z-index: 2;
                    display: inline-block;
                    position: relative;
                    left: -.6rem;
                    top: -.11rem;
                    width: 3.14rem;
                    height: .24rem;
                    box-shadow: inset 0 .02rem .04rem 0 rgba(0, 0, 0, 0.50);
                    border-radius: 2rem;
                    background-image: url('../../images/progress-border2.png');
                    background-size: 3.15rem .24rem;
                    .progress {
                        width: 0%;
                        height: .24rem;
                        border-radius: 2rem;
                        background-image: url(../../images/progress2.png);
                        background-size: 3.56rem .24rem;
                        background-repeat: no-repeat;
                    }
                }
                .coinNum {
                    display: inline-block;
                    position: absolute;
                    text-align: right;
                    top: .12rem;
                    right: 0rem;
                    width: 1.95rem;
                    height: .24rem;
                    line-height: .24rem;
                    /*font-family: DIN-Medium;*/
                    font-size: .24rem;
                    color: #FFE35C;
                }
            }
        }
    }
    .stockIndex {
        height: 1rem;
        width: 7.2rem;
        margin: 0 auto;
        .hu {
            width: 2.1rem;
            height: 1rem;
            display: inline-block;
            .icon-hu {
                display: inline-block;
                position: relative;
                top: .26rem;
                width: .48rem;
                height: .48rem;
                line-height: .48rem;
                text-align: center;
                background: #212564;
                border-radius: .04rem;
                color: #fff;
            }
            .stockNum {
                display: inline-block;
                margin-top: .17rem;
                width: 1.6rem;
                float: right;
                /*font-family: DIN-Medium;*/
                font-size: .24rem;
                color: #FFFFFF;
                .asset, .income {
                    display: inline-block;
                    width: 1.6rem;
                    text-align: center;
                }
                .c-die {
                    color: #00FFA2;
                }
                .c-zhang {
                    color: #FF5A58;
                }
            }
        }
        .shen {
            margin-left: .4rem;
        }
        .chuang {
            float: right;
        }
    }
    .noob {
        width: 7.34rem;
        height: 1.45rem;
        margin: 0 auto;
        background-size: 7.34rem 1.51rem;
        background-image: url(../../images/noob2.png);
    }
    .MandA {
        margin: 0 auto;
        height: 3.3rem;
        width: 7.2rem;
        .mimic, .actual {
            display: inline-block;
            width: 3.5rem;
            height: 3.3rem;
            .report, .hasMimic, .openMimic, .reportA, .hasActual, .openActual {
                background-size: 3.66rem 3.42rem;
                background-position: -.09rem -.04rem;
                background-image: url(../../images/mimicBg2.png);
                border: .01rem solid rgba(255, 255, 255, 0.5);
                box-shadow: inset -.08rem -.08rem .12rem 0 rgba(255, 255, 255, 0.20);
                border-radius: .12rem;
            }
            .reportA, .hasActual, .openActual {
                background-image: url(../../images/actualBg2.png);
            }
            .report, .reportA {
                .tips {
                    width: 2.4rem;
                    height: .48rem;
                    line-height: .48rem;
                    text-align: center;
                    background: rgba(100, 33, 33, 0.4);
                    border-radius: .12rem 0 .12rem 0;
                    color: #FFFFFF;
                    letter-spacing: 0;
                }
                .reportInfo {
                    width: 100%;
                    height: 1.74rem;
                    color: #fff;
                    .current, .total {
                        margin-top: .15rem;
                        p {
                            text-align: center;
                        }
                    }
                    .total {
                        margin-top: 0rem;
                    }
                }

                .geted, .getedA {
                    width: 3.48rem;
                    height: .91rem;
                    background: url(../../images/mimicKnow2.png) no-repeat;
                    border-top: .01rem solid #FFFFFF;
                    background-size: 3.66rem .9rem;
                    background-position: -.1rem 0rem;
                    border-radius: 0 0 .12rem .12rem;
                }
                .getedA {
                    background: url(../../images/actualKnow2.png) no-repeat;
                    background-size: 3.66rem .9rem;
                    background-position: -.1rem 0rem;
                    border-top: 0.01rem solid rgba(255, 255, 255, 0.50);
                }
            }
            .openMimic, .hasMimic, .openActual, .hasActual {
                .matchTips {
                    width: 2.6rem;
                    height: .56rem;
                    line-height: .6rem;
                    text-align: center;
                    margin: .24rem auto;
                    background: rgba(33, 37, 100, 0.4);
                    border-radius: 2rem;
                    font-size: .32rem;
                    color: #FFFFFF;
                    letter-spacing: 0;
                }
                .openBg, .openBgA {
                    width: 2.92rem;
                    height: 1.31rem;
                    margin: 0 auto;
                    background-image: url(../../images/hasMimic2.png);
                    background-size: 2.92rem 1.32rem;
                }
                .openBtnA, .openBtn {
                    width: 3.48rem;
                    height: .91rem;
                    background: url(../../images/enterMimic2.png) no-repeat;
                    border-top: .01rem solid rgba(255, 255, 255, 0.5);
                    background-size: 3.66rem .9rem;
                    background-position: -.1rem 0rem;
                    border-radius: 0 0 .12rem .12rem;
                }
                .openBgA {
                    background-image: url(../../images/hasActual2.png);
                }
                .openBtnA {
                    background: url(../../images/enterActual2.png) no-repeat;
                    background-size: 3.66rem .9rem;
                    background-position: -.1rem 0rem;
                }
            }
            .hasMimic, .hasActual {
                .total, .rate {
                    height: 1.035rem;
                    margin-top: .3rem;
                    .totalTxt, .rateTxt {
                        height: .5rem;
                        line-height: .5rem;
                        text-align: center;
                        color: rgba(255, 255, 255, 0.80);
                    }
                    .totalNum, .rateNum {
                        height: .3rem;
                        line-height: .3rem;
                        text-align: center;
                        /*font-family: DIN-Medium;*/
                        font-size: .36rem;
                        color: #FFFFFF;
                    }
                }
                .rate {
                    margin-top: 0rem;
                }
            }
        }
        .actual {
            float: right;
        }
    }
    .rankList {
        height: 4.8rem;
        width: 7.2rem;
        margin: .1rem auto;
        border-radius: .12rem;
        .tabTag {
            width: 100%;
            .honer, .chicken, .honerShow, .chickenShow {
                display: inline-block;
                width: 3.5rem;
                height: .9rem;
                line-height: .9rem;
                background: rgba(33, 37, 98, 0.9);
                box-shadow: inset .01rem 0 0 0 rgba(255, 255, 255, 0.50), inset -.01rem 0 0 0 rgba(255, 255, 255, 0.50), inset 0 .01rem 0 0 rgba(255, 255, 255, 0.50);
                text-align: center;
                font-size: .32rem;
                color: rgba(255, 255, 255, 0.5);
                border-radius: .12rem .12rem 0 0;

                .iconH, .iconC, .iconHS, .iconCS {
                    display: inline-block;
                    width: .44rem;
                    height: .44rem;
                    background: url(../../images/honer-unselected2.png) no-repeat;
                    background-size: .44rem .44rem;
                    vertical-align: middle;
                }
                .iconHS {
                    background: url(../../images/honer-selected2.png) no-repeat;
                    background-size: .44rem .44rem;
                }
                .iconC {
                    background: url(../../images/chicken-unselected2.png) no-repeat;
                    height: .5rem;
                    background-size: .44rem .44rem;
                }
                .iconCS {
                    background: url(../../images/chicken-selected2.png) no-repeat;
                    height: .5rem;
                    background-size: .44rem .44rem;
                }
            }
            .honerShow, .chickenShow {
                opacity: 1;
                background: #276FD2;
                color: rgba(255, 255, 255, 1);
                box-shadow: inset .02rem 0 0 0 rgba(255, 255, 255, 0.50), inset -.02rem 0 0 0 rgba(255, 255, 255, 0.50), inset 0 .02rem 0 0 rgba(255, 255, 255, 0.50);
            }
            .chicken, .chickenShow {
                float: right;
            }
        }
        .rankContent {
            background: #1D2A43;
            border: .01rem solid rgba(255, 255, 255, 0.30);
            border-top: none;
            box-shadow: 0 .04rem .08rem 0 rgba(0, 0, 0, 0.30);
            border-radius: 0 0 .12rem .12rem;
            height: 3.4rem;
            overflow-x: scroll;
            width: 7.2rem;
            .contentH {
                padding-top: .15rem;
                .honerItem {
                    display: inline-block;
                    background: #276FD2;
                    border: .01rem solid rgba(255, 255, 255, 0.50);
                    border-radius: .08rem;
                    width: 5.9rem;
                    height: 3.1rem;
                    margin-left: .2rem;
                    .itemHeader {
                        height: .9rem;
                        width: 5.3rem;
                        margin: 0 auto;
                        line-height: .9rem;
                        .index {
                            display: inline-block;
                            width: 1.6rem;
                        }
                        .coin {
                            float: right;
                            display: inline-block;
                            width: 3.16rem;
                            height: .6rem;
                            background-size: 3.16rem .6rem;
                            background-image: url(../../images/champion2.png);
                            margin-top: .15rem;
                            background-repeat: no-repeat;
                        }
                    }
                    .userInfo {
                        height: .72rem;
                        width: 5.3rem;
                        margin: 0 auto;
                        position: relative;
                        .userLogo {
                            display: inline-block;
                            width: .72rem;
                            height: .72rem;
                            border: .04rem solid rgba(255, 255, 255, 0.50);
                            border-radius: 2rem;
                        }
                        .first, .second, .third {
                            position: absolute;
                            display: inline-block;
                            top: -.17rem;
                            left: -.17rem;
                            transform: rotate(-45deg);
                            -ms-transform: rotate(-45deg);
                            /* IE 9 */
                            -moz-transform: rotate(-45deg);
                            /* Firefox */
                            -webkit-transform: rotate(-45deg);
                            /* Safari 和 Chrome */
                            -o-transform: rotate(-45deg);
                            width: .37rem;
                            height: .37rem;

                            background-size: .37rem .37rem;
                            background-image: url(../../images/first2.png);
                        }
                        .second {
                            background-image: url(../../images/second2.png);
                        }
                        .third {
                            background-image: url(../../images/third2.png);
                        }
                        .info {
                            display: inline-block;
                            float: right;
                            width: 4.38rem;
                            height: .72rem;
                        }
                    }
                    .transInfo {
                        width: 5.3rem;
                        height: 1.1rem;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: .08rem;
                        margin: .2rem auto;
                        padding: .1rem .2rem;
                        .rate, .perfect {
                            height: .45rem;
                            line-height: .45rem;
                        }
                    }
                }
            }
            .contentC {
                .title, .rank {
                    .td1, .td2, .td3, .td4 {
                        display: inline-block;
                        height: .48rem;
                        width: 1.3rem;
                        line-height: .48rem;
                        text-align: center;
                        color: rgba(255, 255, 255, 0.50);
                    }
                    .td2 {
                        width: 1.7rem;
                        text-align: left;
                    }
                    .td3 {
                        width: 2.6rem;
                        text-align: left;
                    }
                    .td4 {
                        width: 1.2rem;

                        text-align: right;
                    }
                }
                .rankDiv {
                    height: 2.2rem;
                }
                .noRank {
                    height: 2.2rem;
                    line-height: 2.2rem;
                    text-align: center;
                }
                .rank {
                    height: .72rem;
                    line-height: .72rem;
                    border-bottom: .01rem solid rgba(255, 255, 255, 0.20);
                    .td1 {
                        /*font-family: DIN-Medium;*/
                        .first, .second, .third {
                            display: inline-block;
                            width: .52rem;
                            height: .52rem;
                            background-size: .52rem .52rem;
                            background-image: url(../../images/first2.png);
                            vertical-align: middle;
                        }
                        .second {
                            background-image: url(../../images/second2.png);
                        }
                        .third {
                            background-image: url(../../images/third2.png);
                        }
                    }
                }
                .myRank {
                    height: .7rem;
                    padding: 0 .4rem;
                    .time {
                        height: .7rem;
                        line-height: .7rem;
                        opacity: 0.5;
                        color: #FFFFFF;
                        letter-spacing: 0;
                    }
                    .myBtn {
                        height: .7rem;
                        line-height: .7rem;
                        font-size: .28rem;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        float: right;
                    }
                }
            }
        }
        .marqueeE, .noMarquee {
            width: 7.2rem;
            height: .6rem;
            margin: 0.2rem auto 0;
            background: #1C2A44;
            border: 0.01rem solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.3);
            border-radius: .12rem;
            line-height: .6rem;
            text-align: center;
            .name, .time, .oprate, .stock {
                display: inline-block;
                width: 3.4rem;
                height: .6rem;
                text-align: left;
            }
            .name {
                padding-left: .1rem;
            }
            .time, .oprate {
                width: 1rem;
                text-align: center;
            }
            .stock {
                width: 1.2rem;
                text-align: right;
            }
        }
    }
}
</style>