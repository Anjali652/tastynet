const form = document.getElementById("addRecipeForm");

// Utility: Convert image file to base64 Data URL
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    // Extract form fields
    const title = formData.get("title");
    const category = formData.get("category");
    const prepTime = formData.get("prepTime");
    const calories = formData.get("calories");
    const difficulty = formData.get("difficulty");
    const ingredientsRaw = formData.get("ingredients");
    const imageFile = formData.get("image");

    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    // Convert image to base64
    const imageBase64 = await toBase64(imageFile);

    // Convert ingredients to array
    const ingredientsArray = ingredientsRaw
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);

    // Build payload
    const payload = {
      title,
      category,
      prepTime,
      calories,
      difficulty,
      ingredients: ingredientsArray,
      image: imageBase64,
    };

    // Send POST request
    const res = await fetch("http://localhost:5000/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to post recipe");

    alert("✅ Recipe posted successfully!");
    form.reset();

    // Switch to home tab
    const homeTab = document.querySelector('[data-tab="home"]');
    if (homeTab) homeTab.click();

    // Reload recipes
    if (typeof loadRecipes === "function") {
      loadRecipes();
    }
  } catch (err) {
    console.error("❌ Error posting recipe:", err);
    alert("Error: " + err.message);
  }
});
