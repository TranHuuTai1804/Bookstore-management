document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("table-body");

  // Function to fetch customer data from the server
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch customer data.");
      }
      const customers = await response.json();
      populateTable(customers);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Function to populate the table with customer data
  const populateTable = (customers) => {
    tableBody.innerHTML = ""; // Clear existing rows

    customers.forEach((customer, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                  <td>${customer.ID_khach_hang}</td>
                  <td>${customer.Ten_khach_hang}</td>
                  <td>${customer.So_dien_thoai}</td>
                  <td>${customer.Dia_chi}</td>
                  <td>${customer.Email}</td>
                  <td>${customer.Gioi_tinh}</td>
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
