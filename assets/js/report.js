
function showTable(type) {
  const InventoryBtn = document.getElementById("Inventory-btn");
  const debtBtn = document.getElementById("debt-btn");
  const InventoryTable = document.getElementById("Inventory-table");
  const debtTable = document.getElementById("debt-table");

  if (type === "Inventory") {
    // Đổi trạng thái nút
    InventoryBtn.classList.add("active");
    debtBtn.classList.remove("active");

    // Hiển thị bảng Inventory
    InventoryTable.style.display = "block";
    debtTable.style.display = "none";
  } else if (type === "debt") {
    // Đổi trạng thái nút
    debtBtn.classList.add("active");
    InventoryBtn.classList.remove("active");

    // Hiển thị bảng Debt
    debtTable.style.display = "block";
    InventoryTable.style.display = "none";
  }
}

// Lấy thẻ input ngày
const dateInput = document.getElementById("date-report");

// Hàm để lấy ngày hiện tại theo định dạng YYYY-MM-DD
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  return `${month}/${year}`;
}

// Gán ngày hiện tại vào thẻ input khi trang được tải lên
dateInput.value = getCurrentDate();


function toggleMenu() {
  const menu = document.getElementById("hero-menu");
  const overlay = document.getElementById("overlay");
  const icon = document.querySelector(".open-menu");
  const body = document.body;

  // Kiểm tra nếu menu đang ẩn
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block"; // Mở menu
    setTimeout(() => {
      menu.style.left = "0"; // Đặt menu vào vị trí mong muốn với hiệu ứng trượt
    }, 10); // Đảm bảo hiệu ứng trượt được áp dụng
    overlay.style.display = "block"; // Hiện overlay
    icon.textContent = "<"; // Đổi icon thành '<'

    // Thêm lớp menu-open để di chuyển icon
    body.classList.add("menu-open");
  } else {
    menu.style.left = "-30%"; // Ẩn menu với hiệu ứng trượt
    overlay.style.display = "none"; // Ẩn overlay
    icon.textContent = ">"; // Đổi icon thành '>'

    // Loại bỏ lớp menu-open để di chuyển icon về vị trí ban đầu
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none"; // Ẩn menu sau khi trượt hoàn tất
    }, 300); // Thời gian trượt hoàn tất trước khi ẩn menu
  }
}

// Ẩn thanh cuộn khi người dùng lướt lên hoặc xuống
const menuOv = document.getElementById("hero-menu");

menuOv.addEventListener("scroll", function () {
  menuOv.style.scrollbarWidth = "none"; // Ẩn thanh cuộn khi lướt
  clearTimeout(menuOv.scrollTimeout);

  menuOv.scrollTimeout = setTimeout(function () {
    menuOv.style.scrollbarWidth = "thin"; // Hiển thị lại thanh cuộn khi ngừng lướt
  }, 100); // Ẩn thanh cuộn khi lướt và hiển thị lại sau khi ngừng
});

