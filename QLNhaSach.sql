-- Tạo cơ sở dữ liệu
CREATE DATABASE QLNhasach;
USE QLNhasach;

-- Tạo bảng Sach
CREATE TABLE Sach (
    ID_sach INT AUTO_INCREMENT PRIMARY KEY, 
    Ten_sach NVARCHAR(45),
    Ten_tac_gia NVARCHAR(45),
    The_loai NVARCHAR(20),
    Nam_xuat_ban INT,
    So_luong INT,
    Gia DECIMAL(10, 2)
);

-- Tạo bảng Phieu_nhap_sach
CREATE TABLE Phieu_nhap_sach (
    ID_Phieu INT AUTO_INCREMENT PRIMARY KEY,
    Ngay_nhap DATETIME,
    Tong_so_luong INT,
    ID_sach INT,
    FOREIGN KEY (ID_sach) REFERENCES Sach(ID_sach)
);

-- Tạo bảng Chi_tiet_phieu_nhap_sach
CREATE TABLE Chi_tiet_phieu_nhap_sach (
    ID_Chi_tiet INT AUTO_INCREMENT PRIMARY KEY,
    ID_Phieu INT,
    ID_Sach INT,
    So_luong INT,
    FOREIGN KEY (ID_Phieu) REFERENCES Phieu_nhap_sach(ID_Phieu),
    FOREIGN KEY (ID_Sach) REFERENCES Sach(ID_sach)
);

-- Tạo bảng Khach_hang
CREATE TABLE Khach_hang (
    ID_khach_hang INT AUTO_INCREMENT PRIMARY KEY,
    Ten_khach_hang NVARCHAR(50),
    So_dien_thoai CHAR(11),
    Gioi_tinh CHAR(1),
    Email VARCHAR(30),
    Dia_chi NVARCHAR(100)
);

-- Tạo bảng Phieu_thu_tien
CREATE TABLE Phieu_thu_tien (
    ID_Phieu INT AUTO_INCREMENT PRIMARY KEY,
    ID_Khach_hang INT,
    Ngay_thu_tien DATETIME,
    So_tien DECIMAL(10, 2),
    FOREIGN KEY (ID_Khach_hang) REFERENCES Khach_hang(ID_khach_hang)
);

-- Tạo bảng Hoa_don_ban_sach
CREATE TABLE Hoa_don_ban_sach (
    ID_Hoa_don INT AUTO_INCREMENT PRIMARY KEY,
    ID_khach_hang INT,
    Ngay_lap_hoa_don DATETIME,
    Tong_tien DECIMAL(10, 2),
    FOREIGN KEY (ID_khach_hang) REFERENCES Khach_hang(ID_khach_hang)
);

-- Tạo bảng Chi_tiet_hoa_don
CREATE TABLE Chi_tiet_hoa_don (
    ID_Chi_tiet_hoa_don INT AUTO_INCREMENT PRIMARY KEY,
    ID_Hoa_don INT,
    ID_Sach INT,
    So_luong INT,
    Don_gia DECIMAL(10, 2),
    FOREIGN KEY (ID_Hoa_don) REFERENCES Hoa_don_ban_sach(ID_Hoa_don),
    FOREIGN KEY (ID_Sach) REFERENCES Sach(ID_sach)
);

-- Tạo bảng Quy_dinh
CREATE TABLE Quy_dinh (
    So_luong_nhap_it_nhat INT,
    So_luong_ton_it_hon INT,
    Khach_hang_no_khong_qua DECIMAL(10, 2),
    So_luong_ton_sau_khi_ban_it_nhat INT,
    Su_Dung_QD4 BIT
);

-- Tạo bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active'
);

