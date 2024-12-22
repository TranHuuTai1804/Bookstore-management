let customers = [];
let booksList = [];

// Fetch dữ liệu từ API
async function fetchData() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Cập nhật mảng booksList với tên sách, thể loại và tác giả
    booksList = books.map((book) => ({
      ID_sach: book.ID_sach,
      Ten_sach: book.Ten_sach, // Tên sách
      The_loai: book.The_loai, // Thể loại sách
      Ten_tac_gia: book.Ten_tac_gia, // Tên tác giả
      So_luong: book.So_luong,
      Gia: book.Gia,
    }));

    // Đảm bảo rằng kết quả được hiển thị sau khi dữ liệu đã được lấy
    // console.log("Danh sách sách hiện tại:", booksList);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchData(); // Đảm bảo dữ liệu đã được tải về
});

// Hiển thị gợi ý
function showSuggestions(inputElement) {
  const suggestionsBox = inputElement.nextElementSibling; // Lấy thẻ div chứa gợi ý
  const searchTerm = inputElement.value.trim().toLowerCase();

  // Nếu không có gì để tìm, ẩn gợi ý
  if (!searchTerm) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Lọc danh sách sách dựa trên từ khóa người dùng nhập (so sánh tên sách)
  const filteredBooks = booksList.filter(
    (book) => book.Ten_sach.toLowerCase().includes(searchTerm) // Tìm theo tên sách
  );

  // Nếu không tìm thấy gợi ý nào, ẩn gợi ý
  if (filteredBooks.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Hiển thị các gợi ý
  suggestionsBox.innerHTML = filteredBooks
    .map(
      (book) =>
        `<div onclick="selectSuggestion('${book.Ten_sach}', '${inputElement.id}')">${book.Ten_sach}</div>` // Hiển thị tên sách
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// Hàm khi người dùng chọn một gợi ý
function selectSuggestion(bookName, inputId) {
  const inputElement = document.getElementById(inputId);
  inputElement.value = bookName; // Gán giá trị gợi ý vào ô input
  inputElement.nextElementSibling.style.display = "none"; // Ẩn gợi ý

  // Tìm sách trong danh sách để lấy thông tin Thể loại và Tác giả
  const selectedBook = booksList.find((b) => b.Ten_sach === bookName);

  if (selectedBook) {
    const row = inputElement.closest("tr"); // Lấy dòng chứa ô input

    // Cập nhật các ô nhập liệu khác trong cùng một dòng
    row.querySelector("input[name='id']").value = selectedBook.ID_sach;
    row.querySelector("input[name='category']").value = selectedBook.The_loai;
    row.querySelector("input[name='author']").value = selectedBook.Ten_tac_gia;
  }
}

// Tính toán giá dựa trên số lượng
function calculatePrice(inputElement) {
  const quantity = parseInt(inputElement.value);
  const row = inputElement.closest("tr");
  const priceInput = row.querySelector("input[name='price']");
  const bookName = row.querySelector("input[name='book']").value;

  const selectedBook = booksList.find((book) => book.Ten_sach === bookName);
  priceInput.value =
    selectedBook && quantity > 0 ? selectedBook.Gia * quantity : "";
}

// Gọi API khi tải trang
document.addEventListener("DOMContentLoaded", async () => {
  await fetchData("/profile", customers, (c) => ({
    Ten_khach_hang: c.Ten_khach_hang,
  }));
  await fetchData("/api/books", booksList, (b) => ({
    Ten_sach: b.Ten_sach,
    The_loai: b.The_loai,
    Gia: b.Gia,
  }));
});

// Sự kiện input để hiển thị gợi ý
document.addEventListener("input", (e) => {
  if (e.target.matches(".book-name")) {
    showSuggestions(e.target);
  }
});

// Sự kiện để ẩn gợi ý khi click bên ngoài
document.addEventListener("click", (e) => {
  if (!e.target.matches(".autocomplete-suggestions div, input")) {
    document.querySelectorAll(".autocomplete-suggestions").forEach((box) => {
      box.style.display = "none";
    });
  }
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

// Hàm thêm dòng mới vào bảng
function addRow() {
  const tableBody = document.getElementById("table-body");
  const rowIndex = tableBody.children.length;

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td class="nameBook">
        <input name="book[]" type="text" id="book-name" placeholder="Book name" class="book-name" data-row-index="${rowIndex}" oninput="showSuggestions(this)" required>
        <div class="autocomplete-suggestions" style="display: none;"></div>
    </td>
    <td><input type="text" name="category[]" placeholder="Category" id="categoryInput" data-row-index="${rowIndex}" required></td>
    <td><input type="number" name="quantity[]" placeholder="Quantity" id="quantityInput" oninput="calculatePrice(this)" data-row-index="${rowIndex}" required></td>
    <td><input type="text" name="price[]" placeholder="Price" id="priceInput" data-row-index="${rowIndex}" required></td>
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
          <td class="nameBook">
              <input name="book" type="text" id="book-name" placeholder="Book name" class="book-name" oninput="showSuggestions(this)">
              <div class="autocomplete-suggestions" style="display: none;"></div>
          </td>
          <td><input type="text" name="category" placeholder="Category" id="categoryInput"></td>
          <td><input type="number" name="quantity" placeholder="Quantity" oninput="calculatePrice(this)"></td>
          <td><input type="text" name="price" placeholder="Price" id="priceInput"></td>
         </tr>
     `;
}

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
    }, 10);
    overlay.style.display = "block";
    icon.textContent = "<";

    // Thêm lớp menu-open để di chuyển icon
    body.classList.add("menu-open");
  } else {
    menu.style.left = "-30%";
    overlay.style.display = "none";
    icon.textContent = ">";

    // Loại bỏ lớp menu-open để di chuyển icon về vị trí ban đầu
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none"; // Ẩn menu sau khi trượt hoàn tất
    }, 300); // Thời gian trượt hoàn tất trước khi ẩn menu
  }
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
