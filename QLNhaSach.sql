-- Tạo cơ sở dữ liệu
CREATE DATABASE QLNhasach;
USE QLNhasach;

-- Tạo bảng Sach
CREATE TABLE Sach (
    ID_sach INT AUTO_INCREMENT PRIMARY KEY, -- ID tự động tăng từ 1
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
    Thanh_tien DECIMAL(10, 2),
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
    id INT AUTO_INCREMENT PRIMARY KEY, -- Mã người dùng (khóa chính)
    email VARCHAR(100) NOT NULL UNIQUE, -- Email (phải là duy nhất)
    password VARCHAR(255) NOT NULL,    -- Mật khẩu (được mã hóa)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Ngày cập nhật
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active' -- Trạng thái tài khoản
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
