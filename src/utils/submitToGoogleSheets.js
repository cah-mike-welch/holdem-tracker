export async function submitToGoogleSheet(data) {
  const endpoint = "https://script.google.com/macros/s/AKfycbXYZ1234567890/exec"; // Replace with your real script URL

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to submit data");
    }

    console.log("Data submitted to Google Sheets successfully");
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
  }
}
