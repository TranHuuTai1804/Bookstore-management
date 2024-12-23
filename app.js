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

//Route lấy ra danh sách thông tin bảng sách
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

//Route lấy ra thông tin bảng khách hàng
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

//Route lấy ra thông tin bảng quy định
app.get("/regulation", (req, res) => {
  const sql = "SELECT * FROM Quy_dinh";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: error.message });
    } else {
      res.json(results);
    }
  });
});

//Tạo hàm query
function runQuery(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        return reject(err); // Trả về lỗi nếu có
      }
      resolve(results); // Trả về kết quả truy vấn
    });
  });
}

//Route thêm vào khách hàng mới
app.post("/addCustomer", (req, res) => {
  const { name, phone, address, email, gender } = req.body;

  // Truy vấn để lấy ID lớn nhất hiện tại trong bảng
  const getMaxIdQuery = "SELECT MAX(ID_khach_hang) AS max_id FROM Khach_hang";

  connection.query(getMaxIdQuery, (err, result) => {
    if (err) {
      console.error("Error fetching max ID:", err);
      return res.status(500).send("Server error");
    }

    // Lấy ID lớn nhất và tăng thêm 1
    const newID = result[0].max_id ? result[0].max_id + 1 : 1; // Nếu không có ID nào, gán ID = 1

    // Thêm khách hàng mới vào cơ sở dữ liệu
    const insertCustomerQuery = `
      INSERT INTO Khach_hang (ID_khach_hang, Ten_khach_hang, So_dien_thoai, Dia_chi, Email, Gioi_tinh)
      VALUES (?, ?, ?, ?, ?,?)
    `;

    connection.query(
      insertCustomerQuery,
      [newID, name, phone, address, email, gender],
      (err, results) => {
        if (err) {
          console.error("Error adding customer:", err);
          return res.status(500).send("Server error");
        }

        // Trả về danh sách khách hàng đã cập nhật
        connection.query(
          "SELECT * FROM Khach_hang",
          (err, updatedCustomers) => {
            if (err) {
              console.error("Error fetching updated customer data:", err);
              return res.status(500).send("Server error");
            }
            res.redirect("/customer"); // Trả về danh sách khách hàng mới
          }
        );
      }
    );
  });
});

