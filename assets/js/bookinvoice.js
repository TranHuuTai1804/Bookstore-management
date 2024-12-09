let booksList = [];

// Hàm lấy danh sách sách từ API và cập nhật mảng booksList
async function fetchBookTitles() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Cập nhật mảng booksList với tên sách, thể loại, tác giả và giá
    booksList = books.map((book) => ({
      Ten_sach: book.Ten_sach,
      The_loai: book.The_loai,
      Gia: book.Gia,
    }));

    // Đảm bảo rằng kết quả được hiển thị sau khi dữ liệu đã được lấy
    console.log("Danh sách sách hiện tại:", booksList);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Gọi hàm fetchBookTitles và đảm bảo rằng dữ liệu được tải xong trước khi cho phép tìm kiếm
document.addEventListener("DOMContentLoaded", async () => {
  await fetchBookTitles(); // Đảm bảo dữ liệu đã được tải về
});

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
        `<div onclick="selectSuggestion('${book.Ten_sach}', '${inputElement.id}')">${book.Ten_sach}</div>` // Hiển thị tên sách
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// Hàm khi người dùng chọn một gợi ý
function selectSuggestion(book, inputId) {
  const inputElement = document.getElementById(inputId);
  inputElement.value = book; // Gán giá trị gợi ý vào ô input
  inputElement.nextElementSibling.style.display = "none"; // Ẩn gợi ý

  // Tìm sách trong danh sách để lấy thông tin Thể loại, Tác giả và Giá
  const selectedBook = booksList.find((b) => b.Ten_sach === book);

  if (selectedBook) {
    // Tự động điền Thể loại, Tác giả và Giá vào các ô input tương ứng
    document.getElementById("categoryInput").value = selectedBook.The_loai;
    document.getElementById("priceInput").value = selectedBook.Gia;
  }
}

// Hàm tính toán giá khi người dùng nhập số lượng
function calculatePrice(inputElement) {
  const quantity = parseInt(inputElement.value); // Lấy giá trị số lượng
  const priceInput = inputElement
    .closest("tr")
    .querySelector("input[name='price1']"); // Lấy ô giá
  const bookName = inputElement
    .closest("tr")
    .querySelector("input[name='book1']").value; // Lấy tên sách

  // Tìm sách tương ứng với tên sách
  const selectedBook = booksList.find((b) => b.Ten_sach === bookName);

  if (selectedBook && quantity > 0) {
    const totalPrice = selectedBook.Gia * quantity; // Tính giá tổng
    priceInput.value = totalPrice; // Cập nhật ô giá
  } else {
    priceInput.value = ""; // Nếu không có sách hoặc số lượng không hợp lệ, xóa giá
  }
}

// Gắn sự kiện 'oninput' vào ô số lượng
document.querySelectorAll("input[name='quantity1']").forEach((inputElement) => {
  inputElement.addEventListener("input", function () {
    calculatePrice(inputElement); // Gọi hàm tính giá khi số lượng thay đổi
  });
});

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
