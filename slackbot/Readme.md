# Welcome to HaPV-DailyReport-BOT

Con BOT này dùng để  
- Kiểm tra trong nhóm daily report những ai chưa report để nhắc nhở
- Đếm số người chưa/đã report
- Kiểm tra được các require word cần phầi có
- Không kiểm tra những người đặc biệt ví dụ như Giám đốc, những con BOT, ...
- Cấu hình các message con BOT sẽ bắn ra
- Ghi lại các report ở GG Sheet
- Weekly của tuần trước vào thứ 2 hàng tuần
- Xóa những bản report quá 30 ngày

## Required
- bot token
- bot token có quyền `channels:history` `groups:history` `im:history` `mpim:history` `channels:read` `groups:read` `im:read` `mpim:read` `chat:write` `users:read` `users.profile:read`
- user token có quyền `channels:history` `groups:history` `im:history` `mpim:history` `channels:read` `groups:read` `im:read` `mpim:read` `chat:write` `chat:write:user` `chat:write:bot` `users:read` `users.profile:read`
- Google sheet configure bao gồm: 
    - `words_require`
    - `account_ignore`
    - `message_config_post`
    - `message_config_report`
- channel id

## Setup

### Tạo BOT

Truy cập https://api.slack.com/apps 
-> Create New App
-> Điền các thông tin cần thiết

### Lấy BOT token

Truy cập https://api.slack.com/apps 
-> Chọn App Name
-> Tại OAuth & Permissions -> Bot User OAuth Token
-> Click Copy

### Phân quyền

Truy cập https://api.slack.com/apps 
-> Chọn App Name
-> Tại OAuth & Permission -> Scope
-> Click Add an OAuth Scope
-> Chọn các quyền [Required](#required)

### Lấy channel id 

Vào 1 group bất kỳ 
Ví dụ: https://app.slack.com/client/T02CJTUJ2BY/C03S3NCHJ58
-> C03S3NCHJ58 (id)

### Add BOT vào channel

Vào channel bất kỳ
-> Gõ `@` + tên con BOT (nếu thấy `Not in channel` tức chưa được add)
-> Ấn `Enter` để gửi tin nhắn
```zsh
Slackbot
You mentioned @BOT, but they’re not in this private channel.
Invite Them    Do Nothing
```
-> Click Invite Them 

### Lấy thông tin GG sheet

Url của gg sheet có dạng `https://docs.google.com/spreadsheets/d/xxx/edit`
-> `xxx` chính là id của gg sheet

Template: https://docs.google.com/spreadsheets/d/1MbI1YYzRBXDAFYJp01CvZq4dT12UXMS2nGr7byWTdvU/edit#gid=0

NOTE: nhớ phân quyền cho sheet của mình

### Thay các giá trị trong file configure

Chỉ thay thông tin ở `BOT token` `Channel`

#### `BOT token`

Lấy token ở [Lấy BOT token](#lấy-bot-token) có dạng `Bearer xoxb-xxx` rồi thay thế `token`

#### `Channel`

Lấy id của daily report channel ở [Lấy channel id](#lấy-channel-id) rồi thay vào `CHANNEL_ID`

### Thay các giá trị ở mục `CONSTANT` (thay file configure)

Chỉ thay thông tin ở `GG sheet`

#### `GG sheet`

Lấy id của gg sheet và tên sheet trong đấy ở [Lấy thông tin GG sheet](#lấy-thông-tin-gg-sheet) rồi thay vào `CONFIGURE_SPREAD_SHEET_ID` và `CONFIGURE_SHEET_NAME`

## Running BOT

Truy cập [Google Script](https://script.google.com/home)
-> Click `Dự án mới`
-> Ở Tệp
-> Paste code vào
-> Lưu
-> CLick `Kich hoạt` (hình cái đồng hồ ở thanh sidebar bên trái)
-> Click `Thêm trình kích hoạt`
-> Chọn hàm sẽ chạy `main`, Hoạt động triển khai sẽ chạy: `Phần đầu`, Chọn nguồn sự kiện: `Theo thời gian`, Chọn loại trình kích hoạt dựa trên thời gian: `Đồng hồ đếm ngày`, Chọn thời gian trong ngày: chọn theo mong muốn
-> Lưu
-> Done

NOTE: Phần ghi GG sheet cần chạy lần đầu bằng tay để phần quyền user
GG Sheet ghi ở driver của người cấp quyền

## Resources

- Api: https://api.slack.com/methods
- GG sheet api: [Video](https://www.youtube.com/watch?v=Au3nVAGZKQU&list=PL42xwJRIG3xBZFP5wYh-OFb-CQmjz-Rn-&index=1&ab_channel=DavidWeiss) 
- https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app 
- https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#deleterowsrowposition,-howmany
- https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getactivespreadsheet

# ENJOY