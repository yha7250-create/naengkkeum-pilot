import { useState } from "react"
import PhoneFrame from "./components/PhoneFrame"
import EagleMascot from "./components/EagleMascot"
import SplashScreen from "./screens/student/SplashScreen"
import SchoolSelectScreen from "./screens/student/SchoolSelectScreen"
import DormSelectScreen from "./screens/student/DormSelectScreen"
import ProfileRegisterScreen from "./screens/student/ProfileRegisterScreen"
import FridgeConfigScreen from "./screens/student/FridgeConfigScreen"
import FridgeScreen from "./screens/student/FridgeScreen"
import MenuScreen from "./screens/student/MenuScreen"
import GroupBuyScreen from "./screens/student/GroupBuyScreen"
import AddFoodScreen from "./screens/student/AddFoodScreen"
import ImpactScreen from "./screens/student/ImpactScreen"
import ReportScreen from "./screens/student/ReportScreen"
import CommunityScreen from "./screens/student/CommunityScreen"
import MyFoodsScreen from "./screens/student/MyFoodsScreen"
import NotificationSettingsScreen from "./screens/student/NotificationSettingsScreen"
import ProfileEditScreen from "./screens/student/ProfileEditScreen"
import AdminSplashScreen from "./screens/admin/AdminSplashScreen"
import AdminCodeScreen from "./screens/admin/AdminCodeScreen"
import AdminCodeIssueScreen from "./screens/admin/AdminCodeIssueScreen"
import AdminDormSelectScreen from "./screens/admin/AdminDormSelectScreen"
import AdminFridgeOverviewScreen from "./screens/admin/AdminFridgeOverviewScreen"
import AdminFoodDetailScreen from "./screens/admin/AdminFoodDetailScreen"
import AdminMenuScreen from "./screens/admin/AdminMenuScreen"
import AdminOperationsScreen from "./screens/admin/AdminOperationsScreen"
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen"
import AdminStatsScreen from "./screens/admin/AdminStatsScreen"
import AdminStoragePolicyScreen from "./screens/admin/AdminStoragePolicyScreen"
import AdminFridgeSelectScreen from "./screens/admin/AdminFridgeSelectScreen"
import { useDormMealStore, type DormMealStore } from "./useDormMealStore"
import PilotGate from "./pilot/PilotGate"

type StudentScreen = "splash" | "schoolSelect" | "dormSelect" | "profileRegister" | "profileEdit" | "fridge" | "impact" | "report" | "community" | "menu" | "groupBuy" | "addFood" | "myFoods" | "notificationSettings"
type AdminScreen = "adminSplash" | "adminCode" | "adminCodeIssue" | "adminSchoolSelect" | "adminDormSelect" | "adminFridgeSelect" | "adminFridgeConfig" | "adminFridge" | "adminOperations" | "adminFoodDetail" | "adminMenu" | "adminDashboard" | "adminStats" | "adminStoragePolicy"

const studentLabels: Record<StudentScreen, string> = {
  splash: "시작", schoolSelect: "학교", dormSelect: "기숙사", profileRegister: "내 정보",
  fridge: "내 냉장고", impact: "절감 리포트", report: "문제 신고", community: "커뮤니티", menu: "메뉴", groupBuy: "공동구매", addFood: "음식 등록",
  myFoods: "내 음식", notificationSettings: "알림 설정",
  profileEdit: "내 정보 수정",
}

const adminLabels: Record<AdminScreen, string> = {
  adminSplash: "시작", adminCode: "코드 로그인", adminCodeIssue: "코드 발행", adminSchoolSelect: "학교", adminDormSelect: "관리 구역", adminFridgeConfig: "냉장고 구조",
  adminFridgeSelect: "냉장고 선택",
  adminFridge: "냉장고 현황", adminOperations: "운영 센터", adminFoodDetail: "음식 정보", adminMenu: "메뉴", adminDashboard: "대시보드", adminStats: "통계", adminStoragePolicy: "보관 한도",
}

