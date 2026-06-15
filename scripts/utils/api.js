const BASE_URL = "https://freelancerhubbackend.onrender.com/api";

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
  const token = localStorage.getItem("token");

  // Ensures we construct a clean full URL string: http://localhost:5000/api/profile
  const targetUrl = `${BASE_URL}${endpoint}`;

  console.log(`Dispatching network request to: ${targetUrl}`);

  const response = await fetch(targetUrl, {
    method: "PUT", // Swap to 'PUT' if your backend router is configured with router.put()
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  // 1. Catch network or authentication errors BEFORE trying to parse JSON strings
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Server returned status ${response.status}: ${errorText || response.statusText}`,
    );
  }

  // 2. Safe parsing check to protect against "Unexpected end of JSON input" syntax crashes
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    return {
      success: true,
      message: "Resource updated without an explicit JSON payload response.",
    };
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
