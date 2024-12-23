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
  port: 3307,
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
  console.log("user: ", req.body);

  // Kiểm tra email trong cơ sở dữ liệu
  connection.query(
    "SELECT id, password, status FROM users WHERE email LIKE ?",
    [`%${email}%`],
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
    [`%${email}%`],
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
app.get('/getBooksByMonth', (req, res) => {
  const { year, month } = req.query;

  // Truy vấn cơ sở dữ liệu để lấy tổng số lượng sách theo tháng
  const query = `
      SELECT Sach.Ten_sach, Sach.The_loai, Sach.Ten_tac_gia, SUM(Chi_tiet_phieu_nhap_sach.So_luong) AS total_quantity
      FROM Phieu_nhap_sach
      JOIN Chi_tiet_phieu_nhap_sach ON Phieu_nhap_sach.ID_Phieu = Chi_tiet_phieu_nhap_sach.ID_Phieu
      JOIN Sach ON Sach.ID_sach = Chi_tiet_phieu_nhap_sach.ID_Sach
      WHERE YEAR(Phieu_nhap_sach.Ngay_nhap) = ? AND MONTH(Phieu_nhap_sach.Ngay_nhap) = ?
      GROUP BY Sach.Ten_sach, Sach.The_loai, Sach.Ten_tac_gia
  `;

  connection.query(query, [year, month], (err, results) => {
      if (err) {
          console.error('Error querying data:', err);
          return res.status(500).send('Error querying database');
      }

      res.json(results);  // Trả dữ liệu dưới dạng JSON
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
app.post("/addBook", async (req, res) => {
  try {
    // Loop through all books submitted
    const books = req.body.name.map((name, index) => ({
      name: name,
      category: req.body.category[index],
      author: req.body.author[index],
      quantity: req.body.quantity[index],
      price: req.body.price[index],
    }));
    console.log("Nhận từ client: ", books);

    // Loop through each book and process
    for (const book of books) {
      // Kiểm tra số lượn g nhập ít nhất là 150
      if (parseInt(book.quantity, 10) < 150) {
        // Chuyển hướng với thông báo lỗi khi số lượng nhập ít hơn 150
        return res.redirect("/bookempty?message=Số+luong+nhap+it+nhat+la+150.");
      }
     
       // Kiểm tra số lượng tồn trong bảng Sach nhỏ hơn 300
      const rows = await runQuery(`SELECT * FROM Sach WHERE Ten_sach LIKE ?`, [
        `%${book.name}%`,
      ]);

      const existingBook = rows[0];

      if (existingBook.So_luong >= 300) {
        return res.redirect("/bookempty?message=Không+thể+thêm+sách+có+lượng+tồn+lớn+hơn+300.");
      }

      let id_sach;

      // Nếu sách đã tồn tại, cập nhật số lượng và giá
      if (rows.length > 0) {
        const existingBook = rows[0];
        const currentQuantity = existingBook.So_luong;
        const currentPrice = existingBook.Gia;

        // Tính toán số lượng mới (cộng dồn số lượng cũ và mới)
        const newQuantity =
          parseInt(currentQuantity, 10) + parseInt(book.quantity, 10);

        // Sử dụng giá mới nếu giá khác, nếu không giữ giá cũ
        const newPrice =
          currentPrice !== book.price ? book.price : currentPrice;

        // Cập nhật số lượng và giá trong bảng Sach
        await runQuery(
          `UPDATE Sach 
           SET So_luong = ?, Gia = ? 
           WHERE ID_sach = ?`,
          [newQuantity, newPrice, existingBook.ID_sach]
        );
        id_sach = existingBook.ID_sach; // Lấy ID_sach của sách đã tồn tại

        // Thêm vào bảng Phieu_nhap_sach với ID_sach
        const insertPhieuResult = await runQuery(
          `INSERT INTO phieu_nhap_sach (Ngay_nhap, Tong_so_luong, ID_sach) VALUES (NOW(), ?, ?)`,
          [book.quantity, id_sach]
        );
        console.log(
          `Sách với ID ${id_sach} đã được thêm vào phieunhapsach với số lượng ${book.quantity}`
        );

        // Lấy ID_Phieu vừa tạo
        const id_phieu = insertPhieuResult.insertId;

        // Thêm vào bảng Chi_tiet_phieu_nhap_sach với ID_Phieu và ID_Sach
        const insertChiTietResult = await runQuery(
          `INSERT INTO Chi_tiet_phieu_nhap_sach (ID_Phieu, ID_Sach, So_luong)
           VALUES (?, ?, ?)`,
          [id_phieu, id_sach, book.quantity]
        );

        console.log(
          `Sách với ID ${id_sach} đã được thêm vào Chi_tiet_phieu_nhap_sach với số lượng ${book.quantity}`
        );
      } else {
        // Nếu sách chưa tồn tại, thêm mới vào bảng Sach
        const maxIdResult = await runQuery(
          `SELECT MAX(ID_sach) AS max_id FROM Sach`
        );

        const newId = maxIdResult[0].max_id ? maxIdResult[0].max_id + 1 : 1;

        // Thêm sách mới vào bảng Sach với ID_sach là max_id + 1
        const result = await runQuery(
          `INSERT INTO Sach (ID_sach, Ten_sach, The_loai, Ten_tac_gia, So_luong, Gia)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            newId,
            book.name,
            book.category,
            book.author,
            book.quantity,
            book.price,
          ]
        );

        console.log("Trường hợp sách mới: ", result);

        // Lấy ID_sach của sách vừa thêm mới
        id_sach = newId;

        // Thêm vào bảng Phieu_nhap_sach với ID_sach vừa lấy được
        const maxPhieuResult = await runQuery(
          `SELECT MAX(ID_Phieu) AS max_phieu_id FROM phieu_nhap_sach`
        );

        // Tạo ID_Phieu mới
        const newPhieuId = maxPhieuResult[0].max_phieu_id
          ? maxPhieuResult[0].max_phieu_id + 1
          : 1;

        // Thêm vào bảng Phieu_nhap_sach với ID_sach và ID_Phieu mới
        const insertPhieuResult = await runQuery(
          `INSERT INTO phieu_nhap_sach (ID_Phieu, Ngay_nhap, Tong_so_luong, ID_sach) VALUES (?, NOW(), ?, ?)`,
          [newPhieuId, book.quantity, id_sach]
        );

        // Lấy ID_Phieu vừa tạo (insertId của Phieu_nhap_sach)
        const id_phieu = insertPhieuResult.insertId;

        // Thêm vào bảng Chi_tiet_phieu_nhap_sach với ID_Phieu và ID_Sach
        const insertChiTietResult = await runQuery(
          `INSERT INTO Chi_tiet_phieu_nhap_sach (ID_Phieu, ID_Sach, So_luong)
           VALUES (?, ?, ?)`,
          [id_phieu, id_sach, book.quantity]
        );

        console.log(
          `Sách với ID ${id_sach} đã được thêm vào Chi_tiet_phieu_nhap_sach với số lượng ${book.quantity}`
        );
      }
    }

    // Redirect to /bookempty with a success message
    res.redirect("/bookempty?message=Book+added+successfully");
  } catch (error) {
    console.error(error);
    // Redirect to /bookempty with an error message
    res.redirect("/bookempty?message=Error+processing+books");
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
