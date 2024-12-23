// Hàm lấy giá trị So_luong_ton_it_nhat từ server
async function fetchSoLuongTonItHon() {
  try {
    const response = await fetch("/regulation");
    if (!response.ok) {
      throw new Error("Failed to fetch regulation");
    }
    const regulations = await response.json();
    const soLuongTonItHon = regulations?.[0]?.So_luong_ton_it_hon;

    // console.log(soLuongTonItHon);

    if (soLuongTonItHon !== undefined) {
      return soLuongTonItHon;
    } else {
      console.error("Không tìm thấy giá trị So_luong_ton_it_hon");
      return 0; // Hoặc một giá trị mặc định nếu không có
    }
  } catch (error) {
    console.error("Error fetching So_luong_ton_it_nhat:", error);
    return 0; // Giá trị mặc định nếu có lỗi
  }
}

let minInput = [];
let isMinEnabled = false;

// Tải quy định từ server
async function fetchRegulation() {
  try {
    const response = await fetch("/regulation");
    if (!response.ok) throw new Error("Failed to fetch regulations");

    const regulations = await response.json();

    // Xác định trạng thái quy định và cập nhật giá trị
    processRegulations(regulations);

    // Cập nhật input sau khi xử lý xong quy định
    updateInputMinValues();
  } catch (error) {
    console.error("Error fetching regulations:", error);
  }
}

// Xử lý dữ liệu quy định
function processRegulations(regulations) {
  // Kiểm tra xem có quy định hợp lệ không
  if (!regulations || !Array.isArray(regulations) || regulations.length === 0) {
    console.warn("No regulations found"); // Cảnh báo khi không có dữ liệu quy định
    isMinEnabled = false; // Tắt quy định
    minInput = []; // Đặt lại mảng minInput
    return;
  }

  // Kiểm tra giá trị Su_Dung_QD4
  const suDungQD4 = regulations[0]?.Su_Dung_QD4?.data?.[0];

  // Kiểm tra nếu Su_Dung_QD4 = 0
  isMinEnabled = Number(suDungQD4) !== 0;

  if (isMinEnabled) {
    minInput = regulations.map((reg) => reg.So_luong_nhap_it_nhat);
    console.log("Quy định nhập tối thiểu được bật:", minInput);
  } else {
    console.log("Quy định nhập tối thiểu đang tắt.");
    minInput = []; // Làm rỗng mảng minInput khi tắt quy định
  }
}

// Cập nhật giá trị min cho các input
function updateInputMinValues() {
  const inputs = document.querySelectorAll("input[data-regulation]");
  inputs.forEach((input, index) => {
    if (isMinEnabled && minInput[index] !== undefined) {
      input.min = minInput[index];
    } else {
      input.removeAttribute("min");
    }
  });
}

// Gọi hàm tải quy định khi trang được tải
document.addEventListener("DOMContentLoaded", fetchRegulation);

// Toast
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");

if (message) {
  const isError =
    message.toLowerCase().includes("vượt quá") ||
    message.toLowerCase().includes("error");

  Toastify({
    text: decodeURIComponent(message),
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: isError
      ? "linear-gradient(to right, #ff5f6d, #ffc371)" // Màu dành cho lỗi
      : "linear-gradient(to right, #00b09b, #96c93d)", // Màu dành cho thành công
  }).showToast();
}

let booksList = [];

// Hàm lấy danh sách sách từ API và cập nhật mảng booksList
async function fetchBookTitles() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Cập nhật mảng booksList với tên sách, thể loại và tác giả
    booksList = books.map((book) => ({
      ID_sach: book.ID_sach,
      Ten_sach: book.Ten_sach,
      The_loai: book.The_loai,
      Ten_tac_gia: book.Ten_tac_gia,
      Gia: book.Gia,
    }));

    // console.log("Danh sách sách hiện tại:", booksList);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Gọi hàm fetchBookTitles và đảm bảo rằng dữ liệu được tải xong trước khi cho phép tìm kiếm
document.addEventListener("DOMContentLoaded", async () => {
  await fetchBookTitles();
});

