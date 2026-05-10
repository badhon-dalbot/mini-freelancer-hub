const BASE_URL = "https://freelancerhubbackend.onrender.com";

// GET Request
async function getData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`GET Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

// POST Request
async function postData(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`POST Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

// PUT Request
async function updateData(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`PUT Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

// DELETE Request
async function deleteData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`DELETE Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}
