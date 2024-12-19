import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import { error } from "console";

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Cấu hình body-parser để nhận dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Kết nối MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "QLNhasach",
});

connection.connect((err) => {
  if (err) {
    console.error("Kết nối MySQL thất bại:", err);
    process.exit(1);
  }
  console.log("Kết nối MySQL thành công!");
});

// Cấu hình thư mục tĩnh cho các tệp như CSS, JS
app.use(express.static(join(__dirname, "assets")));

// Gửi file HTML trang đăng nhập
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "signin.html"));
});

// Route đăng nhập
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra email trong cơ sở dữ liệu
  connection.query(
    "SELECT id, password, status FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).send("Lỗi hệ thống.");
      }

      // Kiểm tra nếu email không tồn tại
      if (results.length === 0) {
        return res.status(404).send("Email không tồn tại.");
      }

      const user = results[0];

      // Kiểm tra trạng thái tài khoản
      if (user.status !== "active") {
        return res
          .status(403)
          .send("Tài khoản của bạn đang bị khóa hoặc không hoạt động.");
      }

      // So sánh mật khẩu
      if (bcrypt.compareSync(password, user.password)) {
        return res.redirect("/home"); // Chuyển đến trang home.html
      } else {
        return res.status(401).send("Mật khẩu không chính xác.");
      }
    }
  );
});

// Route đăng ký
app.post("/signup", (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Kiểm tra mật khẩu xác nhận
  if (password !== confirmPassword) {
    return res.status(400).send("Mật khẩu và xác nhận mật khẩu không khớp.");
  }

  // Kiểm tra nếu email đã tồn tại
  connection.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).send("Lỗi hệ thống.");
      }

      if (results.length > 0) {
        return res.status(409).send("Email đã tồn tại.");
      }

      // Mã hóa mật khẩu
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Thêm người dùng mới vào cơ sở dữ liệu
      connection.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err) => {
          if (err) {
            console.error("Lỗi khi thêm người dùng:", err);
            return res.status(500).send("Lỗi hệ thống.");
          }

          res.redirect("/home"); // Chuyển đến trang home.html sau khi đăng ký thành công
        }
      );
    }
  );
});

app.get("/api/books", (req, res) => {
  const sql = "SELECT * FROM Sach";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.get("/profile", (req, res) => {
  const sql = "SELECT * FROM Khach_hang";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: error.message });
    } else {
      res.json(results);
    }
  });
});

// Gửi file HTML trang đăng ký
app.get("/signup", (req, res) => {
  res.sendFile(join(__dirname, "signup.html"));
});

// Route trang home
app.get("/home", (req, res) => {
  res.sendFile(join(__dirname, "home.html")); // Đảm bảo đường dẫn chính xác
});

app.get("/bookempty", (req, res) => {
  res.sendFile(join(__dirname, "bookempty.html"));
});

app.get("/bookinvoice", (req, res) => {
  res.sendFile(join(__dirname, "bookinvoice.html"));
});

app.get("/receipts", (req, res) => {
  res.sendFile(join(__dirname, "receipts.html"));
});

app.get("/report", (req, res) => {
  res.sendFile(join(__dirname, "report.html"));
});

app.get("/lookup", (req, res) => {
  res.sendFile(join(__dirname, "lookup.html"));
});

// API để xử lý yêu cầu từ phía client
app.get('/report', async (req, res) => {
  const { date } = req.query; // Lấy giá trị 'date' từ query string
  
  if (!date) {
    // Nếu không có ngày trong query string, trả lỗi
    return res.status(400).json({ error: 'Ngày không được cung cấp.' });
  }

  try {
    const [rows] = await connection.execute(`
      WITH Thong_ke_nhap AS (
        SELECT s.ID_Sach, COALESCE(SUM(ct.So_luong), 0) AS Tong_nhap
        FROM Sach s
        LEFT JOIN Chi_tiet_phieu_nhap_sach ct ON s.ID_Sach = ct.ID_Sach
        LEFT JOIN Phieu_nhap_sach pn ON ct.ID_Phieu = pn.ID_Phieu
        WHERE pn.Ngay_nhap >= ?
        GROUP BY s.ID_Sach
      ),
      Thong_ke_ban AS (
        SELECT s.ID_Sach, COALESCE(SUM(cthd.So_luong), 0) AS Tong_ban
        FROM Sach s
        LEFT JOIN Chi_tiet_hoa_don cthd ON s.ID_Sach = cthd.ID_Sach
        LEFT JOIN Hoa_don_ban_sach hd ON cthd.ID_Hoa_don = hd.ID_Hoa_don
        WHERE hd.Ngay_lap_hoa_don >= ?
        GROUP BY s.ID_Sach
      )
      SELECT s.ID_Sach, s.Ten_Sach, COALESCE(TN.Tong_nhap, 0) AS Tong_nhap, COALESCE(TB.Tong_ban, 0) AS Tong_ban
      FROM Sach s
      LEFT JOIN Thong_ke_nhap TN ON s.ID_Sach = TN.ID_Sach
      LEFT JOIN Thong_ke_ban TB ON s.ID_Sach = TB.ID_Sach;
    `, [date, date]);

    res.json(rows); // Trả về kết quả dưới dạng JSON
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra trong quá trình truy vấn dữ liệu.' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


