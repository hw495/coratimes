export const studio = { name: "S.T Pilates", slug: "st-pilates" };

export const coaches = [
  { id: 1, name: "Sammi", initial: "S", bg: "#F5ECE6", color: "#A87A62", photo: null, studios: ["S.T Pilates"], phone: "0912-000-001", email: "sammi@stpilates.com", instagram: "@sammi_pilates", bio: "專注於脊椎矯正與核心肌群訓練，每位學員都能感受到細緻的陪伴。", skills: ["器械", "墊上", "復健"], title: "資深皮拉提斯教練", exp: "8年", sessions: 42, members: 12, visible: true, salary: { type: "per_session", amount: 800 } },
  { id: 2, name: "Annie", initial: "A", bg: "#EEF2F6", color: "#8A9BAE", photo: null, studios: ["S.T Pilates"], phone: "0933-000-002", email: "annie@stpilates.com", instagram: "", bio: "結合瑜珈與皮拉提斯，幫助學員找回身體的自然平衡。", skills: ["墊上", "瑜珈"], title: "瑜珈暨皮拉提斯教練", exp: "5年", sessions: 18, members: 5, visible: false, salary: { type: "per_session", amount: 700 } },
];

export const courses = [
  { id: 1, name: "器械 1 對 1", type: "solo", color: "#C4957A", room: "靜心室", duration: 60, deduct: 1, visible: true },
  { id: 2, name: "墊上 1 對 1", type: "solo", color: "#7A9E8E", room: "靜心室", duration: 60, deduct: 1, visible: true },
  { id: 3, name: "墊上 1 對 2", type: "group", color: "#9B8FAE", room: "靜心室", duration: 50, deduct: 1, visible: true },
  { id: 4, name: "體驗時光",    type: "group", color: "#9B8FAE", room: "靜心室", duration: 50, deduct: 0, visible: true },
  { id: 5, name: "靜心室借用",  type: "space", color: "#B8924A", room: "靜心室", duration: 60, deduct: 0, visible: false },
];

export const plans = [
  { id: 1, type: "exp",    typeName: "初次體驗", name: "墊上體驗一次",    sub: "1 次・購後 30 天", price: 588,   orig: null,   visible: true  },
  { id: 2, type: "exp",    typeName: "初次體驗", name: "器械體驗一次",    sub: "1 次・購後 30 天", price: 888,   orig: 1200,   visible: true  },
  { id: 3, type: "count",  typeName: "次數方案", name: "器械一對一 12 次", sub: "12 次・無期限",   price: 17280, orig: 22800,  visible: true  },
  { id: 4, type: "count",  typeName: "次數方案", name: "器械一對一 6 次",  sub: "6 次・無期限",    price: 9975,  orig: 11400,  visible: true  },
  { id: 5, type: "period", typeName: "期間方案", name: "週週陪練 4 週",    sub: "每週一次・28 天",  price: 7200,  orig: null,   visible: false },
  { id: 6, type: "points", typeName: "點數方案", name: "彈性點數 50 點",   sub: "50 點・180 天",   price: 4500,  orig: null,   visible: true  },
];

export const members = [
  { id: 1, name: "莊書語", healthForm: true, healthFlagged: true, healthNote: "腰椎第四節輕微滑脫，動作需放慢，避免過度後彎", nickname: "Sherry", gender: "female", countryCode: "+886", phone: "0912-345-678", email: "sherry@example.com", birthYear: "1990", birthMonth: "03", birthDay: "15", emergencyName: "莊大偉", emergencyPhone: "0922-111-222", note: "右膝舊傷，避免深蹲", initial: "莊", bg: "#F5ECE6", color: "#A87A62", joined: "2025/08/12", totalSessions: 24, monthSessions: 4, totalSpent: 34560, status: "active",
    passes: [
      { name: "器械一對一 12 次", remain: 8, total: 12, expiry: "無期限", status: "active" },
      { name: "墊上一對一 6 次",  remain: 1, total: 6,  expiry: "2026/06/01", status: "expiring" },
    ]},
  { id: 2, name: "陳怡君", nickname: "", gender: "female", countryCode: "+886", phone: "0933-221-447", email: "yijun@example.com", birthYear: "1995", birthMonth: "07", birthDay: "22", emergencyName: "陳志明", emergencyPhone: "0933-000-111", note: "", initial: "陳", bg: "#EEF2F6", color: "#8A9BAE", joined: "2025/11/03", totalSessions: 10, monthSessions: 2, totalSpent: 9975, status: "expiring",
    passes: [{ name: "器械一對一 6 次", remain: 2, total: 6, expiry: "2026/06/15", status: "expiring" }] },
  { id: 3, name: "林美玲", healthForm: true, healthFlagged: true, healthNote: "腰椎第四節輕微滑脫，動作需放慢", nickname: "Mei", gender: "female", countryCode: "+886", phone: "0966-889-123", email: "", birthYear: "1988", birthMonth: "11", birthDay: "08", emergencyName: "林建國", emergencyPhone: "0966-777-888", note: "腰椎第四節輕微滑脫，動作需放慢", initial: "林", bg: "#F0EDF5", color: "#9B8FAE", joined: "2026/01/20", totalSessions: 8, monthSessions: 3, totalSpent: 17280, status: "active",
    passes: [{ name: "器械一對一 12 次", remain: 9, total: 12, expiry: "無期限", status: "active" }] },
  { id: 4, name: "黃思穎", nickname: "Tina", gender: "female", countryCode: "+886", phone: "0955-667-890", email: "tina@example.com", birthYear: "2000", birthMonth: "01", birthDay: "30", emergencyName: "", emergencyPhone: "", note: "", initial: "黃", bg: "#F5EDD8", color: "#B8924A", joined: "2026/03/10", totalSessions: 1, monthSessions: 1, totalSpent: 588, status: "none", passes: [] },
  { id: 5, name: "王雅雯", nickname: "Yvonne", gender: "female", countryCode: "+886", phone: "0977-334-556", email: "yvonne@example.com", birthYear: "1992", birthMonth: "05", birthDay: "18", emergencyName: "王大明", emergencyPhone: "0977-999-000", note: "", initial: "王", bg: "#EAF2EF", color: "#5C7D6F", joined: "2025/09/15", totalSessions: 18, monthSessions: 4, totalSpent: 26880, status: "active",
    passes: [{ name: "器械一對一 12 次", remain: 5, total: 12, expiry: "無期限", status: "active" }] },
];

