// ===== Backend API (Node/Express) base URL =====
// Lúc develop local (backend chạy ở localhost:8000):
export const api = "http://localhost:8000";

// Dùng trên AWS thì đổi lại thành IP/EC2 của tụi mình, ví dụ:
// export const api = "http://54.251.xxx.xxx:8000";
// (nhớ mở port 8000 trong Security Group của EC2)
