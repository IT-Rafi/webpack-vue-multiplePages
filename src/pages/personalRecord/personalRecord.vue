<template>
    <div class="personalRecord">
        <div flex class="main">
            <div class="content">
                <div flex="box:mean" class="userInfo" >
                    <div flex="dir:top cross:center">
                        <div class="avatar">
                            <img :src='avatarUrl' alt="" class="avatar">
                        </div>
                        <!-- <div class="level">Lv1</div> -->
                        <div class="nickname">{{nickname}}</div>
                    </div>
                </div>
                <div flex="box:mean" class="tab-title">
                    <div class="cur" flex="main:center cross:center">个人战绩</div>
                </div>

                <div class="tab-content">
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
                            <div class="pt5"><span class="op6">期均收益：</span><span class="op1">{{realDisk_averageRate}}%</span></div>
                        </div>
                    </div>                                        
                </div>
            </div>
        </div>
    </div>    
</template>
<script>
import urlConfig from './../../api/personalCenter.js'

export default {
    data() {
        return {
            userId:'',
            nickname:'',
            cj_status:2,
            top1Count:'0',
            bestRank:'0',
            periods:'',
            avatarUrl: '',
            simulation_periodsCount:'0',
            simulation_averageRate:'0',
            simulation_totalSuccessRate:'0',
            realDisk_periodsCount:'0',
            realDisk_averageRate:'0',
            realDisk_totalSuccessRate:'0',
            isMpEnv:'',
            top1Count:'0',
        }
    },
    created:function(){
        this.isMpEnv = this.Util.common.getQueryString('isMp');
        this.userId = this.Util.common.getQueryString('userId');
    },
    mounted() {
        this.$nextTick(()=>{
            this.load_user_info();
            this.getHonourData();
            this.getMyScoreData();
            this.getMyScoreRealData();
            // dplus统计
            let PLATFORM = this.isMpEnv=='true'?'MINIAPP':'H5';
            dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": PLATFORM });            
        })
    },    
    methods: {
        toDetails(flag){
            if (this.isMpEnv == 'true') {
                wx.miniProgram.navigateTo({ url: '/pages/detailed/detailed?hxid=' + this.userId + '&state='+flag+'&isMp='+this.isMpEnv })
            } else {
                window.location.href='detailed.html?hxid='+this.userId+'&state='+flag+'&isMp='+this.isMpEnv
            }            
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
            let url = urlConfig.apiAccunt+'/api/redis/getMyScoreData?hexunId='+this.userId;
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
            let url = urlConfig.apiAccunt+'/api/real/redis/getMyScoreRealData?hexunId='+this.userId;
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
.personalRecord {
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
.level {
    width: .72rem;
    height: .32rem;
    text-align: center;
    background: #DF5144;
    border-radius: 100px;
    margin-top: -.24rem;
}
.nickname {
    margin-top:.1rem; 
    font-size: .32rem;
}
.avatar {
    width: 1.28rem;
    height: 1.28rem;
    border: 1px solid #FFFFFF;
    border-radius: 50%;
    overflow:hidden;
    img {
        width: 1.28rem;
        height: 1.28rem;
        border-radius: 50%;        
    }
}
.tab-title {
    .h(40);
    .fz16;
    margin-top: .3rem;
}
.cur {
    background-image: linear-gradient(0deg, #1974EF 0%, #50A8FF 100%);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.29);
    border-radius: 100px;
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

.attendance-list {
  display: flex;
  flex-flow: row wrap;
  margin-top: .16rem;
  align-content: flex-start;
  li {
    box-sizing: border-box;
    flex: 0 0 25%;
  }
}

.attendance {
    .h(99);
    background: #FF9C28;
}
.real-money {
    .h(60);
    background-image: linear-gradient(0deg, #1974EF 0%, #50A8FF 100%);
    border: 1px solid rgba(255,255,255,0.50);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.29);
    border-radius: 6px;    
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
.op6 {
    opacity: 0.6;
}
.op1 {
    opacity: 1;
}
</style>