function StudentApp({ store }: { store: DormMealStore }) {
  const [screen, setScreen] = useState<StudentScreen>(() => window.localStorage.getItem("naengkkeum.studentOnboarded") === "true" ? "fridge" : "splash")
  const [history, setHistory] = useState<StudentScreen[]>([])
  const go = (next: string) => { if (next === "fridge") window.localStorage.setItem("naengkkeum.studentOnboarded", "true"); setHistory(items => [...items, screen]); setScreen(next as StudentScreen) }
  const back = () => setHistory(items => { if (!items.length) return items; setScreen(items[items.length - 1]); return items.slice(0, -1) })

  const content = (() => {
    switch (screen) {
      case "splash": return <SplashScreen onNext={go} />
      case "schoolSelect": return <SchoolSelectScreen onNext={go} onBack={back} residence={store.residence} onSave={store.updateResidence} />
      case "dormSelect": return <DormSelectScreen onNext={go} onBack={back} initial={store.residence} onSave={store.updateResidence} fridges={store.fridges} />
      case "profileRegister": return <ProfileRegisterScreen onNext={go} onBack={back} initial={store.profile} onSave={store.updateProfile} />
      case "fridge": return <FridgeScreen onNext={go} foods={store.foods} layout={store.fridgeLayout} residence={store.studentResidence} profile={store.profile} impact={store.impact} personalLimit={store.personalLimit} onComplete={store.completeFood} announcements={store.announcements} fridgeId={store.studentFridgeId} communityGoal={store.studentCommunityGoal} />
      case "impact": return <ImpactScreen onBack={back} foods={store.foods} impact={store.impact} />
      case "report": return <ReportScreen onBack={back} reports={store.reports} onSubmit={store.addReport} residence={store.studentResidence} profile={store.profile} />
      case "community": return <CommunityScreen onBack={back} rooms={store.rooms} onAddRoom={store.addRoom} onSend={store.sendMessage} residence={store.studentResidence} />
      case "menu": return <MenuScreen onBack={back} onNext={go} profile={store.profile} residence={store.studentResidence} />
      case "groupBuy": return <GroupBuyScreen onBack={back} rooms={store.rooms} profile={store.profile} residence={store.studentResidence} onAddRoom={store.addRoom} onJoin={store.joinGroupBuy} onTogglePayment={store.toggleGroupBuyPayment} />
      case "addFood": return <AddFoodScreen onBack={back} onDone={store.addFood} usedUnits={store.usedUnits} usedUnitsByZone={store.usedUnitsByZone} storagePolicy={store.storagePolicy} foods={store.foods} layout={store.fridgeLayout} residence={store.studentResidence} profile={store.profile} quickFoods={store.quickFoods} />
      case "myFoods": return <MyFoodsScreen onBack={back} onNext={go} foods={store.foods} profile={store.profile} onComplete={store.completeFood} onUpdateQuantity={store.updateFoodQuantity} />
      case "notificationSettings": return <NotificationSettingsScreen onBack={back} initial={store.notificationSettings} onSave={store.saveNotificationSettings} />
      case "profileEdit": return <ProfileEditScreen onBack={back} profile={store.profile} residence={store.studentResidence} fridges={store.fridges} activeFoodCount={store.ownedFoods.length} onSaveProfile={store.updateProfile} onSaveResidence={store.updateResidence} />
    }
  })()

  return <PhoneFrame statusLabel={`학생앱 · ${studentLabels[screen]}`}>{content}</PhoneFrame>
}

