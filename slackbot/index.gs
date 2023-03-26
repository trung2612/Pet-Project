/*
 * CONSTANT
 */
// More information about the usage of this url directory in https://api.slack.com/methods
const CONVERSATIONS_HISTORY_URL = "https://slack.com/api/conversations.history"; // bot/user token: channels:history groups:history im:history mpim:history
const CONVERSATIONS_MEMBERS_URL = "https://slack.com/api/conversations.members"; // bot/user token: channels:read groups:read im:read mpim:read
const CHAT_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage"; // bot token: chat:write
// user token chat:write chat:write:user chat:write:bot
const USERS_INFO_URL = "https://slack.com/api/users.info"; // bot/user token: users:read
const USERS_PROFILE_URL = "https://slack.com/api/users.profile.get"; // bot/user token: users.profile:read
// BOT token
let TOKEN = "Bearer ";
// Channel id
let CHANNEL_ID = "";
// GG sheet
const CONFIGURE_SPREAD_SHEET_ID =
  "1MbI1YYzRBXDAFYJp01CvZq4dT12UXMS2nGr7byWTdvU"; // sheet sample
const CONFIGURE_SHEET_NAME = "1";
// delete sheet after 30 days
const THIRTY_DAYS = 30;
/*
 * API
 */
/**
 * Builds a complete URL from a base URL and a map of URL parameters.
 * @param {string} url The base URL.
 * @param {Object.<string, string>} params The URL parameters and values.
 * @return {string} The complete URL.
 * @Private bot
 */
const buildUrl2_ = (url, params) => {
  var paramString = Object.keys(params)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + paramString;
};
// configure api
const callApi = async (url, params, option) => {
  const options = {
    method: "get",
    headers: {
      Authorization: TOKEN,
    },
    ...option,
  };
  try {
    const response = await UrlFetchApp.fetch(buildUrl2_(url, params), options);
    return JSON.parse(await response.getContentText());
  } catch (error) {
    console.error(error);
  }
};
// list api
const api = () => {
  return {
    async getConversationsHistory() {
      const today = new Date().setHours(00, 00, 00);
      const params = { channel: CHANNEL_ID, oldest: today / 1000 };
      const response = await callApi(CONVERSATIONS_HISTORY_URL, params);

      return response.messages;
    },
    async getConversationsMembers() {
      const params = { channel: CHANNEL_ID };
      const response = await callApi(CONVERSATIONS_MEMBERS_URL, params);
      const members = response.members;

      return members;
    },
    async postChatPostMessage(channel, message) {
      const params = { channel: channel, text: message };
      const option = { method: "post" };
      const response = await callApi(CHAT_POST_MESSAGE_URL, params, option);

      return response.message;
    },
    async getUsersInfo(id) {
      const params = { user: id };
      const response = await callApi(USERS_INFO_URL, params);

      return response.user;
    },
    async getUsersProfile(id) {
      const params = { user: id };
      const response = await callApi(USERS_PROFILE_URL, params);

      return response.profile;
    },
  };
};
/*
 * HELPER
 */
