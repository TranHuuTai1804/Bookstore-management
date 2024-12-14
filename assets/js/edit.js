document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("table-body");

  // Function to fetch customer data from the server
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/regulation");
      if (!response.ok) {
        throw new Error("Failed to fetch customer data.");
      }
      const regulations = await response.json();
      populateTable(regulations);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Function to populate the table with customer data
  const populateTable = (regulations) => {
    tableBody.innerHTML = ""; // Clear existing rows

    regulations.forEach((regulation, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                  <td>${regulation.So_luong_nhap_it_nhat}</td>
                  <td>${regulation.So_luong_ton_it_hon}</td>
                  <td>${regulation.Khach_hang_no_khong_qua}</td>
                  <td>${regulation.So_luong_ton_sau_khi_ban_it_nhat}</td>
                  <td>${
                    regulation.Su_Dung_QD4.data[0] === 1 ? "On" : "Off"
                  }</td>
              `;

      tableBody.appendChild(row);
    });
  };

  const addCustomerForm = document.getElementById("addCustomerForm");

  function showAddCustomerForm() {
    addCustomerForm.style.display = "block";
  }

  function hideAddCustomerForm() {
    addCustomerForm.style.display = "none";
  }

  const cancelButton = document.getElementById("cancelButton");
  if (cancelButton) {
    cancelButton.addEventListener("click", hideAddCustomerForm);
  }

  const addRowButton = document.querySelector(".add-row-btn");
  addRowButton.addEventListener("click", showAddCustomerForm);

  // Initial data fetch
  fetchCustomers();
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