// Hàm để hiển thị các gợi ý
function showSuggestions(inputElement) {
  const suggestionsBox = inputElement.nextElementSibling; // Lấy thẻ div chứa gợi ý
  const searchTerm = inputElement.value.trim().toLowerCase();

  if (!searchTerm) {
    suggestionsBox.style.display = "none";
    return;
  }

  const filteredBooks = booksList.filter((book) =>
    book.Ten_sach.toLowerCase().includes(searchTerm)
  );

  if (filteredBooks.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  suggestionsBox.innerHTML = filteredBooks
    .map(
      (book) =>
        `<div onclick="selectSuggestion('${book.Ten_sach}', '${inputElement.dataset.rowIndex}')">${book.Ten_sach}</div>`
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// Hàm khi người dùng chọn một gợi ý
// Hàm để hiển thị các gợi ý
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
        `<div onclick="selectSuggestion('${book.Ten_sach}', this)">${book.Ten_sach}</div>` // Hiển thị tên sách
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// Hàm khi người dùng chọn một gợi ý
function selectSuggestion(bookName, suggestionElement) {
  try {
    // Lấy thẻ input chứa gợi ý
    const inputElement = suggestionElement.closest("td").querySelector("input");
    inputElement.value = bookName; // Gán giá trị gợi ý vào ô input

    // Ẩn hộp gợi ý
    const suggestionsBox = suggestionElement.parentElement;
    suggestionsBox.style.display = "none";

    // Tìm sách trong danh sách để lấy thông tin chi tiết
    const selectedBook = booksList.find((b) => b.Ten_sach === bookName);
    if (!selectedBook) {
      console.error(`Không tìm thấy sách: ${bookName}`);
      return;
    }

    // Tự động điền thông tin vào các ô input liên quan
    const row = inputElement.closest("tr");
    const idInput = row.querySelector('input[name="id[]"]');
    const categoryInput = row.querySelector('input[name="category[]"]');
    const authorInput = row.querySelector('input[name="author[]"]');
    const priceInput = row.querySelector('input[name="price[]"]');

    if (idInput) idInput.value = selectedBook.ID_sach || "";
    if (categoryInput) categoryInput.value = selectedBook.The_loai || "";
    if (authorInput) authorInput.value = selectedBook.Ten_tac_gia || "";
    if (priceInput) priceInput.value = selectedBook.Gia || "";
  } catch (error) {
    console.error("Lỗi khi chọn gợi ý:", error);
  }
}

// Hàm thêm hàng mới
function addRow() {
  const tableBody = document.getElementById("table-body");
  const rowIndex = tableBody.children.length;

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><input type="text" name="id[]" placeholder="ID" class="book-no" data-row-index="${rowIndex}" required></td>
    <td class="nameBook">
        <input type="text" name="name[]" placeholder="Book name" class="book-name" data-row-index="${rowIndex}" oninput="showSuggestions(this)" required>
        <div class="autocomplete-suggestions" style="display: none;"></div>
    </td>
    <td><input type="text" name="category[]" placeholder="Category" class="book-category" data-row-index="${rowIndex}" required></td>
    <td><input type="text" name="author[]" placeholder="Author" class="book-author" data-row-index="${rowIndex}" required></td>
    <td><input type="number" name="quantity[]" placeholder="Quantity" class="book-quantity" min="1" data-row-index="${rowIndex}" required></td>
    <td><input type="number" name="price[]" placeholder="Price" class="book-price" step="0.01" min="0" data-row-index="${rowIndex}" required></td>
  `;
  tableBody.appendChild(newRow);
}

// Ẩn gợi ý khi người dùng nhấp bên ngoài
document.addEventListener("click", function (e) {
  if (
    !e.target.matches(".book-name") &&
    !e.target.matches(".autocomplete-suggestions div")
  ) {
    document
      .querySelectorAll(".autocomplete-suggestions")
      .forEach((suggestion) => {
        suggestion.style.display = "none";
      });
  }
});

// Hàm toggle menu
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
    menu.style.left = "-30%"; // Ẩn menu với hiệu ứng trượt
    overlay.style.display = "none";
    icon.textContent = ">";

    // Loại bỏ lớp menu-open để di chuyển icon về vị trí ban đầu
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none";
    }, 300);
  }
}

async function submitBooks() {
  const rows = document.querySelectorAll("#table-body tr");
  const books = [];
  let hasEmptyField = false;
  let totalQuantity = 0;

  // Lặp qua từng dòng sách trong bảng
  rows.forEach((row) => {
    const cells = row.querySelectorAll("input");
    const bookData = {
      no: cells[0].value.trim(),
      name: cells[1].value.trim(),
      category: cells[2].value.trim(),
      author: cells[3].value.trim(),
      quantity: parseInt(cells[4].value.trim()) || 0,
      price: parseFloat(cells[5].value.trim()) || 0,
    };

    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      !bookData.no ||
      !bookData.name ||
      !bookData.category ||
      !bookData.author ||
      bookData.quantity <= 0
    ) {
      hasEmptyField = true;
    }

    totalQuantity += bookData.quantity;
    books.push(bookData);
  });

  try {
    // Làm mới bảng sau khi nhấn Done
    document.getElementById("table-body").innerHTML = `
      <tr>
        <td><input type="text" name="id[]" placeholder="ID" class="book-no" required></td>
        <td class="nameBook">
          <input type="text" name="name[]" placeholder="Book name" class="book-name" oninput="showSuggestions(this)" required>
          <div class="autocomplete-suggestions" style="display: none;"></div>
        </td>
        <td><input type="text" name="category[]" placeholder="Category" class="book-category" required></td>
        <td><input type="text" name="author[]" placeholder="Author" class="book-author" required></td>
        <td><input type="number" name="quantity[]" placeholder="Quantity" class="book-quantity" min="1" required></td>
        <td><input type="number" name="price[]" placeholder="Price" class="book-price" step="0.01" min="0" required></td>
      </tr>
    `;
  } catch (error) {
    // Hiển thị lỗi nếu xảy ra vấn đề khi gọi API
    console.error("Error in submitBooks:", error);
  }
}