-- Thêm dữ liệu mẫu vào bảng Sach
INSERT INTO Sach (Ten_sach, The_loai, Ten_tac_gia, Nam_xuat_ban, So_luong, Gia) VALUES  
('Dế Mèn Phiêu Lưu Ký', 'Văn học thiếu nhi', 'Tô Hoài', 1941, 10, 15.99),  
('Mắt Biếc', 'Tiểu thuyết', 'Nguyễn Nhật Ánh', 1990, 20, 18.50),  
('Truyện Kiều', 'Thơ ca', 'Nguyễn Du', 1820, 12, 25.00),  
('Nhật Ký Đặng Thùy Trâm', 'Hồi ký', 'Đặng Thùy Trâm', 2005, 5, 19.99),  
('Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Tiểu thuyết', 'Nguyễn Nhật Ánh', 2008, 18, 22.00),  
('Cánh Đồng Bất Tận', 'Tiểu thuyết', 'Nguyễn Ngọc Tư', 2005, 15, 14.99),  
('Đất Rừng Phương Nam', 'Văn học thiếu nhi', 'Đoàn Giỏi', 1957, 25, 12.50),  
('Chinh Phụ Ngâm Khúc', 'Thơ ca', 'Đoàn Thị Điểm', 1740, 8, 20.00),  
('Quê Nội', 'Văn học thiếu nhi', 'Võ Quảng', 1974, 30, 10.99),  
('Lặng Lẽ Sa Pa', 'Hồi ký', 'Nguyễn Thành Long', 1970, 12, 13.50),  
('Đồi Gió Hú', 'Tiểu thuyết', 'Emily Brontë (Dịch giả: Lê Huy Lâm)', 1847, 6, 17.99),  
('Vang Bóng Một Thời', 'Thơ ca', 'Nguyễn Tuân', 1940, 10, 16.50),  
('Lịch Sử Việt Nam', 'Hồi ký', 'Nguyễn Văn A', 2020, 4, 14.99),  
('Quà Tặng Cuộc Sống', 'Văn học thiếu nhi', 'Nhiều Tác Giả', 2010, 20, 12.00);

-- Thêm dữ liệu mẫu vào các bảng còn lại
INSERT INTO Phieu_nhap_sach (Ngay_nhap, Tong_so_luong, ID_sach) VALUES  
('2024-01-15 10:30:00', 30, 1),  
('2024-02-20 14:00:00', 50, 2),  
('2024-03-10 16:00:00', 40, 3),  
('2024-03-15 09:00:00', 20, 4),  
('2024-04-05 11:45:00', 60, 5);

INSERT INTO Chi_tiet_phieu_nhap_sach (ID_Phieu, ID_Sach, So_luong) VALUES  
(1, 1, 10),  
(1, 2, 20),  
(2, 3, 30),  
(3, 4, 15),  
(3, 5, 25),  
(4, 6, 10),  
(5, 7, 40);

INSERT INTO Khach_hang (Ten_khach_hang, So_dien_thoai, Gioi_tinh, Email, Dia_chi) VALUES  
('Nguyễn Văn A', '0912345678', 'M', 'nguyenvana@gmail.com', 'Hà Nội'),  
('Trần Thị B', '0987654321', 'F', 'tranthib@yahoo.com', 'TP Hồ Chí Minh'),  
('Lê Văn C', '0932123456', 'M', 'levanc@outlook.com', 'Đà Nẵng'),  
('Phạm Thị D', '0909876543', 'F', 'phamthid@hotmail.com', 'Huế'),  
('Hoàng Văn E', '0911122334', 'M', 'hoangvane@gmail.com', 'Cần Thơ');

INSERT INTO Phieu_thu_tien (ID_Khach_hang, Ngay_thu_tien, So_tien) VALUES  
(1, '2024-01-20 10:00:00', 150.00),  
(2, '2024-02-15 15:00:00', 200.00),  
(3, '2024-03-05 14:30:00', 100.00),  
(4, '2024-03-25 12:00:00', 180.00),  
(5, '2024-04-10 10:45:00', 250.00);

INSERT INTO Hoa_don_ban_sach (ID_khach_hang, Ngay_lap_hoa_don, Tong_tien) VALUES  
(1, '2024-01-22 11:00:00', 120.00),  
(2, '2024-02-18 13:45:00', 190.00),  
(3, '2024-03-08 10:30:00', 85.00),  
(4, '2024-03-28 16:00:00', 150.00),  
(5, '2024-04-15 09:30:00', 210.00);

INSERT INTO Chi_tiet_hoa_don (ID_Hoa_don, ID_Sach, So_luong, Don_gia, Thanh_tien) VALUES  
(1, 1, 2, 15.99, 31.98),  
(1, 3, 3, 25.00, 75.00),  
(2, 2, 5, 18.50, 92.50),  
(3, 4, 1, 19.99, 19.99),  
(4, 5, 2, 22.00, 44.00),  
(5, 6, 3, 14.99, 44.97);

INSERT INTO Quy_dinh (So_luong_nhap_it_nhat, So_luong_ton_it_hon, Khach_hang_no_khong_qua, So_luong_ton_sau_khi_ban_it_nhat, Su_Dung_QD4) VALUES  
(150, 300, 20000, 20, 1);

INSERT INTO users (email, password, status) VALUES  
('admin@example.com', 'admin_password_hash', 'active'),  
('user1@example.com', 'user1_password_hash', 'active'),  
('user2@example.com', 'user2_password_hash', 'inactive'),  
('user3@example.com', 'user3_password_hash', 'banned');