// Check BOT
const isBot = async (id) => {
  const response = await api().getUsersInfo(id);
  return response?.is_bot;
};
// custom message to post
const customMessage = (membersReport, membersDoNotReport) => {
  const { messageConfigPost } = spreadSheetData;
  let membersDoNotReportStr = "";
  let messageConfigPostStr = "";
  // sample: {member_do_not_report} {number_member_do_not_report}/{all}  anh/em daily report nhé ! \\nĐã có {number_members_report} anh/em daily report

  membersDoNotReport.forEach(
    (member) => (membersDoNotReportStr += `<@${member}>`)
  ); // concatenate members into a string

  messageConfigPostStr = messageConfigPost
    .filter((msg) => msg) // remove empty line
    .join("\n"); // concatenate messageConfigPost into a string

  const message = messageConfigPostStr
    .replace(`\\n`, "\n")
    .replace(`{${"member_do_not_report"}}`, String(membersDoNotReportStr))
    .replace(
      `{${"number_member_do_not_report"}}`,
      String(membersDoNotReport.length)
    )
    .replace(
      `{${"all"}}`,
      String(membersDoNotReport.length + membersReport.length)
    )
    .replace(`{${"number_members_report"}}`, String(membersReport.length));

  return message;
};
// Read GG Sheet
const readSheet = (id, name) => {
  try {
    // spread sheet id
    const doc = SpreadsheetApp.openById(id);
    // sheet name (id)
    const sheet = doc.getSheetByName(name);
    // data in sheet
    const data = sheet.getDataRange().getValues();
    return data;
  } catch (error) {
    console.log(error);
    console.log("Có thể sheet " + name + " ko tồn tại!");
  }
};
// detele sheet by name
const deleteSheet = (id, name) => {
  try {
    // spread sheet id
    const doc = SpreadsheetApp.openById(id);
    // sheet name
    const sheet = doc.getSheetByName(name);
    // delete sheet
    doc.deleteSheet(sheet);
  } catch (error) {
    console.log(error);
  }
};
// Configure field
const getSpreadSheetData = (id, name) => {
  // data need to read
  const wordsRequire = [];
  const accountIgnore = [];
  const messageConfigPost = [];
  const messageConfigReport = [];
  const token = [];
  const channelId = [];

  const response = readSheet(id, name);
  // remove header
  response.shift();

  response.forEach((row) => {
    wordsRequire.push(row[0]);
    accountIgnore.push(row[1]);
    messageConfigPost.push(row[2]);
    messageConfigReport.push(row[3]);
    token.push(row[4]);
    channelId.push(row[5]);
  });

  return {
    wordsRequire: wordsRequire,
    accountIgnore: accountIgnore,
    messageConfigPost: messageConfigPost,
    messageConfigReport: messageConfigReport,
    token: token,
    channelId: channelId,
  };
};
// Write sheet
// getRange: chọn giá trị trong vùng chọn
// => getValue: Giá trị 1 ô
// => getValues: giá trị các ô
// getSheetValues tương tự getRange => getValues
// getDataRange => getALL
const postWeeklyReport = (spreadsheetId, currentDate) => {
  const members = [];
  // create new sheet
  const sheet = createSheet(spreadsheetId, "Weekly report " + currentDate);
  // create header
  sheet.appendRow(new Array("UserId", "Name", "Số lần ko report"));
  // read weekdays last week
  for (let i = 3; i < 8; i++) {
    const today = new Date();
    const dateTime = new Date(today.setDate(today.getDate() - i));
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    const weekdays = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`; // 2023-02-23
    const rows = readSheet(spreadsheetId, weekdays);
    if (rows) {
      rows.shift();
      rows.forEach((row) => members.push(row));
    }
  }
  // duplicate times
  const count = {};
  members.forEach((item) => (count[item[0]] = (count[item[0]] || 0) + 1));
  // write weekly report gg sheet
  members
    .map(JSON.stringify)
    .filter((e, i, a) => i === a.indexOf(e))
    .map(JSON.parse) // remove duplicate in two-dimensional array
    .forEach(async (member) => {
      const id = member[0];
      const name = member[1];
      const times = count[member[0]];
      sheet.appendRow(new Array(id, name, times));
    });
};
// delete sheet over 30 days
const deleteSheetOver30Days = (spreadsheetId) => {
  const today = new Date();
  const dateTime = new Date(today.setDate(today.getDate() - THIRTY_DAYS));
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const day = dateTime.getDate();
  const deleteDay = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`; // 2023-02-23
  deleteSheet(spreadsheetId, deleteDay);
};
// create report in gg sheet
const postReportToGGSheet = async () => {
  const dateTime = new Date();
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const day = dateTime.getDate();
  const currentDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`; // 2023-02-23
  const fileName = `Daily Report`;
  // Create spread sheet name
  const spreadsheetId = createSpreadSheet(fileName);
  // create new sheet
  const sheet = createSheet(spreadsheetId, currentDate);
  // create header
  sheet.appendRow(new Array("UserId", "Name"));
  // get configured member id
  const membersDoNotReport = await getMembersDoNotReport();
  // post member do nto report to gg sheet
  membersDoNotReport.forEach(async (id, i) => {
    let usersProfile = await api().getUsersProfile(id);
    let name = usersProfile.display_name_normalized;
    sheet.appendRow(new Array(id, name));
  });
  // post weekly report on Monday
  if (dateTime.getDay() === 1) {
    postWeeklyReport(spreadsheetId, currentDate);
  }
  //delete sheet over 30 days
  deleteSheetOver30Days(spreadsheetId);
};
// Create Spread Sheet by name
const createSpreadSheet = (name) => {
  try {
    return SpreadsheetApp.open(DriveApp.getFilesByName(name).next()).getId();
  } catch (error) {
    console.log(error);
    return SpreadsheetApp.create(name).getId(); // create Spread Sheet & return Spread Sheet Id
  }
};
// Create Sheet by name
// Not existed => return new id
// Existed => get id, clear data
function createSheet(id, name) {
  try {
    // Create new
    return SpreadsheetApp.openById(id).insertSheet(name);
  } catch (error) {
    console.log(error);
    const sheet = getSheet(id, name);
    // Clear existed
    sheet.clear();
    return sheet;
  }
}
// Create Sheet by name
const getSheet = (id, name) => {
  const spreadsheet = SpreadsheetApp.openById(id);
  return spreadsheet.getSheetByName(name);
};
// check if message contain all word require
const checkMessageContainRequiredWord = (message) => {
  const { wordsRequire } = spreadSheetData;
  const result = wordsRequire.some((word) =>
    message.toLowerCase().includes(word.trim().toLowerCase())
  );

  return result;
};
/*
 * CALL API
 */
// members that report today
const getMembersReport = async () => {
  const conversationsHistory = await api().getConversationsHistory();
  const membersReport = [];
  // member report contain all word require
  conversationsHistory.forEach((message) => {
    if (checkMessageContainRequiredWord(message.text))
      membersReport.push(message.user);
  });
  //Remove member report many times
  return membersReport.filter((member, index) => {
    return membersReport.indexOf(member) == index;
  });
};
// members that do not report today
const getMembersDoNotReport = async () => {
  // find member reported in channel
  const conversationsMembers = await api().getConversationsMembers();
  // account ignore from gg sheet
  const { accountIgnore } = spreadSheetData;
  // members that reported
  const membersReport = await getMembersReport();
  // bot in channel
  const bots = [];
  for (let i = 0; i < conversationsMembers.length; i++) {
    if (await isBot(conversationsMembers[i])) {
      bots.push(conversationsMembers[i]);
    }
  }
  // filter members report && filter account ignore && bot
  return conversationsMembers.filter(
    (member) =>
      !membersReport.includes(member) &&
      !accountIgnore.includes(member) &&
      !bots.includes(member)
  );
};
/*
 * FUNCTION
 */
// post message to daily-report-channel
const postMembersDoNotReport = async () => {
  // get configured member
  const membersDoNotReport = await getMembersDoNotReport();
  const membersReport = await getMembersReport();
  // Initial message
  const message = customMessage(membersReport, membersDoNotReport);
  // Create post request to hapv-daily-report
  await api().postChatPostMessage(CHANNEL_ID, message);
  // create gg sheet report
  await postReportToGGSheet();
};
/*
 * Main
 */
const main = async () => {
  const isWeekend = (date = new Date()) => {
    return date.getDay() === 6 || date.getDay() === 0;
  };
  if (isWeekend()) {
    return;
  }

  spreadSheetData = getSpreadSheetData(
    CONFIGURE_SPREAD_SHEET_ID,
    CONFIGURE_SHEET_NAME
  );
  const { token, channelId } = spreadSheetData;
  TOKEN += token[0];
  CHANNEL_ID += channelId[0];
  await postMembersDoNotReport();
};
