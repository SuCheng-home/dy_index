<template>
	<div class="app-container calendar-list-container" :style="`height: ${notbmaxH + 40}px;`">
		<div class="judge_parent" v-if="isShowByPermissionList(['/schoolhonor/schoolhonorTypeSet','/structure/schoolMap/addUpdateSchoolMapInit','/course/getCourseList', '/schoolTime/schoolTimeList', '/nodeLevel2/findNodeLevelList2', '/thAskLeaveFour/getThAskLeaveFourInit'])">
			<div style="clear: both"></div>
			<span class="mudule-info">基础设置</span>
			<hr />
			<div class>
				<div class>
					<ul class="background_ul">
						<li v-if="isShowByPermission('/course/getCourseList')">
							<a @click="loadNextPage('courseSet/getCourseListIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/course.png')" />
								<br />
								<span>课程设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/schoolTime/schoolTimeList')">
							<a @click="loadNextPage('schoolTimeList/schoolTimeListIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/xqgl.png')" />
								<br />
								<span>学期管理</span>
							</a>
						</li>

						<li v-if="isShowByPermission('/nodeLevel2/findNodeLevelList2')">
							<a @click="loadNextPage('timelineSetting')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/guide_record.png" />
								<br />
								<span>作息时间设置</span>
							</a>
						</li>

						<li v-if="isShowByPermission('/teachingResearch/index')">
							<a @click="loadNextPage('teachingGroup/teachingGroupSet')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/teaching_group.png" />
								<br />
								<span>教研组设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/structure/schoolMap/addUpdateSchoolMapInit')">
							<a @click="loadNextPage('map/mapIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/bxddsz.png')" />
								<br />
								<span>地图设置</span>
							</a>
						</li>
							<li v-if="isShowByPermission('/schoolhonor/schoolhonorTypeSet')">
							<a @click="loadNextPage('fiveEducationSetup/fiveEducationSetupIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/wuyushehzhi.png')" />
								<br />
								<span>五育设置</span>
							</a>
						</li>
						
					</ul>
				</div>
			</div>
		</div>
		<div class="judge_parent" v-if="isShowByPermissionList(['/guide/guideManage', '/teacherWorkCheckSet'])">
			<div style="clear: both"></div>
			<span class="mudule-info">校园检查设置(面向老师)</span>
			<hr />
			<div class>
				<ul class="background_ul">
					<li v-if="isShowByPermission('/guide/guideManage')">
						<a @click="loadNextPage('guide/guideGroupList')">
							<img class="background_ul_img" :src="require('@/assets/images/system_set/course.png')" />
							<br />
							<span>护导组设置</span>
						</a>
					</li>
					<li v-if="isShowByPermission('/teacherWorkCheckSet')">
						<a @click="loadNextPage('homeworkInspection/index')">
							<img class="background_ul_img" :src="require('@/assets/images/system_set/zuo-ye-jian-cha-she-zhi.png')" />
							<br />
							<span>作业检查设置</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="judge_parent" v-if="
		        isShowByPermissionList([
		            '/stuAskleaveThree/getStuAskleaveThreeListByNum',
		            '/stuAskleave/getStuAskleaveInit',
		            '/stuAttendance/stuAttendanceRuleSet',
		            '/stuAttendance/inAndOutTimeSetByGradeLevel',
		            '/stuMoringCheck/getStuMoringCheckInit',
		            '/teacherAskleave/getTeacherAskleaveInit',
		            '/thAskLeaveFour/getThAskLeaveFourInit',
		            '/attendanceRule/attendanceRuleList',
		            '/deductionDeduction/deductionTypeSet',
		            '/gate/getGateProInit',
		            '/checkWork/getCheckWorkInitBySchoolId',
					'/extraWork/getExtraWorkInit'
		            ])
            ">
			<div style="clear: both"></div>
			<span class="mudule-info">出勤设置</span>
			<hr />
			<div class>
				<div class>
					<ul class="background_ul">
						<li v-if="isShowByPermission('/stuAskleaveThree/getStuAskleaveThreeListByNum')">
							<a @click="loadNextPage('stuAskLeaveSet/leave3Index')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/leave_type.png')" />
								<br />
								<span>学生请假设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/stuAskleave/getStuAskleaveInit')">
							<a @click="loadNextPage('stuAskleaveSet/index')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/leave_type.png')" />
								<br />
								<span>学生请假设置</span>
							</a>
						</li>
                        <li v-if="isShowByPermission('/stuAttendance/stuAttendanceRuleSet')">
                            <a @click="loadNextPage('studentAttendanceLiuhe/setting')">
                                <img class="background_ul_img" :src="require('@/assets/images/system_set/attendance.png')" />
                                <br />
                                <span>学生考勤设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/stuAttendance/inAndOutTimeSetByGradeLevel')">
                            <a @click="loadNextPage('gate/timeSetting')">
                                <img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/jinchuxiaoshijian.png" />
                                <br />
                                <span>学生考勤设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/stuMoringCheck/getStuMoringCheckInit')">
                            <a @click="loadNextPage('morningCheck/morningCheck')">
                                <img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/cj.png" />
                                <br />
                                <span>晨午检设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/teacherAskleave/getTeacherAskleaveInit')">
                            <a @click="loadNextPage('TeacherLeave3Set/index')">
                                <img class="background_ul_img" :src="require('@/assets/images/system_set/qjrspsz.png')" />
                                <br />
                                <span>教师请假设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/thAskLeaveFour/getThAskLeaveFourInit')">
                            <a @click="loadNextPage('teacherLeave4Setting')">
                                <img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/guide_record.png" />
                                <br />
                                <span>教师请假设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/attendanceRule/attendanceRuleList')">
                            <a @click="loadNextPage('teacherAttendance/teacherAttendanceSetIndex')">
                                <img class="background_ul_img" :src="require('@/assets/images/system_set/attendance.png')" />
                                <br />
                                <span>教师考勤设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/deductionDeduction/deductionTypeSet')">
                            <a @click="loadNextPage('leaveCancelTicket/leaveCancelTicketList')">
                                <img class="background_ul_img" :src="require('@/assets/images/system_set/qjrspsz.png')" />
                                <br />
                                <span>请假抵扣设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/gate/getGateProInit')">
                            <a @click="loadNextPage('gate/getGateProInit')">
                                <img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/attendance_rules.png" />
                                <br />
                                <span>进出校设置</span>
                            </a>
                        </li>
                        <li v-if="isShowByPermission('/checkWork/getCheckWorkInitBySchoolId')">
                            <a @click="loadNextPage('dockingAttendanceMachine')">
                                <img class="background_ul_img" :src="require('@/assets/images/system_set/attendance.png')" />
                                <br />
                                <span>企业微信考勤机</span>
                            </a>
                        </li>
						 <li v-if="isShowByPermission('/extraWork/getExtraWorkInit')">
                            <a @click="loadNextPage('extraWork/getExtraWorkInit')">
                                <img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/jiaban.png" />
                                <br />
                                <span>加班设置</span>
                            </a>
                        </li>
					</ul>
				</div>
			</div>
		</div>

		<div class="judge_parent">
			<div style="clear: both"></div>
			<span class="mudule-info">后勤设置</span>
			<hr />
			<div class>
				<div class>
					<ul class="background_ul">
						<li v-if="isShowByPermission('/repairType/repairTypeList')">
							<a @click="loadNextPage('repairSet/repairTypeListIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/bxlxsz.png')" />
								<br />
								<span>报修类型设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/repairAddressSetIndex')">
							<a @click="loadNextPage('repairAddressSet/repairAddressSetIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/bxddsz.png')" />
								<br />
								<span>报修地点设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/resource/resourceTypeList')">
							<a @click="loadNextPage('resourceSet/resourceTypeListIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/zyglsz.png')" />
								<br />
								<span>资源管理</span>
							</a>
						</li>
							<!-- <li v-if="isShowByPermission('/parentResource/getParentResourceList')">
							<a @click="loadNextPage('resourceSet/parentResourceslist')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/zyglsz.png')" />
								<br />
								<span>家长资源管理</span>
							</a>
						</li> -->
						<li v-if="isShowByPermission('/repastManagement/getRepastManagementSet')">
							<a @click="loadNextPage('eatSettingIndex')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xsbjcsz.png" />
								<br />
								<span>就餐停伙设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/repastManagement/getRepastManagementSet')">
							<a @click="loadNextPage('newstopgangsettings',1)">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xsbjcsz.png" />
								<br />
								<span>老师供餐设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/repastManagement/getRepastManagementSet')">
							<a @click="loadNextPage('newstopgangsettings',2)">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xsbjcsz.png" />
								<br />
								<span>学生供餐设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/fire/fireSet')">
							<a @click="loadNextPage('fireSetup/stopgangsettings')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/fire_time.png')" />
								<br />
								<span>停伙时间设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/fire/fireSet')">
							<a @click="loadNextPage('fireSetup/newstopgangsettings',1)">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/fire_time.png')" />
								<br />
								<span>老师供餐设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/fire/fireSet')">
							<a @click="loadNextPage('fireSetup/newstopgangsettings',2)">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/fire_time.png')" />
								<br />
								<span>学生供餐设置</span>
							</a>
						</li>
						<!-- <li v-if="isShowByPermission('/fire/fireSet')">
							<a @click="loadNextPage('studentNotEatSetting')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xsbjcsz.png" />
								<br />
								<span>学生不就餐设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/fire/fireSet')">
							<a @click="loadNextPage('teacherNotEatSetting')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/lsbjcsz.png" />
								<br />
								<span>老师不就餐设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/fire/fireSet')">
							<a @click="loadNextPage('eatAddressSetting')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/jcddsz.png" />
								<br />
								<span>就餐地点设置</span>
							</a>
						</li> -->

						<li v-if="isShowByPermission('/mobile/sterilize/set')">
							<a @click="loadNextPage('ventilatearoom/ventilatearoomindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/ventilatearooms.png" />
								<br />
								<span>消毒打卡设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/temperatureReport/temperatureReportSet')">
							<a @click="loadNextPage('temperatureSetup/temperatureSetup')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/temperature_check.png" />
								<br />
								<span>体温检查设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/sarah/getSarahPlaceList')">
							<a @click="loadNextPage('workingMeal/mealSettingindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/jcddsz.png" />
								<br />
								<span>工作餐设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/hikCar/hikCarInit')">
							<a @click="loadNextPage('carAttendance/index')">
								<img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/car-setting.png" />
								<br />
								<span>车辆考勤设置</span>
							</a>
						</li>
							<li  v-if="isShowByPermission('/schoolTelephoneConfig')">
							<a @click="loadNextPage('campusphoneconfiguration/campusphoneconfigurationindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/systemSetup/xydh.png" />
								<br />
								<span>校园电话配置</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- <div class="judge_parent" v-if="isShowByPermission('/schoolCharge/index')">
			<div style="clear: both"></div>
			<span class="mudule-info">支付设置</span>
			<hr />
			<div class>
				<div class>
					<ul class="background_ul">
						<li v-if="isShowByPermission('/schoolCharge/index')">
							<a @click="loadNextPage('newcharge/newchargesetupindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xysfsz.png" />
								<br />
								<span>收费设置</span>
							</a>
						</li> -->
						<!-- <li v-if="isShowByPermission('/orderpay/billflow/queryBillFlowList')">
                            <a @click="loadNextPage('newcharge/transactionFlow')">
                                <img
                                    class="background_ul_img"
                                    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/jyls.png"
                                />
                                <br/>
                                <span>交易流水</span>
                            </a>
                        </li>
                         <li v-if="isShowByPermission('/orderpay/bill/queryBillSummary')">
                            <a @click="loadNextPage('newcharge/accountStatement')">
                                <img
                                    class="background_ul_img"
                                    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/dzd.png"
                                />
                                <br/>
                                <span>对账单</span>
                            </a>
                        </li> -->
					<!-- </ul>
				</div>
			</div>
		</div> -->

		<!-- <div class="judge_parent">
              <div style="clear: both;"></div>
              <span class="mudule-info">智能硬件设置</span>
              <hr />
              <div class>
                <div class>
                  <ul class="background_ul">
                    <li>
                      <a @click="loadNextPage('deviceManage/deviceList')">
                        <img
                          class="background_ul_img"
                          src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/scancodeEquipment.png"
                        />
                        <br />
                        <span>设备管理</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div> -->
		<div
			class="judge_parent"
			v-if="
				isShowByPermissionList([
					'/cumulAssess/cumulAssessSet',
					'/adviceType/adviceTypeList',
					'/exam/insertExamSetPage',
					'/composite/dutySet',
					'/dataReport/getDataReportInit',
					'/systemSchedule/set',
					'/creditPoint/initSet',
					'/readClockIn/set',
					'/eachyear_tenthings/eachLevelThingsSet',
					'/bigEventNoteSet/getBigEventNoteSet',
					'/schoolBehavior/schoolBehaviorTypeList',
					'/classRatingSet/goToRecordSetDetailPage',
					'/classCircle/classCircleSetManage',
					'/schoolConduct/schoolConductTypeList',
					'/campusMan/campusManManger',
					'/calendar/getCalendarSet',
					'/elasticSchool/getElasticschoolSchoolOverInit',
					'/teacherHonor/set',
					'/printPrice/toPriceListPage',
					'/schoolHonor/schoolHonorTypeList',
					'/gate/getGateProInit',
					'/readPlat/readPlatSysSetPage',
					'/homework/homeworkSetManage',
					'/covidAbcfy/updateSyncSchool',
					'/listenClassRecord/set',
					'/electiveCourse/electiveCourseSet',
					'/electiveCourse/coursePlatformSet',
					'/workFlow/getWorkFlowList',
					'/printSeniorOffice/getPrintSeniorOfficeList',
					'/supplyClass/supplyAdjustClassSet',
					'/complexBase/goComplexBaseListPage',
					'/peanutBeh/seteanutIndicatorInit',
					'/schoolBehaviorRankInit/getSchoolBehaviorRankInitList',
					'/schoolBehavior/schoolBehaviorTypeListTwo'
				])
			"
		>
			<div style="clear: both"></div>
			<span class="mudule-info">其他设置</span>
			<hr />
			<div class>
				<div class>
					<ul class="background_ul">
						<li  v-if="isShowByPermission('/supplyClass/supplyAdjustClassSet')">
							<a @click="loadNextPage('supplyClass/supplyClasssetup')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/course.png')" />
								<br />
								<span>代课调课设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/readPlat/readPlatSysSetPage')">
							<a @click="loadNextPage('readingplatform/readingplatformsetup')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/reading_platform.png" />
								<br />
								<span>阅读平台</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/cumulAssess/cumulAssessSet')">
							<a @click="loadNextPage('evaluateCumulative/evaluateCumulativeone')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/evaluateCumulative/index.png" />
								<br />
								<span>累积式自我评价设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/adviceType/adviceTypeList')">
							<a @click="loadNextPage('advice/typeList')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/jyxlxsz.png" />
								<br />
								<span>{{ isKindergartenPage ? '园长信箱' : '建议箱' }}类型设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/exam/insertExamSetPage')">
							<a @click="loadNextPage('examSet/index')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/cjbfbsz.png')" />
								<br />
								<span>成绩管理设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/composite/dutySet')">
							<a @click="loadNextPage('compositeExamSet/dutyListIndex?new2=1')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/composite.png')" />
								<br />
								<span>综合检查</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/dormCheck/dormCheckMan')">
							<a @click="loadNextPage('dormitoryInspection/dormitoryInspectionindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/productVersion/project_logo/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260326150313_30_482.png" />
								<br />
								<span>宿舍检查</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/complexBase/goComplexBaseListPage')">
							<a @click="loadNextPage('compositeExamSetTwo/campusPatrolSetupIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/composite.png')" />
								<br />
								<span>校园巡查</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/dataReport/getDataReportInit')">
							<a @click="loadNextPage('dataReport/dataReport')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/tsbg.png')" />
								<br />
								<span>报告推送设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/systemSchedule/set')">
							<a @click="loadNextPage('Intelligencecourse/IntelligencecourseSetup')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/zhinengpaike.png" />
								<br />
								<span>智能排课设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/creditPoint/initSet')">
							<a @click="loadNextPage('wtCredit/wtCreditIndex?new=1')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/cjbfbsz.png')" />
								<br />
								<span>积分成长计划</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/readClockIn/set')">
							<a @click="loadNextPage('readPunchClock/readPunchClockSetIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/cjbfbsz.png')" />
								<br />
								<span>阅读打卡</span>
							</a>
						</li>
						<!--                        <li>-->
						<!--                            <a @click="loadNextPage('oralArithmetic/oralArithmeticindex')">-->
						<!--                                <img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/oral_clock.png">-->
						<!--                                <br>-->
						<!--                                <span>口算打卡</span>-->
						<!--                            </a>-->
						<!--                        </li>-->


						<!-- <li v-if="isShowByPermission('/schoolCharge/index')">
                            <a @click="loadNextPage('campusFeesSetup')">
                                <img
                                    class="background_ul_img"
                                    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xysfsz.png"
                                />
                                <br/>
                                <span>校园收费设置</span>
                            </a>
                        </li> -->

						<li v-if="isShowByPermission('/eachyear_tenthings/eachLevelThingsSet')">
							<a @click="loadNextPage('tenEvent/tenEventSet')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xysfsz.png" />
								<br />
								<span>六十事</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/bigEventNoteSet/getBigEventNoteSet')">
							<a @click="loadNextPage('memorabiliaSet/memorabiliaSet')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xysfsz.png" />
								<br />
								<span>大事记</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/schoolBehavior/schoolBehaviorTypeList')||isShowByPermission('/schoolBehavior/schoolBehaviorTypeListTwo')">
							<a @click="loadNextPage('ketang/ketangSetup')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/ktpjsz.png" />
								<br />
								<span>课堂评价设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/schoolBehEval/getSchoolBehInit')">
							<a @click="loadNextPage('classroomEvaluationtwo/classroomEvaluationtwosetup')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/ktpjsz.png" />
								<br />
								<span>课堂评价推送设置</span>
							</a>
						</li>
						
						<li v-if="isShowByPermission('/classRatingSet/goToRecordSetDetailPage')">
							<a @click="loadNextPage('classevaluate/classevaluateindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/classRating.png" />
								<br />
								<span>班级评价设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/classCircle/classCircleSetManage')">
							<a @click="loadNextPage('classCircle/classCircleindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/class_circle_set%20.png" />
								<br />
								<span>班级圈设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/schoolConduct/schoolConductTypeList')">
							<a @click="loadNextPage('deyu/DeyuList')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xwsz.png" />
								<br />
								<span>德育评价设置</span>
							</a>
						</li>

						<li v-if="isShowByPermission('/campusMan/campusManManger')">
							<a @click="loadNextPage('onDuty/index')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xwsz.png" />
								<br />
								<span>值班及进出校设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/calendar/getCalendarSet')">
							<a @click="loadNextPage('schedule/scheduleSetup')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/calendar.png" />
								<br />
								<span>日程设置</span>
							</a>
						</li>
						<!--
                                                    @title  : 放学模块
                                                    @type   : 新增
                                                    @date   : 2020-07-27
                                                    @des    : 新增入口
                                    -->

						<li v-if="isShowByPermission('/teacherHonor/set')">
							<a @click="loadNextPage('teacherHonorSetting/index')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/teacher-honor-statistic.png" />
								<br />
								<span>教师荣誉设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/printPrice/toPriceListPage')">
							<a @click="loadNextPage('printApplication/setting')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/teacher-honor-statistic.png" />
								<br />
								<span>印制设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/printSeniorOffice/getPrintSeniorOfficeList')">
							<a @click="loadNextPage('office/officeindex')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/xwsz.png" />
								<br />
								<span>办公室设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/birthdaywish/set')">
							<a @click="loadNextPage('birthWish/setting')">
								<img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/systemSetup/birthWish.png" />
								<br />
								<span>生日祝福设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/album/albumInit')">
							<a @click="loadNextPage('photo/setting')">
								<img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/systemSetup/photo.png" />
								<br />
								<span>相册设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/dutyStudenSet/set')">
							<a @click="loadNextPage('studentOnDuty/studentOnDutySetting')">
								<img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/systemSetup/photo.png" />
								<br />
								<span>值日生提醒设置</span>
							</a>
						</li>


						<!-- <li v-if="isShowByPermission('/recruitMessageTemplate/queryTemplateBySchoolId')">
                            <a @click="loadNextPage('message/MessageTemplateSetting')">
                                <img
                                    class="background_ul_img"
                                    :src="require('@/assets/images/system_set/attendance.png')"
                                />
                                <br/>
                                <span>短信模板设置</span>
                            </a>
                        </li> -->
						<li v-if="isShowByPermission('/workFlow/getWorkFlowList')">
							<a @click="loadNextPage('flow/flowList')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/workflow.png" />
								<br />
								<span>流程引擎</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/listenClassRecord/set')">
							<a @click="loadNextPage('openClass/openClassSetting')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/tkpj.png" />
								<br />
								<span>听课评价配置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/covidAbcfy/updateSyncSchool')">
							<a @click="loadNextPage('epidemicPre/epidemicPreSetting')">
								<img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/zhfy2.png" />
								<br />
								<span>智慧防疫设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/electiveCourse/electiveCourseSet')||isShowByPermission('/electiveCourse/coursePlatformSet')">
							<a @click="loadNextPage('schoolbasedcurriculum/schoolbasedcurriculumsetup')">
								<img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/systemSetup/xbkcsz.png" />
								<br />
								<span>校本课程推送设置</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/peanutBeh/seteanutIndicatorInit')">
							<a @click="loadNextPage('fiveEducationSetup/indicatorindex?type=1')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/wyzb.png')" />
								<br />
								<span>五育指标</span>
							</a>
						</li>
						<li v-if="isShowByPermission('/peanutBeh/seteanutIndicatorInit')">
							<a @click="loadNextPage('fiveEducationSetup/indicatorindex?type=2')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/hhrzb.png')" />
								<br />
								<span>合伙人指标</span>
							</a>
						</li>
							<li v-if="isShowByPermission('/heartEdu/volunteerMan')">
							<a @click="loadNextPage('volunteerService/volunteerServiceIndex')">
								<img class="background_ul_img" :src="require('@/assets/images/system_set/zyfw.png')" />
								<br />
								<span>志愿服务</span>
							</a>
						</li>
						<li  v-if="isShowByPermission('/schoolBehaviorRankInit/getSchoolBehaviorRankInitList')">
							<a @click="loadNextPage('ketang/ketanggrouping')">
								<img class="background_ul_img" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/fzjfsz.png" />
								<br />
								<span>分组积分设置</span>
							</a>
						</li>