// Hàm thêm dòng mới vào bảng
function addRow() {
  // Kiểm tra bảng đang hiển thị
  const InventoryTable = document.getElementById("Inventory-table");
  const debtTable = document.getElementById("debt-table");

  if (InventoryTable.style.display === "block") {
    // Thêm dòng mới vào bảng Inventory
    const tableBody = document.getElementById("table-body");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
                    <td><input type="text" placeholder="No."></td>
                    <td><input type="text" placeholder="Book Name"></td>
                    <td><input type="text" placeholder="First Existence"></td>
                    <td><input type="text" placeholder="Arise"></td>
                    <td><input type="text" placeholder="Last Existence"></td>
                `;
    tableBody.appendChild(newRow);
  } else if (debtTable.style.display === "block") {
    // Thêm dòng mới vào bảng debt
    const tableBodyDebt = document.getElementById("table-body-debt");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
                    <td><input type="text" placeholder="No."></td>
                    <td><input type="text" placeholder="Guest Name"></td>
                    <td><input type="text" placeholder="First Debt"></td>
                    <td><input type="text" placeholder="Arise"></td>
                    <td><input type="text" placeholder="Last Debt"></td>
                `;
    tableBodyDebt.appendChild(newRow);
  }
}
// Hàm xử lý khi nhấn nút Done
function submitBooks() {
  // Kiểm tra bảng đang hiển thị
  const InventoryTable = document.getElementById("Inventory-table");
  const debtTable = document.getElementById("debt-table");

  if (InventoryTable.style.display === "block") {
    // Xử lý dữ liệu cho bảng Inventory
    const rows = document.querySelectorAll("#table-body tr");
    const books = [];
    let hasEmptyField = false;

    rows.forEach((row) => {
      const cells = row.querySelectorAll("input");
      const bookData = {
        no: cells[0].value.trim(),
        bookName: cells[1].value.trim(),
        firstExistence: cells[2].value.trim(),
        arise: cells[3].value.trim(),
        lastExistence: cells[4].value.trim(),
      };

      if (
        !bookData.no ||
        !bookData.bookName ||
        !bookData.firstExistence ||
        !bookData.arise ||
        !bookData.lastExistence
      ) {
        hasEmptyField = true;
      }
      books.push(bookData);
    });

    if (hasEmptyField) {
      showToast("error");
      return;
    }

    console.log("Inventory Report:", books);

    showToast("success");
  } else if (debtTable.style.display === "block") {
    // Xử lý dữ liệu cho bảng debt
    const rows = document.querySelectorAll("#table-body-debt tr");
    const debts = [];
    let hasEmptyField = false;

    rows.forEach((row) => {
      const cells = row.querySelectorAll("input");
      const debtData = {
        no: cells[0].value.trim(),
        guestName: cells[1].value.trim(),
        firstDebt: cells[2].value.trim(),
        arise: cells[3].value.trim(),
        lastDebt: cells[4].value.trim(),
      };

      if (
        !debtData.no ||
        !debtData.guestName ||
        !debtData.firstDebt ||
        !debtData.arise ||
        !debtData.lastDebt
      ) {
        hasEmptyField = true;
      }
      debts.push(debtData);
    });

    if (hasEmptyField) {
      showToast("error");
      return;
    }

    console.log("Debt Report:", debts);

    showToast("success");
  }

  // Làm mới bảng sau khi nhấn Done (áp dụng cho cả hai bảng)
  if (InventoryTable.style.display === "block") {
    document.getElementById("table-body").innerHTML = `
                    <tr>
                        <td><input type="text" placeholder="No."></td>
                        <td><input type="text" placeholder="Book Name"></td>
                        <td><input type="text" placeholder="First Existence"></td>
                        <td><input type="text" placeholder="Arise"></td>
                        <td><input type="text" placeholder="Last Existence"></td>
                    </tr>
                `;
  } else if (debtTable.style.display === "block") {
    document.getElementById("table-body-debt").innerHTML = `
                    <tr>
                        <td><input type="text" placeholder="No."></td>
                        <td><input type="text" placeholder="Guest Name"></td>
                        <td><input type="text" placeholder="First Debt"></td>
                        <td><input type="text" placeholder="Arise"></td>
                        <td><input type="text" placeholder="Last Debt"></td>
                    </tr>
                `;
  }
}

// Lắng nghe sự kiện click trên thẻ <a> với id "get-date"
document.getElementById("get-date").addEventListener("click", async (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>

  // Lấy giá trị từ input date-report
  const dateInput = document.getElementById("date-report").value.trim();
  const regex = /^(0[1-9]|1[0-2])\/\d{4}$/; // Kiểm tra định dạng MM/YYYY

  if (regex.test(dateInput)) {
    const [month, year] = dateInput.split('/');
    const startDate = `${year}-${month}-01`; // Chuyển đổi thành định dạng YYYY-MM-01

    try {
      // Gửi yêu cầu GET đến API server với tham số date
      const response = await fetch(`/report?date=${startDate}`);

      if (!response.ok) {
        console.error('Lỗi từ server:', response.statusText);
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON từ phản hồi server
      populateTable(data); // Gọi hàm populateTable để hiển thị dữ liệu

      showToast("success"); // Hiển thị toast thành công
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error.message);
      showToast("error"); // Hiển thị toast lỗi
    }
  } else {
    showToast("error"); // Hiển thị toast lỗi nếu định dạng không hợp lệ
  }
});

// Hàm hiển thị dữ liệu lên bảng
function populateTable(data) {
  const tableBody = document.getElementById("table-body");

  // Xóa nội dung bảng trước khi thêm dữ liệu mới
  tableBody.innerHTML = "";

  data.forEach((row, index) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="text" value="${index + 1}" placeholder="No." readonly></td>
      <td><input type="text" value="${row.Ten_Sach}" placeholder="Book Name"></td>
      <td><input type="text" value="${row.Tong_nhap}" placeholder="First Debt"></td>
      <td><input type="text" value="0" placeholder="Arise"></td>
      <td><input type="text" value="${row.Tong_nhap - row.Tong_ban}" placeholder="Last Debt" readonly></td>
    `;
    tableBody.appendChild(newRow);
  });
}

// Hàm hiển thị thông báo toast
function showToast(type) {
  const toast = type === "success"
    ? document.getElementById("toastSuccess")
    : document.getElementById("toastError");
    
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000); // Ẩn sau 3 giây
}
