let customers = [];

// Hàm fetch danh sách khách hàng
async function fetchCustomers() {
  try {
    const response = await fetch("/profile");
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }
    const data = await response.json();
    customers = data.map((customer) => ({
      name: customer.Ten_khach_hang,
      phone: customer.So_dien_thoai,
      address: customer.Dia_chi,
      email: customer.Email,
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
}

// Gọi fetch khi trang tải
document.addEventListener("DOMContentLoaded", fetchCustomers);

// Hiển thị gợi ý khách hàng
function showCustomerSuggestions(inputElement) {
  const suggestionsBox = document.querySelector(".customerSuggestions");
  const searchTerm = inputElement.value.trim().toLowerCase();

  if (!searchTerm) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Lọc khách hàng phù hợp
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm)
  );

  if (filteredCustomers.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Hiển thị gợi ý
  suggestionsBox.innerHTML = filteredCustomers
    .map(
      (customer) =>
        `<div onclick="selectCustomer('${customer.name}')">${customer.name}</div>`
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// Khi chọn một gợi ý hoặc nhập đúng tên khách hàng
function selectCustomer(customerName) {
  const customer = customers.find((c) => c.name === customerName);

  if (customer) {
    // Tự động điền thông tin khách hàng
    document.getElementById("customer").value = customer.name;
    document.getElementById("phone").value = customer.phone || "";
    document.getElementById("address").value = customer.address || "";
    document.getElementById("email").value = customer.email || "";
  }

  // Ẩn gợi ý
  document.querySelector(".customerSuggestions").style.display = "none";
}

// Ẩn gợi ý khi click bên ngoài
document.addEventListener("click", function (e) {
  if (!e.target.closest(".form-group")) {
    document.querySelector(".customerSuggestions").style.display = "none";
  }
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

function submitReceipts() {
  const form = document.getElementById("receipt-form");
  const formData = new FormData(form);

  const receiptData = {};
  let hasEmptyField = false; // Kiểm tra nếu có trường bị bỏ trống

  // Duyệt qua các trường trong form
  formData.forEach((value, key) => {
    receiptData[key] = value.trim(); // Loại bỏ khoảng trắng
    if (!value.trim()) {
      hasEmptyField = true;
    }
  });

  if (hasEmptyField) {
    showToast("error");
    return;
  }

  console.log("Form data:", receiptData);

  form.reset();

  showToast("success");
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