export const todaySessions = [
  { id: 1, time: "10:00", end: "11:00", course: "器械 1 對 1", coach: "Sammi", room: "靜心室", type: "solo", quota: 1, max: 1,
    attendees: [{ memberId: 1, arrived: true }] },
  { id: 2, time: "11:00", end: "12:00", course: "器械 1 對 1", coach: "Sammi", room: "靜心室", type: "solo", quota: 1, max: 1,
    attendees: [{ memberId: 2, arrived: false }] },
  { id: 3, time: "13:00", end: "14:00", course: "器械 1 對 1", coach: "Sammi", room: "靜心室", type: "solo", quota: 1, max: 1,
    attendees: [{ memberId: 3, arrived: false }] },
  { id: 4, time: "15:00", end: "16:00", course: "器械 1 對 1", coach: "Sammi", room: "靜心室", type: "solo", quota: 1, max: 1,
    attendees: [{ memberId: 5, arrived: false }] },
  { id: 5, time: "19:00", end: "20:00", course: "器械 1 對 1", coach: "Sammi", room: "靜心室", type: "solo", quota: 0, max: 1,
    attendees: [] },
  { id: 6, time: "20:10", end: "21:10", course: "墊上 1 對 2", coach: "Sammi", room: "靜心室", type: "group", quota: 1, max: 2,
    attendees: [{ memberId: 4, arrived: false }] },
];

export const payments = [
  { id: 1, member: "莊書語", mbg: "#F5ECE6", mc: "#A87A62", plan: "器械一對一 12 次", amount: 17280, method: "ATM", date: "05/17 14:32", status: "pending" },
  { id: 2, member: "陳怡君", mbg: "#EEF2F6", mc: "#8A9BAE", plan: "墊上一對一 6 次",  amount: 5400,  method: "ATM", date: "05/17 10:15", status: "pending" },
  { id: 3, member: "林美玲", mbg: "#F0EDF5", mc: "#9B8FAE", plan: "器械一對一 6 次",  amount: 9975,  method: "QRCode", date: "05/16 18:44", status: "pending" },
];

export const insights = {
  revenue: 142680, revGrowth: 12.3,
  sessions: 186, sessGrowth: 8,
  attendance: 94.6, attGrowth: -1.2,
  students: 24, studGrowth: 2,
  topCourses: [
    { name: "器械 1 對 1", count: 131 },
    { name: "墊上 1 對 1", count: 63 },
    { name: "小班共練",    count: 40 },
    { name: "體驗時光",    count: 24 },
    { name: "空間借用",    count: 15 },
  ],
  typeBreakdown: [
    { name: "專屬陪練", value: 131, color: "#C4957A" },
    { name: "小班共練", value: 40,  color: "#9B8FAE" },
    { name: "空間借用", value: 15,  color: "#B8924A" },
  ],
};

export const calendarWeek = [
  { day: "18", weekday: "周一", today: false, sessions: [
    { time:"11:00", name:"器械 1 對 1", type:"solo", quota:"1/1" },
    { time:"15:00", name:"器械 1 對 1", type:"solo", quota:"1/1" },
    { time:"17:00", name:"器械 1 對 1", type:"solo", quota:"1/1" },
  ]},
  { day: "19", weekday: "周二", today: true, sessions: [
    { time:"10:00", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
    { time:"11:00", name:"暫休",         type:"paused",quota:"—"   },
    { time:"13:00", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
    { time:"19:00", name:"墊上 1 對 2", type:"group", quota:"1/2" },
  ]},
  { day: "20", weekday: "周三", today: false, sessions: [
    { time:"10:00", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
    { time:"13:00", name:"暫休",         type:"paused",quota:"—"   },
    { time:"20:10", name:"空間借用",     type:"space", quota:"1/2" },
  ]},
  { day: "21", weekday: "周四", today: false, sessions: [
    { time:"13:00", name:"器械 1 對 1", type:"solo", quota:"1/1" },
    { time:"15:00", name:"墊上 1 對 1", type:"solo", quota:"1/1" },
    { time:"18:00", name:"器械 1 對 1", type:"solo", quota:"1/1" },
  ]},
  { day: "22", weekday: "周五", today: false, sessions: [
    { time:"10:00", name:"體驗時光",    type:"group", quota:"1/4" },
    { time:"11:00", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
    { time:"19:00", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
  ]},
  { day: "23", weekday: "周六", today: false, sessions: [
    { time:"11:00", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
    { time:"12:30", name:"墊上 1 對 1", type:"solo",  quota:"1/1" },
    { time:"15:30", name:"小班共練",    type:"group", quota:"2/4" },
  ]},
  { day: "24", weekday: "周日", today: false, sessions: [
    { time:"10:00", name:"體驗時光",    type:"group", quota:"1/4" },
    { time:"11:30", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
    { time:"14:00", name:"器械 1 對 1", type:"solo",  quota:"1/1" },
  ]},
];