<!--                        <li v-if="isShowByPermission('/enrollStudentInfo/toFieldSetPage')">-->
<!--                            <a @click="loadNextPage('schoolSignupHighSetting')">-->
<!--                                <img class="background_ul_img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/zhfy2.png" />-->
<!--                                <br />-->
<!--                                <span>高中招生报名设置</span>-->
<!--                            </a>-->
<!--                        </li>-->
						<!-- <li v-if="isShowByPermission('/covidAbcfy/updateSyncSchool')">
							<a @click="loadNextPage('qlthSettingIndex')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/cyanBlue.png" />
								<br />
								<span>青蓝同辉师徒名单设置</span>
							</a>
						</li> -->
						 
						<!-- <li v-if="isShowByPermission('/structure/visit/visitMan')">
							<a @click="loadNextPage('visitorReservation/index')">
								<img class="background_ul_img" src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/attendance_rules.png" />
								<br />
								<span>访客预约设置</span>
							</a>
						</li> -->
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { isShowByPermission, isShowByPermissionList } from '@/utils'
import windowResizeMixin from '@/mixins/windowResize'
import {getSchoolTimeList} from '@/api/record';
export default {
	data() {
		return {
			isKindergartenPage: false,
			schoolTimeId:''
		}
	},
	created() {
		if (window.sessionStorage.getItem('pc_login_type') === 'kindergarten') {
			this.isKindergartenPage = true
		}
		 getSchoolTimeList().then(res => {
          if (res.data.code === 200) {
            const self = this;
           res.data.data.forEach((item) => {
              if (item.isCurrent === 1) {
                self.schoolTimeId = item.id;
              }
            });
          }
        }).catch();
	},
	mixins: [windowResizeMixin],
	methods: {
		isShowByPermissionList,
		isShowByPermission,
		loadNextPage(pagePath,fireType) {
			this.$router.push({ path: pagePath })
			if(pagePath=='fireSetup/newstopgangsettings'||pagePath=='newstopgangsettings'){
                this.$router.push({ path: pagePath,query:{
						fireType:fireType,
						schoolTimeId:this.schoolTimeId
						}})
			}
		}
	}
}
</script>
<style scoped>
.app-container {
	overflow: auto;
}

