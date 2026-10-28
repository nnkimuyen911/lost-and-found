# Lost And Found (SQL/MySQL version)

> Bản fork từ repo gốc [arjuncvinod/Lost-And-Found](https://github.com/arjuncvinod/Lost-And-Found) — **đổi database từ MongoDB sang MySQL (relational SQL)**. Logic API, frontend, upload ảnh giữ nguyên.

## Project Description:
The Lost and Found Bulletin Board project is a community-driven initiative that aims to make a positive impact in our local community. Its primary goal is to help individuals who have lost items, pets, or belongings by providing a simple and accessible platform to post information about their lost possessions. It also serves those who have found items and wish to return them to their rightful owners.

- No login required — anyone can post a found item and anyone can browse/search items
- 4 REST APIs: list all, get by id, create (with image upload), delete
- Frontend React + MUI, backend Node.js/Express, database MySQL

### Languages Used:
#### Front end : ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
#### Backend : ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express.js-%23404d59&logoColor=white)
#### Database : ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) <br />

## What changed vs the original (MongoDB → MySQL)

| Trước (MongoDB)                     | Sau (MySQL)                                    |
| ----------------------------------- | ---------------------------------------------- |
| `models/itemmodel.js` (Mongoose)    | `database/schema.sql` (table `lostitems.items`) |
| `mongoose.connect(mongoURL)`        | `mysql2` connection pool (config trong `config.js`) |
| `Item.find / findById / create`     | `SELECT / INSERT` với prepared statements      |
| `_id` tự sinh của MongoDB           | `INT AUTO_INCREMENT` — API trả về vẫn là `_id` cho frontend |

## API Endpoints

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/item`               | List all items (POST data: `{count, data: [...]}`) |
| GET    | `/item/:id`           | Item detail (POST data: item object)  |
| POST   | `/item`               | Create item — form-data: `name, email, phoneno, title, description, file(image)` |
| DELETE | `/item/:id`           | Delete item                          |

Ảnh upload được serve tại `GET /files/<tên-file>`.

## Installation (local)

**Requirements:** Node.js ≥ 18, MySQL 8 (hoặc XAMPP/MariaDB)

### Step 1: Clone the repository

```bash
git clone <your-repo-url>
cd LostAndFound-SQL
```

### Step 2: Setup database (SQL)

Import schema + dữ liệu mẫu:

```bash
mysql -u root -p < Backend/database/schema.sql
```

(hoặc mở phpMyAdmin → tab **Import** → chọn `Backend/database/schema.sql`)

Kết quả: database `lostitems` với bảng `items`.

### Step 3: Run backend

```bash
cd Backend
npm install
npm start
```

Backend mặc định kết nối MySQL: `localhost:3306`, user `root`, password rỗng, DB `lostitems`.
Muốn đổi, đặt environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

### Step 4: Run frontend

```bash
cd Frontend
npm install
npm start
```

Server chạy ở http://localhost:8000, client ở http://localhost:3000.
API URL client dùng nằm ở `Frontend/src/config.js`.

## Deploy lên AWS (gợi ý kiến trúc)

```
User ──► S3 (host frontend React build) ──► EC2 (Node/Express API + MySQL)
                                              └── (tuỳ chọn) RDS MySQL thay MySQL trên EC2
```

- **EC2**: install Node + MySQL, clone repo, import `schema.sql`, chạy `npm start` (có thể dùng `pm2`). Mở inbound: `8000`, `22`, `80`.
- **Frontend**: `npm run build` rồi upload thư mục `build/` lên S3 → static website hosting (hoặc CloudFront trước S3).
- **RDS (tuỳ chọn)**: tạo RDS MySQL free tier, rồi set `DB_HOST=<rds-endpoint>` `DB_USER=admin` `DB_PASSWORD=...` khi chạy backend — không cần sửa code.
- Lưu ý Security Group: cho phép EC2 kết nối RDS trên port `3306`, và S3 client gọi API qua EC2 IP (và đừng quên sửa `Frontend/src/config.js` trước khi build!).

### screenshots (từ repo gốc, UI giữ nguyên)
1![image](https://github.com/arjuncvinod/Lost-And-Found/assets/68469520/7b68e817-1a62-4dfb-835f-6008379f752d)
2![image](https://github.com/arjuncvinod/Lost-And-Found/assets/68469520/1b137131-d0bc-4fc8-a737-6c2c797e45dc)
3![image](https://github.com/arjuncvinod/Lost-And-Found/assets/68469520/a19cdaa6-7003-4116-8429-d663c5a4dc10)
4![image](https://github.com/arjuncvinod/Lost-And-Found/assets/68469520/6f7b09e9-a997-4b20-984d-014c14468557)
5![image](https://github.com/arjuncvinod/Lost-And-Found/assets/68469520/337b8c7c-c689-480f-b45a-8de7fc77e7c7)