function AdminApp({ store }: { store: DormMealStore }) {
  const [authenticated, setAuthenticated] = useState(Boolean(store.adminSession))
  const [screen, setScreen] = useState<AdminScreen>(store.adminSession ? "adminDashboard" : "adminSplash")
  const [history, setHistory] = useState<AdminScreen[]>([])
  const publicScreens: AdminScreen[] = ["adminSplash", "adminCode"]

  const go = (requested: string) => {
    const mapped = requested === "adminProfileRegister" ? "adminFridgeConfig" : requested as AdminScreen
    const next = !authenticated && !publicScreens.includes(mapped) ? "adminCode" : mapped
    setHistory(items => [...items, screen])
    setScreen(next)
  }
  const back = () => setHistory(items => { if (!items.length) return items; setScreen(items[items.length - 1]); return items.slice(0, -1) })
  const login = (code: string, name: string) => { const ok = store.verifyAdminCode(code, name); if (ok) setAuthenticated(true); return ok }
  const logout = () => {
    if (!window.confirm("RA 관리 화면에서 로그아웃할까요? 같은 RA 이름과 기존 코드로 다시 로그인할 수 있습니다.")) return
    store.logoutAdmin()
    setAuthenticated(false)
    setHistory([])
    setScreen("adminSplash")
  }

  const content = (() => {
    switch (screen) {
      case "adminSplash": return <AdminSplashScreen onNext={go} />
      case "adminCode": return <AdminCodeScreen onBack={back} verify={login} onSuccess={() => { setHistory([]); setScreen("adminSchoolSelect") }} />
      case "adminCodeIssue": return <AdminCodeIssueScreen onBack={back} codes={store.adminCodes} onIssue={store.issueAdminCode} onDisable={store.disableAdminCode} />
      case "adminSchoolSelect": return <SchoolSelectScreen onNext={go} onBack={back} nextScreen="adminDormSelect" residence={store.residence} onSave={store.updateResidence} />
      case "adminDormSelect": return <AdminDormSelectScreen onNext={go} onBack={back} residence={store.residence} managedAreas={store.adminManagedAreas} onSave={store.updateResidence} onSaveAreas={store.saveAdminManagedAreas} />
      case "adminFridgeSelect": return <AdminFridgeSelectScreen fridges={store.adminFridges} archivedFridges={store.archivedAdminFridges} managedAreas={store.adminManagedAreas} selectedId={store.selectedAdminFridgeId} onSelect={store.selectAdminFridge} onAdd={store.addAdminFridge} onArchive={store.archiveAdminFridge} onRestore={store.restoreAdminFridge} onBack={back} onNext={go} />
      case "adminFridgeConfig": return <FridgeConfigScreen adminMode fridgeId={store.activeAdminFridge?.id} onSaveName={store.renameAdminFridge} onNext={() => go("adminDashboard")} onBack={back} initial={store.adminFridgeLayout} residence={store.adminResidence} onSave={store.saveAdminFridgeLayout} />
      case "adminDashboard": return <AdminDashboardScreen onNext={go} foods={store.foods} fridges={store.adminFridges} reports={store.reports} rooms={store.rooms} residence={store.adminResidence} adminName={store.adminSession ?? "RA"} storagePolicy={store.storagePolicy} activeFridge={store.activeAdminFridge} communityGoal={store.adminCommunityGoal} onUpdateGoal={store.updateCommunityGoalTarget} />
      case "adminFridge": return <AdminFridgeOverviewScreen onNext={go} foods={store.foods} layout={store.adminFridgeLayout} residence={store.adminResidence} profile={store.profile} />
      case "adminOperations": return <AdminOperationsScreen onBack={back} onNext={go} fridges={store.adminFridges} reports={store.reports} onUpdateStatus={store.updateReportStatus} announcements={store.announcements} onSendAnnouncement={store.sendAnnouncement} />
      case "adminStats": return <AdminStatsScreen onNext={go} activities={store.activities} foods={store.foods} fridges={store.adminFridges} />
      case "adminStoragePolicy": return <AdminStoragePolicyScreen initial={store.storagePolicy} onBack={back} onSave={store.saveStoragePolicy} />
      case "adminFoodDetail": return <AdminFoodDetailScreen onBack={back} />
      case "adminMenu": return <AdminMenuScreen onBack={back} onNext={go} />
    }
  })()

  return <div className="phone-column">{authenticated && <div className="admin-session-actions"><button onClick={() => go("adminCodeIssue")}>＋ 코드 발행</button><button onClick={logout}>{store.adminSession} · 로그아웃</button></div>}<PhoneFrame statusLabel={`관리자앱 · ${adminLabels[screen]}`}>{content}</PhoneFrame></div>
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student")
  const store = useDormMealStore()
  return <PilotGate store={store}>{(
    <div className="showcase-shell">
      <header className="showcase-header">
        <div className="brand-lockup"><div className="brand-icon"><EagleMascot size={44} /></div><div><h1>냉큼</h1><p>함께 쓰는 냉장고를 더 깨끗하고 공정하게</p></div></div>
        <div className="view-switcher">{([["student", "학생으로 시작"], ["admin", "RA 로그인"]] as const).map(([tab, label]) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{label}</button>)}</div>
      </header>
      <main className="showcase-content">
        {activeTab === "student" && <section className="app-preview"><div className="preview-label">🎓 학생용 앱</div><StudentApp store={store} /></section>}
        {activeTab === "admin" && <section className="app-preview"><div className="preview-label admin">⭐ RA 관리자용 앱</div><AdminApp store={store} /></section>}
      </main>
    </div>
  )}</PilotGate>
}
