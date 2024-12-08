// Lấy thẻ input ngày
const dateInput = document.getElementById("date-receipt");

// Hàm để lấy ngày hiện tại theo định dạng YYYY-MM-DD
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Gán ngày hiện tại vào thẻ input khi trang được tải lên
dateInput.value = getCurrentDate();

// Cập nhật ngày khi người dùng nhấp vào thẻ input
dateInput.addEventListener("focus", function () {
  dateInput.value = getCurrentDate(); // Gán lại ngày hiện tại nếu có thay đổi
});

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
  const tableBody = document.getElementById("table-body");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
         <td><input type="text" placeholder="No."></td>
         <td><input type="text" placeholder="Book Name"></td>
         <td><input type="text" placeholder="Category"></td>
         <td><input type="number" placeholder="Quantity"></td>
         <td><input type="text" placeholder="Price"></td>
     `;
  tableBody.appendChild(newRow);
}

// Hàm xử lý khi nhấn nút Done
function submitBooks() {
  const rows = document.querySelectorAll("#table-body tr");
  const books = [];
  let hasEmptyField = false;

  rows.forEach((row) => {
    const cells = row.querySelectorAll("input");
    const bookData = {
      no: cells[0].value.trim(),
      name: cells[1].value.trim(),
      category: cells[2].value.trim(),
      quantity: cells[3].value.trim(),
      price: cells[4].value.trim(),
    };

    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      !bookData.no ||
      !bookData.name ||
      !bookData.category ||
      !bookData.quantity ||
      !bookData.price
    ) {
      hasEmptyField = true;
    }

    books.push(bookData);
  });

  if (hasEmptyField) {
    showToast("error");
    return;
  }

  console.log("Books data:", books);

  showToast("success");

  // Làm mới bảng sau khi nhấn Done
  document.getElementById("table-body").innerHTML = `
         <tr>
             <td><input type="text" name="no1" placeholder="No."></td>
             <td><input type="text" name="book1" placeholder="Book Name"></td>
             <td><input type="text" name="category1" placeholder="Category"></td>
             <td><input type="number" name="quantity1" placeholder="Quantity"></td>
             <td><input type="text" name="price1" placeholder="Price"></td>
         </tr>
     `;
}

// Hiển thị toast
function showToast(type) {
  // Lấy phần tử toast tương ứng
  const toast =
    type === "success"
      ? document.getElementById("toastSuccess")
      : document.getElementById("toastError");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