.mudule-info {
	margin-left: 20px;
	height: 40px;
	line-height: 40px;
	color: #428bca;
}

hr {
	margin: 0 auto;
	padding: 0;
	width: 96%;
	border: 0;
	border-top: 1px solid #eee;
}

.background_ul {
	margin: 0;
	padding: 0;
	overflow: auto;
}

ul,
menu,
dir {
	display: block;
	list-style-type: disc;
	-webkit-margin-before: 0;
	-webkit-margin-after: 0;
	-webkit-margin-start: 0;
	-webkit-margin-end: 0;
	-webkit-padding-start: 0;
}

.background_ul li a {
	text-decoration: none;
	float: left;
	color: #000;
	font-size: 13px;
	text-align: center;
	width: 10em;
}

.background_ul li {
	margin-left: 20px;
	margin-top: 10px;
	list-style-type: none;
	float: left;
	width: 130px;
	height: 95px;
	line-height: 25px;
	margin-bottom: 5px;
}

.background_ul li img {
	width: 40px !important;
	height: 40px !important;
	margin-top: 10px;
	margin: 0 auto;
}

.background_ul span {
	color: #7b7b7b;
	font-size: 13px;
	color: #6c6c6c;
	width: 100%;
	display: block;
	margin-top: 10px;
	text-align: center;
}

.background_ul li img {
	width: 40px !important;
	height: 40px !important;
	margin-top: 10px;
}

.background_ul a:hover img {
	-moz-transform: scale(1.3);
	-moz-transform: all 0.5s ease 0s;
	-ms-transform: scale(1.3);
	-ms-transform: all 0.5s ease 0s;
	-webkit-transform: scale(1.3);
	-webkit-transform: all 0.5s ease 0s;
	transform: scale(1.3);
	transition: all 0.5s ease 0s;
}

.background_ul a:hover {
	-moz-box-shadow: 0px 0px 4px 4px #e0e0e0;
	/*firefox*/
	-webkit-box-shadow: 0px 0px 4px 4px #e0e0e0;
	/*webkit*/
	box-shadow: 0px 0px 4px 4px #e0e0e0;
	/*opera鎴杋e9*/
}
</style>