//Route để nhập sách
app.post("/addBook", async (req, res) => {
  try {
    // Lấy giá trị Su_Dung_QD4 và So_luong_ton_it_hon từ bảng Quy_dinh
    const [regulation] = await runQuery(
      "SELECT Su_Dung_QD4, So_luong_ton_it_hon FROM Quy_dinh"
    );

    // Kiểm tra nếu không có giá trị từ bảng Quy_dinh, trả về lỗi
    if (!regulation) {
      return res.redirect(
        "/bookempty?message=" +
          encodeURIComponent(
            "Không tìm thấy quy định về số lượng tồn tối thiểu."
          )
      );
    }

    console.log("Dữ liệu quy định:", regulation);

    // Kiểm tra Su_Dung_QD4 và chuyển giá trị sang số
    const suDungQD4Buffer = regulation.Su_Dung_QD4; // Lấy giá trị Buffer

    // Đảm bảo rằng Su_Dung_QD4 là một Buffer hợp lệ
    if (!Buffer.isBuffer(suDungQD4Buffer)) {
      return res.redirect(
        "/bookempty?message=" +
          encodeURIComponent(
            "Error: Su_Dung_QD4 không phải là một Buffer hợp lệ."
          )
      );
    }

    // Lấy giá trị từ Buffer (chỉ đọc byte đầu tiên)
    const suDungQD4Value = suDungQD4Buffer.readUInt8(0); // Đọc byte đầu tiên

    console.log("suDungQD4Value:", suDungQD4Value);

    // Kiểm tra nếu suDungQD4Value không phải là số hợp lệ
    if (isNaN(suDungQD4Value)) {
      return res.redirect(
        "/bookempty?message=" +
          encodeURIComponent("Error: Không thể đọc giá trị Su_Dung_QD4.")
      );
    }

    // Chuyển giá trị Su_Dung_QD4 sang số
    const suDungQD4Number = Number(suDungQD4Value);
    console.log("suDungQD4Number:", suDungQD4Number);

    // Kiểm tra nếu Su_Dung_QD4 = 0, không áp dụng quy định So_luong_ton_it_hon
    const minStockLimit =
      suDungQD4Number !== 0 ? regulation.So_luong_ton_it_hon : null; // Nếu Su_Dung_QD4 = 0, không áp dụng quy định So_luong_ton_it_hon
    console.log("minStockLimit:", minStockLimit);

    const books = req.body.id.map((id, index) => ({
      id,
      name: req.body.name[index],
      category: req.body.category[index],
      author: req.body.author[index],
      quantity: parseInt(req.body.quantity[index], 10), // Chuyển thành số nguyên
      price: parseFloat(req.body.price[index]),
    }));

    // Kiểm tra số lượng tồn của sách trước khi thêm vào nếu Su_Dung_QD4 khác 0
    for (const book of books) {
      const rows = await runQuery(
        `SELECT ID_sach, So_luong FROM Sach
         WHERE Ten_sach = ? AND The_loai = ? AND Ten_tac_gia = ?`,
        [book.name, book.category, book.author]
      );

      if (rows.length > 0) {
        const currentQuantity = parseInt(rows[0].So_luong, 10);
        const newQuantity = currentQuantity + book.quantity;

        // Kiểm tra nếu quy định áp dụng và số lượng tồn sau khi cộng thêm sách mới vượt quá quy định
        if (minStockLimit !== null && newQuantity > minStockLimit) {
          return res.redirect(
            `/bookempty?message=${encodeURIComponent(
              `Số lượng tồn của sách "${book.name}" vượt quá số lượng tối đa cho phép (${minStockLimit}). Vui lòng điều chỉnh số lượng nhập.`
            )}`
          );
        }

        // Cập nhật số lượng sách nếu không vi phạm quy định
        await runQuery(`UPDATE Sach SET So_luong = ? WHERE ID_sach = ?`, [
          newQuantity,
          rows[0].ID_sach,
        ]);
      } else {
        // Kiểm tra sách mới nếu số lượng vượt quá quy định
        if (minStockLimit !== null && book.quantity > minStockLimit) {
          return res.redirect(
            `/bookempty?message=${encodeURIComponent(
              `Số lượng tồn của sách mới "${book.name}" vượt quá số lượng tối đa cho phép (${minStockLimit}).`
            )}`
          );
        }

        // Thêm sách mới vào kho nếu không vi phạm quy định
        await runQuery(
          `INSERT INTO Sach (ID_sach, Ten_sach, The_loai, Ten_tac_gia, So_luong, Gia)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            book.id,
            book.name,
            book.category,
            book.author,
            book.quantity,
            book.price,
          ]
        );
      }
    }

    // Sau khi thêm sách thành công
    res.redirect(
      "/bookempty?message=" + encodeURIComponent("Book added successfully!")
    );
  } catch (error) {
    console.error(error);
    res.redirect(
      "/bookempty?message=" + encodeURIComponent("Error processing books")
    );
  }
});

//Route để cập nhật bảng Quy_định
app.post("/editRegulation", (req, res) => {
  const {
    min_input,
    low_inventory,
    low_customer_debt,
    stock_after_sale,
    rule,
  } = req.body;

  // Chuyển đổi `rule` sang số 0 hoặc 1
  const ruleBit = parseInt(rule) === 1 ? 1 : 0;

  // Câu lệnh SQL
  const updateQuery = `
  UPDATE Quy_dinh SET
    So_luong_nhap_it_nhat = ?,
    So_luong_ton_it_hon = ?,
    Khach_hang_no_khong_qua = ?,
    So_luong_ton_sau_khi_ban_it_nhat = ?,
    Su_Dung_QD4 = ?;
`;

  connection.query(
    updateQuery,
    [min_input, low_inventory, low_customer_debt, stock_after_sale, ruleBit],
    (err, result) => {
      if (err) {
        console.error("Chi tiết lỗi khi cập nhật quy định:", err);
        return res.status(500).json({
          message: "Đã xảy ra lỗi khi cập nhật quy định!",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Quy định không tồn tại!" });
      }

      res.redirect("/edit");
    }
  );
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

app.get("/edit", (req, res) => {
  res.sendFile(join(__dirname, "edit.html"));
});

app.get("/customer", (req, res) => {
  res.sendFile(join(__dirname, "customer.html"));
});

app.get("/staff", (req, res) => {
  res.sendFile(join(__dirname, "staff.html"));
});

// Khởi động server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
